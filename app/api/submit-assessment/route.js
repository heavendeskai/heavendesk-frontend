// app/api/submit-assessment/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Same section keys as in the assessment page
const SECTION_LABELS = {
  frontDesk: "Front Desk & Communication Load",
  benefitsHr: "Benefits, HR & Employee Support Load",
  sales: "Sales, Leads & Website Funnel",
  marketing: "Marketing, Social Media & Presence",
  support: "Support, Communication & Customer Experience",
  hrHiring: "HR, Hiring & Employee Support",
  leadCapture: "Lead Capture & Sales Process",
  techStack: "Tech Stack, Systems & Workflow",
};

// Turn raw answers (0=best, 3=worst) into an “automation potential” score
function computeScores(answers) {
  let totalRaw = 0;
  let totalMax = 0;

  const sections = Object.entries(answers || {}).map(([key, arr]) => {
    const numeric = Array.isArray(arr) ? arr.map((v) => Number(v) || 0) : [];
    const max = numeric.length * 3;

    // High pain = high automation potential => invert 0..3 to 3..0
    const raw = numeric.reduce((sum, val) => sum + (3 - val), 0);

    totalRaw += raw;
    totalMax += max;

    const score = max > 0 ? Math.round((raw / max) * 100) : 0;

    return {
      key,
      label: SECTION_LABELS[key] || key,
      score,
    };
  });

  const overallScore =
    totalMax > 0 ? Math.round((totalRaw / totalMax) * 100) : 0;

  let tier = "High Automation Potential";
  if (overallScore >= 80) tier = "Already Running Smoothly";
  else if (overallScore >= 60) tier = "Ready to Layer Automations";
  else if (overallScore >= 40) tier = "Big Wins Available";

  // Simple quick-wins list based on weakest sections
  const weakest = [...sections].sort((a, b) => a.score - b.score).slice(0, 3);
  const quickWins = weakest.map(
    (sec) =>
      `Heaven can immediately remove busywork in **${sec.label}** by automating repetitive questions, routing, and follow-ups.`
  );

  return { overallScore, tier, sections, quickWins };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { lead = {}, answers = {} } = body || {};

    const scores = computeScores(answers);

    // Map sections to a key → score object for storage
    const categoryScores = {};
    scores.sections.forEach((sec) => {
      categoryScores[sec.key] = sec.score;
    });

    const { data, error } = await supabase
      .from("assessments")
      .insert({
        email: lead.email || null,
        company_name: lead.company || null,
        overall_score: scores.overallScore,
        category_scores: categoryScores,
        payload: { lead, answers },
      })
      .select("id")
      .single();

    if (error) {
      console.error("[submit-assessment] Supabase insert error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to save assessment." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      ...scores,
    });
  } catch (err) {
    console.error("[submit-assessment] Handler error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected error submitting assessment." },
      { status: 500 }
    );
  }
}
