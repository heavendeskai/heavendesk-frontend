// app/api/submit-assessment/route.js
import { NextResponse } from "next/server";

/**
 * Expected JSON payload from the frontend:
 *
 * {
 *   lead: {
 *     name: string,
 *     email: string,
 *     phone?: string,
 *     website?: string
 *   },
 *   answers: {
 *     // each key = section id, each value = array of numbers 0–3
 *     // e.g. operations: [0,2,3,1, ...]
 *     frontDesk: number[],
 *     benefitsHr: number[],
 *     sales: number[],
 *     marketing: number[],
 *     support: number[],
 *     hrHiring: number[],
 *     leadCapture: number[],
 *     techStack: number[]
 *   }
 * }
 */

const SECTION_CONFIG = [
  { key: "frontDesk", label: "Front Desk & Communication Load" },
  { key: "benefitsHr", label: "Benefits, HR & Employee Support" },
  { key: "sales", label: "Sales, Leads & Website Funnel" },
  { key: "marketing", label: "Marketing & Social Presence" },
  { key: "support", label: "Support, Communication & Experience" },
  { key: "hrHiring", label: "HR, Hiring & Employee Support" },
  { key: "leadCapture", label: "Lead Capture & Sales Process" },
  { key: "techStack", label: "Tech Stack, Systems & Workflow" },
];

function computeSectionScore(values = []) {
  if (!values.length) return { raw: 0, max: 0, score: 0 };

  const raw = values.reduce((sum, v) => sum + (Number(v) || 0), 0);
  const max = values.length * 3; // A=0, B=1, C=2, D=3
  const score = Math.round((raw / max) * 100);

  return { raw, max, score };
}

function classifyTier(overallScore) {
  if (overallScore < 40) return "Manual-Heavy";
  if (overallScore < 60) return "Emerging Automation";
  if (overallScore < 80) return "High Leverage Operator";
  return "AI-Ready Business";
}

function findTopBottlenecks(sectionScores, count = 2) {
  const sorted = [...sectionScores].sort((a, b) => a.score - b.score);
  return sorted.slice(0, count);
}

function inferQuickWins(bottlenecks) {
  const wins = [];

  for (const b of bottlenecks) {
    switch (b.key) {
      case "frontDesk":
        wins.push(
          "Turn your most common frontline questions into instant answers.",
          "Add smart triage so calls are routed correctly the first time."
        );
        break;
      case "benefitsHr":
        wins.push(
          "Centralize HR & benefits answers in a simple self-service portal.",
          "Automate reminders for forms, deadlines, and policy updates."
        );
        break;
      case "sales":
        wins.push(
          "Respond to every new lead instantly with an automated first-touch.",
          "Build a simple follow-up sequence so no warm lead goes cold."
        );
        break;
      case "marketing":
        wins.push(
          "Create a weekly content rhythm with pre-scheduled posts.",
          "Automatically capture and respond to social media inquiries."
        );
        break;
      case "support":
        wins.push(
          "Convert your most repeated questions into a smart FAQ flow.",
          "Offer 24/7 support coverage with guided responses."
        );
        break;
      case "hrHiring":
        wins.push(
          "Standardize onboarding checklists and automate status updates.",
          "Route PTO and schedule changes through a single, trackable flow."
        );
        break;
      case "leadCapture":
        wins.push(
          "Add a clear call-to-action and simple form on your website.",
          "Automate lead routing and first response based on source."
        );
        break;
      case "techStack":
        wins.push(
          "Reduce the number of tools your team jumps between every day.",
          "Sync your core tools so data doesn’t have to be re-entered."
        );
        break;
      default:
        break;
    }
  }

  // De-duplicate and keep it tight
  const unique = Array.from(new Set(wins));
  return unique.slice(0, 5);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { lead, answers } = body || {};

    if (!lead || !answers) {
      return NextResponse.json(
        { ok: false, error: "Missing lead or answers payload." },
        { status: 400 }
      );
    }

    // 1) Compute section scores
    const sectionScores = SECTION_CONFIG.map((section) => {
      const values = answers[section.key] || [];
      const { raw, max, score } = computeSectionScore(values);
      return {
        key: section.key,
        label: section.label,
        raw,
        max,
        score,
      };
    });

    // 2) Compute overall score
    const totalRaw = sectionScores.reduce((sum, s) => sum + s.raw, 0);
    const totalMax = sectionScores.reduce((sum, s) => sum + s.max, 0);
    const overallScore =
      totalMax > 0 ? Math.round((totalRaw / totalMax) * 100) : 0;

    // 3) Tier classification
    const tier = classifyTier(overallScore);

    // 4) Top bottlenecks (lowest scores)
    const bottlenecks = findTopBottlenecks(sectionScores, 2);

    // 5) Quick wins inferred from bottlenecks
    const quickWins = inferQuickWins(bottlenecks);

    // 👉 Here is where you'd persist to a DB, send email, trigger SMS, etc.
    // For now we just log it server-side as a placeholder.
    console.log("New HeavenDesk assessment:", {
      lead,
      overallScore,
      tier,
      sectionScores,
      bottlenecks,
    });

    return NextResponse.json(
      {
        ok: true,
        lead: {
          name: lead.name || "",
          email: lead.email || "",
          phone: lead.phone || "",
          website: lead.website || "",
        },
        overallScore,
        tier,
        sections: sectionScores,
        bottlenecks,
        quickWins,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in submit-assessment route:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid request or server error." },
      { status: 500 }
    );
  }
}
