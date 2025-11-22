// app/results/[id]/page.js
// 🔗 Calendly URL with safe default
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/hello-heavendeskai";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Pretty labels for each section key (match your SECTIONS in the assessment page)
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

// Turn whatever we stored in category_scores into a clean array
function buildSectionsFromRow(row) {
  if (!row) return [];

  const cat = row.category_scores || {};

  // If it's already an array of sections, just normalize a bit
  if (Array.isArray(cat)) {
    return cat.map((sec) => ({
      key: sec.key,
      label: sec.label || SECTION_LABELS[sec.key] || sec.key,
      score:
        typeof sec.score === "number"
          ? sec.score
          : typeof sec.value === "number"
          ? sec.value
          : 0,
    }));
  }

  // Otherwise assume it's an object { frontDesk: 50, benefitsHr: 61, ... }
  return Object.entries(cat).map(([key, value]) => ({
    key,
    label: SECTION_LABELS[key] || key,
    score: typeof value === "number" ? value : 0,
  }));
}

// Tier text based on overall score
function getTier(overallScore) {
  if (overallScore >= 75) return "Automation Strong";
  if (overallScore >= 55) return "Big Wins Available";
  if (overallScore >= 35) return "Emerging Automation";
  return "Manual Heavy";
}

// “Owner homework” – what to improve this week (even without Heaven)
function buildOwnerActions(sections) {
  if (!sections || sections.length === 0) return [];

  const TEMPLATES = {
    frontDesk: [
      "Write down your top 10 most common front desk questions and draft one clear answer for each. Keep it by every phone.",
    ],
    benefitsHr: [
      "Create a single, easy-to-find document or page where employees can see PTO rules, benefits contacts, and key dates.",
    ],
    sales: [
      "Pick one main lead channel (website or phone) and create a simple 3-touch follow-up rule you can stick to for 30 days.",
    ],
    marketing: [
      "Choose one social channel and commit to 2 posts per week answering real questions your customers already ask.",
    ],
    support: [
      "List your most common customer complaints and add a short 'what happens next' script your team can read from.",
    ],
    hrHiring: [
      "Document the 5–7 steps of your hiring/onboarding process in a checklist and use it for every new hire.",
    ],
    leadCapture: [
      "Add a single, clear call-to-action on your website (Book a Call / Request Info) instead of multiple scattered links.",
    ],
    techStack: [
      "Pick one manual task you repeat every day and test whether any of your current tools can automate part of it.",
    ],
  };

  const sorted = [...sections].sort((a, b) => a.score - b.score);
  const focus = sorted.slice(0, 3);

  const tips = [];
  focus.forEach((sec) => {
    const arr = TEMPLATES[sec.key];
    if (arr && arr.length > 0) tips.push(...arr);
  });

  return tips;
}

// “Heaven quick wins” – what automations could do immediately
function buildQuickWins(sections) {
  if (!sections || sections.length === 0) return [];

  const sorted = [...sections].sort((a, b) => a.score - b.score);
  const focus = sorted.slice(0, 3);

  return focus.map((sec) => {
    return `Heaven can immediately remove busywork in **${sec.label}** by automating repetitive questions, routing, and follow-ups.`;
  });
}

export default async function ResultsPage({ params }) {
  // params is a Promise in Next 16 app router – unwrap it
  const { id } = await params;

  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("[results] Supabase load error:", error);
    return (
      <main className="assessment-page result-view">
        <div className="assessment-shell">
          <div className="assessment-card">
            <h1 className="assessment-title">
              We couldn’t find that assessment.
            </h1>
            <p className="assessment-subtitle">
              The link may be invalid or the result has been removed.
            </p>
            <Link href="/" className="assessment-button primary">
              Back to HeavenDesk.ai
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const overallScore = data.overall_score ?? 0;
  const tier = getTier(overallScore);
  const sections = buildSectionsFromRow(data);
  const ownerActions = buildOwnerActions(sections);
  const quickWins = buildQuickWins(sections);

  return (
    <main className="assessment-page result-view">
      <div className="assessment-shell">
        {/* TOP SCORE CARD (the new design you like) */}
        <div className="assessment-card">
          <h1 className="assessment-step-title">
            Your HeavenDesk Automation Readiness Score
          </h1>

          <div className="assessment-score-wrapper">
            <div className="assessment-score-main">
              <div className="assessment-score-number">{overallScore}</div>
              <div className="assessment-score-meta">
                <p className="assessment-score-tier">{tier}</p>
                <p className="assessment-score-text">
                  This reflects how much of your current workload is still
                  handled manually — and how much time{" "}
                  <span className="gradient-text">Heaven</span>, your Digital
                  Operations Manager, can give back to your team.
                </p>
              </div>
            </div>
          </div>

          <div className="assessment-cta-result">
            <p>
              If you’d like, Heaven can{" "}
              <strong>build a tailored automation plan</strong> for your
              business and walk you through the exact flows that will save you
              the most time.
            </p>
            <div className="assessment-cta-buttons">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noreferrer"
                className="assessment-button primary"
              >
                Schedule a 25-minute HeavenDesk Discovery Call
              </a>
              <Link href="/" className="assessment-button ghost">
                Back to HeavenDesk.ai
              </Link>
            </div>
          </div>
        </div>

        {/* AREA-BY-AREA BREAKDOWN (bars) */}
        {sections.length > 0 && (
          <div className="assessment-card">
            <h2 className="assessment-step-title">Area-by-area breakdown</h2>
            <div className="assessment-sections-grid">
              {sections.map((sec) => (
                <div
                  key={sec.key}
                  className="assessment-section-score"
                >
                  <div className="assessment-section-top">
                    <span className="assessment-section-label">
                      {sec.label}
                    </span>
                    <span className="assessment-section-value">
                      {sec.score}
                    </span>
                  </div>
                  <div className="assessment-progress-bar small">
                    <div
                      className="assessment-progress-fill"
                      style={{ width: `${sec.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OWNER ACTIONS – what to do this week */}
        {ownerActions.length > 0 && (
          <div className="assessment-card">
            <h2 className="assessment-step-title">
              What you can start improving this week{" "}
              <span className="muted">(even without Heaven)</span>
            </h2>
            <ul className="assessment-quickwins-list">
              {ownerActions.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* HEAVEN QUICK WINS */}
        {quickWins.length > 0 && (
          <div className="assessment-card">
            <h2 className="assessment-step-title">
              Immediate quick wins Heaven can handle for you
            </h2>
            <ul className="assessment-quickwins-list">
              {quickWins.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
