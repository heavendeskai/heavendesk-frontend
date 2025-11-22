"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// 🔗 Calendly URL pulled from env, with a safe default
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/hello-heavendeskai";

const SECTIONS = [
  {
    key: "frontDesk",
    label: "Front Desk & Communication Load",
    eyebrow: "Section 1 of 8",
    questions: [
      {
        id: "c1_1",
        text: "How would you describe your current daily communication load (calls, emails, texts, walk-ins)?",
        options: [
          "Nearly constant. We’re overwhelmed most days.",
          "Busy, but manageable as long as nothing unexpected happens.",
          "Moderate; we get waves but nothing too crazy.",
          "Light; we don’t deal with many incoming questions.",
        ],
      },
      {
        id: "c1_2",
        text: "What happens when your front desk or point-person is unavailable?",
        options: [
          "Things pile up quickly, leading to delays or mistakes.",
          "Other team members scramble to help, but it disrupts their work.",
          "We manage okay, but follow-up sometimes slips through the cracks.",
          "We have solid backup coverage and minimal disruption.",
        ],
      },
      {
        id: "c1_3",
        text: "How often does your team answer the same questions repeatedly?",
        options: [
          "All day, every day. It’s nonstop.",
          "Multiple times a day, usually the same core topics.",
          "A few times a day—annoying, but manageable.",
          "Rarely; our customers/employees are pretty self-sufficient.",
        ],
      },
      {
        id: "c1_4",
        text: "How disruptive are incoming calls/messages to your team’s workflow?",
        options: [
          "Extremely. One interruption derails the whole day.",
          "Significant. It slows down other important tasks.",
          "Mild. We bounce back quickly.",
          "Not disruptive. Our team is built for it.",
        ],
      },
      {
        id: "c1_5",
        text: "How confident are you that every call or question is handled correctly and consistently?",
        options: [
          "Not confident at all — lots of inconsistency.",
          "Somewhat confident — depends who answers.",
          "Mostly confident — only occasional slips.",
          "Very confident — everything is handled consistently.",
        ],
      },
      {
        id: "c1_6",
        text: "If a new customer or employee contacts you right now, what’s their experience like?",
        options: [
          "Hit or miss — depends who picks up and how busy we are.",
          "Usually decent, but long waits or missed calls happen.",
          "Generally smooth, but could be more polished.",
          "Excellent — responsive, clear, and consistent.",
        ],
      },
    ],
  },
  {
    key: "benefitsHr",
    label: "Benefits, HR & Employee Support Load",
    eyebrow: "Section 2 of 8",
    questions: [
      {
        id: "c2_1",
        text: "How often do employees reach out with HR or benefits questions?",
        options: [
          "Constantly — every day, often the same questions.",
          "Frequently — several times a week.",
          "Occasionally — a few times a month.",
          "Rarely — we rarely get HR/benefits questions.",
        ],
      },
      {
        id: "c2_2",
        text: "When employees ask HR questions, how prepared is your team to answer correctly?",
        options: [
          "We’re often unsure and have to look it up.",
          "We know some answers, but not consistently.",
          "Mostly confident but occasionally double-check.",
          "Fully confident — everything is documented and clear.",
        ],
      },
      {
        id: "c2_3",
        text: "How much time does your team spend onboarding new employees or contractors?",
        options: [
          "It takes hours and disrupts our day.",
          "It takes time, but we power through it.",
          "It’s not bad — mostly straightforward.",
          "Very efficient — nearly everything is automated.",
        ],
      },
      {
        id: "c2_4",
        text: "How structured is your process for employee follow-up, reminders, forms, and deadlines?",
        options: [
          "Chaos — lots of forgotten tasks or missing documents.",
          "Semi-structured but still manual and error-prone.",
          "Mostly organized — we keep things on track.",
          "Fully structured — automated reminders and tracking.",
        ],
      },
      {
        id: "c2_5",
        text: "If an employee has an urgent issue (benefits, leave, payroll), what happens?",
        options: [
          "Everything stops — we drop what we’re doing.",
          "We handle it, but it throws off the day.",
          "We resolve it smoothly, most of the time.",
          "There’s a clean protocol with zero disruption.",
        ],
      },
      {
        id: "c2_6",
        text: "How confident are you that every employee gets consistent, accurate information?",
        options: [
          "Not confident — depends who answers and how busy we are.",
          "Somewhat confident — we try but it’s not perfect.",
          "Mostly confident — only minor inconsistencies.",
          "Very confident — everything is clear, accurate, and repeated the same way.",
        ],
      },
    ],
  },
  {
    key: "sales",
    label: "Sales, Leads & Website Funnel",
    eyebrow: "Section 3 of 8",
    questions: [
      {
        id: "c3_1",
        text: "How quickly do you respond to new leads (website, forms, calls, messages)?",
        options: [
          "Hours or next day — sometimes longer.",
          "Within 1–2 hours.",
          "Within 15–30 minutes.",
          "Immediately — near instant.",
        ],
      },
      {
        id: "c3_2",
        text: "How often do leads fall through the cracks because nobody follows up consistently?",
        options: [
          "All the time — it’s a major issue.",
          "Sometimes — not proud of it.",
          "Rarely — we follow up pretty well.",
          "Never — clear system in place.",
        ],
      },
      {
        id: "c3_3",
        text: "What best describes your sales follow-up process?",
        options: [
          "No process — it’s random depending on who’s free.",
          "We try to follow up, but it’s inconsistent.",
          "We have a semi-structured follow-up system.",
          "Fully structured, scheduled, and documented follow-up.",
        ],
      },
      {
        id: "c3_4",
        text: "How easy is it for someone to schedule an appointment or call on your website?",
        options: [
          "Difficult — unclear or manual.",
          "Possible but still manual or slow.",
          "Decent — mostly straightforward.",
          "Instant — automated scheduling.",
        ],
      },
      {
        id: "c3_5",
        text: "How many sales channels do you use right now? (Website, Google, social, ads, DM, SMS, phone, email)",
        options: [
          "Only 1–2 channels.",
          "3–4 channels.",
          "5–6 channels.",
          "7+ channels.",
        ],
      },
      {
        id: "c3_6",
        text: "How confident are you that your website captures every potential lead?",
        options: [
          "Not confident — lots of missed opportunities.",
          "Somewhat confident — but could be better.",
          "Mostly confident.",
          "Very confident — optimized funnel and forms.",
        ],
      },
    ],
  },
  {
    key: "marketing",
    label: "Marketing, Social Media & Presence",
    eyebrow: "Section 4 of 8",
    questions: [
      {
        id: "c4_1",
        text: "How consistently does your business post on social media?",
        options: [
          "Almost never.",
          "A few times a month.",
          "Weekly.",
          "Daily or near-daily.",
        ],
      },
      {
        id: "c4_2",
        text: "Do you currently create content (videos, photos, graphics) in-house or outsource it?",
        options: [
          "We don’t create content at all.",
          "We create some content manually.",
          "We outsource or hire freelancers.",
          "We produce consistent content with a clear system.",
        ],
      },
      {
        id: "c4_3",
        text: "How well does your brand show up on Google (search results, maps, reviews)?",
        options: [
          "Poor visibility.",
          "Some visibility.",
          "Good visibility.",
          "Strong presence — we’re easily found and reviewed.",
        ],
      },
      {
        id: "c4_4",
        text: "How do you manage customer reviews and reputation?",
        options: [
          "We don’t.",
          "We see them but rarely respond.",
          "We respond sometimes.",
          "We actively manage + request reviews.",
        ],
      },
      {
        id: "c4_5",
        text: "How strong is your email or SMS marketing system?",
        options: [
          "No email or SMS marketing.",
          "Weak — inconsistent.",
          "Decent occasional campaigns.",
          "Strong automated campaigns.",
        ],
      },
      {
        id: "c4_6",
        text: "How confident are you in your overall digital presence?",
        options: [
          "Not confident.",
          "Somewhat confident.",
          "Mostly confident.",
          "Very confident.",
        ],
      },
    ],
  },
  {
    key: "support",
    label: "Support, Communication & Customer Experience",
    eyebrow: "Section 5 of 8",
    questions: [
      {
        id: "c5_1",
        text: "How quickly do customers typically receive a response?",
        options: [
          "Hours or next day.",
          "30–60 minutes.",
          "Within 10–20 minutes.",
          "Instantly (automated or staffed).",
        ],
      },
      {
        id: "c5_2",
        text: "How often do customers call or message asking the same repeating questions?",
        options: [
          "Constantly.",
          "Several times a day.",
          "Occasionally.",
          "Rarely — we already have systems.",
        ],
      },
      {
        id: "c5_3",
        text: "How easy is it for customers to find answers without calling you?",
        options: [
          "Very difficult.",
          "Somewhat difficult.",
          "Usually easy.",
          "Extremely easy and intentional.",
        ],
      },
      {
        id: "c5_4",
        text: "How do you currently handle after-hours inquiries?",
        options: [
          "We miss them.",
          "We answer the next day.",
          "A staff member sometimes checks.",
          "Fully covered (automated/chat/outsourced).",
        ],
      },
      {
        id: "c5_5",
        text: "Do customers regularly complain about delays, confusion, or missed messages?",
        options: ["Yes, often.", "Sometimes.", "Rarely.", "Almost never."],
      },
      {
        id: "c5_6",
        text: "How confident are you in your overall customer experience?",
        options: [
          "Not confident.",
          "Somewhat confident.",
          "Mostly confident.",
          "Very confident.",
        ],
      },
    ],
  },
  {
    key: "hrHiring",
    label: "HR, Hiring & Employee Support",
    eyebrow: "Section 6 of 8",
    questions: [
      {
        id: "c6_1",
        text: "How often do employees ask HR or management the same recurring questions?",
        options: [
          "All the time.",
          "A few times per week.",
          "Occasionally.",
          "Rarely — we have clear systems.",
        ],
      },
      {
        id: "c6_2",
        text: "How do employees currently access HR information (policies, PTO, handbooks, benefits)?",
        options: [
          "They have to ask someone.",
          "We share PDFs or email them.",
          "We have a shared folder.",
          "We have a self-service system.",
        ],
      },
      {
        id: "c6_3",
        text: "How organized is your hiring and onboarding process?",
        options: [
          "Very messy — hard to track.",
          "Somewhat organized, but inconsistent.",
          "Mostly clear.",
          "Fully documented and automated.",
        ],
      },
      {
        id: "c6_4",
        text: "How do you handle PTO, time-off requests, or schedule changes?",
        options: [
          "Verbal/text messages — chaotic.",
          "Someone manually keeps track.",
          "A basic system.",
          "A streamlined automated process.",
        ],
      },
      {
        id: "c6_5",
        text: "When employees have questions about benefits, who handles them?",
        options: [
          "Management or HR (causes interruptions).",
          "Someone on the admin team.",
          "We redirect to our broker/TPA.",
          "Already automated/self-service.",
        ],
      },
      {
        id: "c6_6",
        text: "How confident are you that employees receive accurate, consistent HR information?",
        options: [
          "Not confident.",
          "Somewhat confident.",
          "Mostly confident.",
          "Very confident.",
        ],
      },
    ],
  },
  {
    key: "leadCapture",
    label: "Lead Capture & Sales Process",
    eyebrow: "Section 7 of 8",
    questions: [
      {
        id: "c7_1",
        text: "How do you currently capture new leads from your website?",
        options: [
          "We don’t have a clear system / leads get lost.",
          "Manual: forms go to email.",
          "Basic CRM or spreadsheet.",
          "Fully automated pipelines.",
        ],
      },
      {
        id: "c7_2",
        text: "How quickly does your business typically respond to new leads?",
        options: [
          "Hours to days.",
          "A few hours.",
          "Within 1 hour.",
          "Automatically or instantly.",
        ],
      },
      {
        id: "c7_3",
        text: "What happens when someone calls about services or pricing?",
        options: [
          "They often hit voicemail or wait on hold.",
          "Someone answers when possible.",
          "We have some routing.",
          "Fully handled with scripts or automation.",
        ],
      },
      {
        id: "c7_4",
        text: "How is your follow-up or nurturing process handled?",
        options: [
          "We don’t consistently follow up.",
          "Manual texts/emails.",
          "Some automation.",
          "Fully automated sequences.",
        ],
      },
      {
        id: "c7_5",
        text: "How well do you track where leads are coming from (ads, social, referrals, etc.)?",
        options: [
          "We don’t track it.",
          "Sometimes.",
          "Most sources.",
          "Fully tracked and labeled.",
        ],
      },
      {
        id: "c7_6",
        text: "How often do you lose leads because no one followed up fast enough?",
        options: [
          "Constantly.",
          "Sometimes.",
          "Rare.",
          "Never — we have a great system.",
        ],
      },
    ],
  },
  {
    key: "techStack",
    label: "Tech Stack, Systems & Workflow",
    eyebrow: "Section 8 of 8",
    questions: [
      {
        id: "c8_1",
        text: "How many different systems does your team use daily?",
        options: [
          "6+ tools (chaos).",
          "4–5 tools.",
          "2–3 tools.",
          "Mostly one main platform.",
        ],
      },
      {
        id: "c8_2",
        text: "Do your systems integrate with each other?",
        options: [
          "Nothing connects — everything is manual.",
          "A few things connect.",
          "Most tools sync in some way.",
          "Fully integrated workflows.",
        ],
      },
      {
        id: "c8_3",
        text: "How often do you repeat the same task across multiple systems (copy/paste)?",
        options: ["Constantly.", "Daily.", "Sometimes.", "Rarely or never."],
      },
      {
        id: "c8_4",
        text: "How do you currently store documents, policies, SOPs, or HR/Benefits files?",
        options: [
          "Scattered everywhere (email, desktops, paper, etc.).",
          "Basic shared folder.",
          "Organized system.",
          "Structured repository with permissions.",
        ],
      },
      {
        id: "c8_5",
        text: "How do you track operational metrics (calls, time, tasks, errors)?",
        options: [
          "No tracking.",
          "Manual spreadsheets.",
          "Basic software.",
          "Full dashboards and reporting.",
        ],
      },
      {
        id: "c8_6",
        text: "How confident are you in your current tech stack’s ability to scale?",
        options: [
          "It’s holding us back.",
          "It’s okay, but we’ll outgrow it.",
          "It’s solid.",
          "Fully scalable and optimized.",
        ],
      },
    ],
  },
];

