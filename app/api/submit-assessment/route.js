// app/api/submit-assessment/route.js

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

function computeScores(answers) {
  let totalRaw = 0;
  let totalMax = 0;

  const sections = Object.entries(answers || {}).map(([key, arr]) => {
    const numeric = Array.isArray(arr) ? arr.map((v) => Number(v) || 0) : [];
    const max = numeric.length * 3;
    const raw = numeric.reduce((sum, val) => sum + (3 - val), 0);

    totalRaw += raw;
    totalMax += max;

    const score = max > 0 ? Math.round((raw / max) * 100) : 0;

    return { key, label: SECTION_LABELS[key] || key, score };
  });

  const overallScore =
    totalMax > 0 ? Math.round((totalRaw / totalMax) * 100) : 0;

  let tier = "High Automation Potential";
  if (overallScore >= 80) tier = "Already Running Smoothly";
  else if (overallScore >= 60) tier = "Ready to Layer Automations";
  else if (overallScore >= 40) tier = "Big Wins Available";

  const weakest = [...sections].sort((a, b) => a.score - b.score).slice(0, 3);

  const quickWins = weakest.map(
    (sec) =>
      `HeavenDesk.ai can immediately remove busywork in **${sec.label}** by automating repetitive questions, routing, and follow-ups.`
  );

  return { overallScore, tier, sections, quickWins };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { lead = {}, answers = {} } = body || {};

    const scores = computeScores(answers);

    const categoryScores = {};
    scores.sections.forEach((sec) => {
      categoryScores[sec.key] = sec.score;
    });

    // SAVE TO SUPABASE
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

    const id = data.id;
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://heavendeskai.com";
    const resultUrl = `${baseUrl}/results/${id}`;

    // ---------------------------------------------------------
    // TEMPORARILY DISABLED EMAIL SENDING (Resend domain pending)
    // ---------------------------------------------------------
    /*
    await resend.emails.send({
      from: "HeavenDesk.ai <hello@heavendeskai.com>",
      to: "ja@heavendeskai.com",
      subject: "New HeavenDesk.ai Assessment Completed",
      html: `
        <h2>New Assessment Completed</h2>
        <p><strong>Name:</strong> ${lead.name || "(none)"}</p>
        <p><strong>Email:</strong> ${lead.email || "(none)"}</p>
        <p><strong>Company:</strong> ${lead.company || "(none)"}</p>
        <p><strong>Overall Score:</strong> ${scores.overallScore}</p>
        <p><a href="${resultUrl}">View Results</a></p>
      `,
    });

    if (lead.email) {
      await resend.emails.send({
        from: "HeavenDesk.ai <hello@heavendeskai.com>",
        to: lead.email,
        subject: "Your HeavenDesk.ai Assessment Results",
        html: `
          <div style="font-family:system-ui;background:#0f172a;padding:24px;color:white;">
            <h1>Your Results Are Ready</h1>
            <h2>${scores.overallScore}/100 — ${scores.tier}</h2>
            <p>
              <a href="${resultUrl}" style="background:linear-gradient(135deg,#22d3ee,#f97316);
                padding:12px 20px;border-radius:16px;color:black;font-weight:600;text-decoration:none;">
                View My Results
              </a>
            </p>
            <p style="margin-top:20px;">
              Schedule a call with Jorge:
              <a href="https://calendly.com/hello-heavendeskai"
                 style="color:#38bdf8;text-decoration:underline;">
                Book a Call
              </a>
            </p>
          </div>
        `,
      });
    }
    */

    return NextResponse.json({
      ok: true,
      id,
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