const OPTION_VALUE = [0, 1, 2, 3]; // A,B,C,D => 0..3

export default function AssessmentPage() {
  const router = useRouter();

  // Contact details assumed captured earlier (from hero CTA)
  const [lead] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
  });

  const [answers, setAnswers] = useState(() => {
    const base = {};
    SECTIONS.forEach((section) => {
      base[section.key] = {};
    });
    return base;
  });

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // currently unused, but kept so UI doesn’t break
  const [error, setError] = useState("");

  const totalQuestions = useMemo(
    () => SECTIONS.reduce((sum, section) => sum + section.questions.length, 0),
    []
  );

  const currentSection = SECTIONS[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];

  const questionIndexGlobal = useMemo(() => {
    let index = 0;
    for (let i = 0; i < currentSectionIndex; i++) {
      index += SECTIONS[i].questions.length;
    }
    index += currentQuestionIndex;
    return index;
  }, [currentSectionIndex, currentQuestionIndex]);

  const progressPercent = ((questionIndexGlobal + 1) / totalQuestions) * 100;

  const handleSelect = (sectionKey, questionIndex, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [questionIndex]: OPTION_VALUE[optionIndex],
      },
    }));
  };

  const currentAnswerValue = answers[currentSection.key]?.[currentQuestionIndex];

  const isCurrentSectionComplete = useMemo(() => {
    const sectionAnswers = answers[currentSection.key] || {};
    return currentSection.questions.every(
      (_, idx) => typeof sectionAnswers[idx] === "number"
    );
  }, [answers, currentSection]);

  const canGoNext = !result && !submitting && isCurrentSectionComplete;

  const handleAnswered = (sectionKey, qIndex, optIndex) => {
    handleSelect(sectionKey, qIndex, optIndex);

    const isLastQuestionInSection =
      qIndex === currentSection.questions.length - 1;
    const isLastSection = currentSectionIndex === SECTIONS.length - 1;

    if (!isLastQuestionInSection) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) =>
          prev === qIndex ? prev + 1 : prev
        );
      }, 140);
    } else if (!isLastSection) {
      // End of section – wait for Next Section click
    } else {
      // End of last section – See My Results will trigger submit
    }
  };

  const goNext = async () => {
    if (!canGoNext) return;
    setError("");

    const isLastSection = currentSectionIndex === SECTIONS.length - 1;

    if (!isLastSection) {
      setCurrentSectionIndex((s) => s + 1);
      setCurrentQuestionIndex(0);
    } else {
      await handleSubmit();
    }
  };

  const goBack = () => {
    if (submitting || result) return;

    if (currentSectionIndex === 0 && currentQuestionIndex === 0) {
      return;
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
    } else {
      const prevSectionIndex = currentSectionIndex - 1;
      const prevQuestionsCount =
        SECTIONS[prevSectionIndex].questions.length;
      setCurrentSectionIndex(prevSectionIndex);
      setCurrentQuestionIndex(prevQuestionsCount - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");

      // Build numeric answers payload
      const answersPayload = {};
      SECTIONS.forEach((section) => {
        const sectionAnswers = answers[section.key] || {};
        answersPayload[section.key] = section.questions.map((_, idx) => {
          const val = sectionAnswers[idx];
          return typeof val === "number" ? val : 0;
        });
      });

      // 🔄 Payload now matches /api/submit-assessment
      const payload = {
        lead,
        answers: answersPayload,
      };

      const res = await fetch("/api/submit-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = "Failed to submit assessment.";
        try {
          const err = await res.json();
          if (err?.error) message = err.error;
        } catch (_) {
          // ignore JSON parse failure
        }
        throw new Error(message);
      }

      const data = await res.json();

      if (!data.id) {
        throw new Error("Missing assessment id from server.");
      }

      router.push(`/results/${data.id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to submit assessment.");
      setSubmitting(false);
    }
  };

  return (
    <main className="assessment-page">
      <div className="assessment-shell">
        {/* Header */}
        <header className="assessment-header">
          <p className="assessment-eyebrow">
            {result
              ? "Your Automation Readiness Snapshot"
              : "HeavenDesk Automation Readiness Assessment"}
          </p>
          <h1 className="assessment-title">
            {result
              ? "Here’s how your business is performing today."
              : "Let’s map where your business is losing time."}
          </h1>
          {!result && (
            <p className="assessment-subtitle">
              Answer a few quick questions and I’ll show you exactly where{" "}
              <span className="gradient-text">Heaven</span>, your Digital
              Operations Manager, can save you the most time.
            </p>
          )}
        </header>

        {/* Progress */}
        {!result && (
          <div className="assessment-progress">
            <div className="assessment-progress-label">
              {currentSection.eyebrow} • Question{" "}
              {currentQuestionIndex + 1} of{" "}
              {currentSection.questions.length}
            </div>
            <div className="assessment-progress-bar">
              <div
                className="assessment-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="assessment-body">
          {!result && (
            <SectionQuestionStep
              section={currentSection}
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              answers={answers[currentSection.key] || {}}
              onAnswered={handleAnswered}
            />
          )}

          {result && <ResultsStep result={result} />}

          {error && <p className="assessment-error">{error}</p>}
        </div>

        {/* Footer nav */}
        <footer className="assessment-nav">
          {!result && (
            <>
              <button
                type="button"
                className="assessment-button ghost"
                onClick={goBack}
                disabled={
                  submitting ||
                  (currentSectionIndex === 0 &&
                    currentQuestionIndex === 0)
                }
              >
                Back
              </button>

              <button
                type="button"
                className="assessment-button primary"
                onClick={goNext}
                disabled={!canGoNext}
              >
                {submitting
                  ? "Scoring your results..."
                  : currentSectionIndex === SECTIONS.length - 1
                  ? "See My Results"
                  : "Next Section"}
              </button>
            </>
          )}

          {result && (
            <a href="/" className="assessment-button ghost">
              Back to HeavenDesk.ai
            </a>
          )}
        </footer>
      </div>
    </main>
  );
}

function SectionQuestionStep({
  section,
  question,
  questionIndex,
  answers,
  onAnswered,
}) {
  return (
    <div className="assessment-card">
      <div className="assessment-step-header-row">
        <span className="section-eyebrow">{section.eyebrow}</span>
        <h2 className="assessment-step-title">{section.label}</h2>
      </div>
      <div className="assessment-questions">
        <div className="assessment-question" key={question.id}>
          <p className="assessment-question-text">{question.text}</p>
          <div className="assessment-options">
            {question.options.map((opt, optIndex) => {
              const selected =
                answers[questionIndex] === OPTION_VALUE[optIndex];
              return (
                <button
                  key={optIndex}
                  type="button"
                  className={
                    "assessment-option" + (selected ? " selected" : "")
                  }
                  onClick={() =>
                    onAnswered(section.key, questionIndex, optIndex)
                  }
                >
                  <span className="assessment-option-label">
                    {String.fromCharCode(65 + optIndex)}.
                  </span>
                  <span className="assessment-option-text">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsStep({ result }) {
  const { overallScore, tier, sections, quickWins } = result || {
    overallScore: 0,
    tier: "",
    sections: [],
    quickWins: [],
  };

  const ownerActions = useMemo(() => {
    const TEMPLATES = {
      frontDesk: [
        "Write down your top 10 most common front desk questions and draft one clear answer for each. Keep it by every phone.",
      ],
      benefitsHr: [
        "Create a single, easy-to-find document or page where employees can see PTO, benefits contacts, and key dates.",
      ],
      sales: [
        "Pick one lead channel (website or phone) and create a simple 3-touch follow-up rule you can stick to for 30 days.",
      ],
      marketing: [
        "Choose one social channel and commit to 2 posts per week that answer real questions your customers ask.",
      ],
      support: [
        "List your most common customer complaints and add a short 'What happens next' script your team can read from.",
      ],
      hrHiring: [
        "Document the 5 steps of your hiring/onboarding process in a checklist and use it for every new hire.",
      ],
      leadCapture: [
        "Add a single, clear call-to-action on your website (Book a Call / Request Info) instead of multiple scattered links.",
      ],
      techStack: [
        "Pick one manual task you repeat every day and explore if your current tools can automate even part of it.",
      ],
    };

    if (!sections || sections.length === 0) return [];

    const sorted = [...sections].sort((a, b) => a.score - b.score);
    const worst = sorted.slice(0, 3);

    const tips = [];
    worst.forEach((sec) => {
      const arr = TEMPLATES[sec.key];
      if (arr && arr.length > 0) {
        tips.push(...arr);
      }
    });

    return tips;
  }, [sections]);

  return (
    <div className="assessment-card">
      <h2 className="assessment-step-title">
        Your HeavenDesk Automation Readiness Score
      </h2>

      <div className="assessment-score-wrapper">
        <div className="assessment-score-main">
          <div className="assessment-score-number">{overallScore}</div>
          <div className="assessment-score-meta">
            <p className="assessment-score-tier">{tier}</p>
            <p className="assessment-score-text">
              This reflects how much of your current workload is still
              handled manually — and how much time{" "}
              <span className="gradient-text">Heaven</span>, your Digital
              Operations Manager, can give back.
            </p>
          </div>
        </div>
      </div>

      {sections && sections.length > 0 && (
        <div className="assessment-sections-breakdown">
          <h3>Area-by-area breakdown</h3>
          <div className="assessment-sections-grid">
            {sections.map((sec) => (
              <div key={sec.key} className="assessment-section-score">
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

      {ownerActions && ownerActions.length > 0 && (
        <div className="assessment-quickwins">
          <h3>What you can start improving this week (even without Heaven)</h3>
          <ul>
            {ownerActions.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {quickWins && quickWins.length > 0 && (
        <div className="assessment-quickwins">
          <h3>Immediate quick wins Heaven can handle for you</h3>
          <ul>
            {quickWins.map((win, idx) => (
              <li key={idx}>{win}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="assessment-cta-result">
        <p>
          If you’d like, Heaven can{" "}
          <strong>build a tailored automation plan</strong> for your
          business and walk you through the exact flows that will save you
          the most time.
        </p>
        {/* 🔗 This now opens your Calendly link in a new tab */}
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noreferrer"
          className="assessment-button primary"
        >
          Schedule a 25-minute HeavenDesk Discovery Call
        </a>
      </div>
    </div>
  );
}
