"use client";

import { useState } from "react";

const totalSections = 10;

// Shared inline styles so we don’t rely on globals.css parsing correctly
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #263247",
  background: "rgba(4, 11, 24, 0.95)",
  color: "#f5f7ff",
  fontSize: "0.9rem",
  outline: "none",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

const textAreaStyle = {
  ...inputStyle,
  borderRadius: "18px",
  minHeight: "90px",
  resize: "vertical",
};

const chipLabelStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 10px",
  borderRadius: "999px",
  border: "1px solid #263247",
  background: "rgba(5, 15, 32, 0.95)",
  fontSize: "0.85rem",
  marginRight: "8px",
  marginBottom: "8px",
  cursor: "pointer",
};

const chipCheckboxStyle = {
  accentColor: "#3ab5ff",
};

const smallLabelStyle = {
  fontSize: "0.8rem",
  opacity: 0.9,
};

export default function DiscoveryForm() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Single big form state – easier to send to API / Sheets later
  const [form, setForm] = useState({
    // Section 1
    firmType: "",
    name: "",
    company: "",
    role: "",
    years: "",
    mattersPerYear: "",

    // Section 2
    workflowStages: [],
    workflowStageMostTime: "",

    // Section 3
    emailsPerDay: "",
    emailProblems: [],
    emailRepeats: "",

    // Section 4
    docStorage: [],
    docAlwaysLate: [],
    docSlowReasons: [],

    // Section 5
    intakeChannel: "",
    intakeSlowReasons: [],
    intakeFields: "",

    // Section 6
    onboardingSlowReasons: [],
    onboardingQuestions: "",

    // Section 7
    topTimeDrains: "",
    topDelays: "",

    // Section 8
    emailSystems: "",
    crmSystems: "",
    chatPhoneSystems: "",
    projectTools: "",
    integrationLevel: "",
    mustConnectTools: "",

    // Section 9
    scriptsStatus: "",
    hasSops: "",
    neverShare: "",
    humanOnlyDecisions: "",
    toneOfVoice: "",

    // Section 10
    success30to90: "",
    extraNotes: "",
  });

  const sectionTitles = [
    "Contact & Firm Profile",
    "Your Current Workflow",
    "Email Workflow",
    "Document Handling",
    "Buyer / Client Intake",
    "Onboarding & Client Setup",
    "Deal / Matter Cycle Pain Points",
    "Systems & Tools",
    "Rules & Guardrails",
    "Success in the Next 30–90 Days",
  ];

  // Generic change handlers
  const handleChange = (name) => (e) => {
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleCheckboxGroup = (name, value) => (e) => {
    const checked = e.target.checked;
    setForm((prev) => {
      const current = new Set(prev[name] || []);
      if (checked) current.add(value);
      else current.delete(value);
      return { ...prev, [name]: Array.from(current) };
    });
  };

  const progressPercent = ((sectionIndex + 1) / totalSections) * 100;

  const goNext = () => {
    setError("");
    if (sectionIndex < totalSections - 1) {
      setSectionIndex((i) => i + 1);
    }
  };

  const goBack = () => {
    setError("");
    if (sectionIndex > 0 && !submitting) {
      setSectionIndex((i) => i - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // If they hit Enter before the last section, just advance
    if (sectionIndex < totalSections - 1) {
      goNext();
      return;
    }

    try {
      setSubmitting(true);

      // Adjust endpoint later if you wire to Supabase / Sheets
      const res = await fetch("/api/submit-discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Unable to submit discovery. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Something went wrong submitting your discovery."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="discovery-page">
      <div
        style={{
          maxWidth: "1024px",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <header className="discovery-header">
        <p className="discovery-eyebrow">HEAVENDESK.ai DISCOVERY</p>
        <h1 className="discovery-title gradient-text">
          Let&apos;s map where manual work is draining your day.
        </h1>
        <p className="discovery-subtitle">
          This is a short discovery focused on your real workflow and bottlenecks — so we can see
          exactly what HeavenDesk should take over first. No right or wrong answers, just how
          things work today.
        </p>
      </header>

      {!submitted && (
        <div className="discovery-progress">
          <div className="discovery-progress-label">
            Section {sectionIndex + 1} of {totalSections}
          </div>
          <div className="discovery-progress-bar">
            <div
              className="discovery-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="discovery-card">
          {submitted ? (
            <SubmittedScreen />
          ) : (
            <>
              <div className="discovery-step-header-row">
                <span className="discovery-section-eyebrow">
                  SECTION {sectionIndex + 1}
                </span>
                <h2 className="discovery-section-title">
                  {sectionTitles[sectionIndex]}
                </h2>
              </div>

              <div className="discovery-section-body">
                {renderSection(sectionIndex, form, {
                  handleChange,
                  handleCheckboxGroup,
                })}
              </div>
            </>
          )}
        </div>

        {!submitted && (
          <footer className="discovery-footer-nav">
            <button
              type="button"
              className="assessment-button ghost"
              onClick={goBack}
              disabled={sectionIndex === 0 || submitting}
            >
              Back
            </button>

            <button
              type={sectionIndex === totalSections - 1 ? "submit" : "button"}
              className="assessment-button primary"
              onClick={sectionIndex === totalSections - 1 ? undefined : goNext}
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : sectionIndex === totalSections - 1
                ? "Submit discovery"
                : "Next Section"}
            </button>
          </footer>
        )}

        <p className="discovery-disclaimer">
          By submitting, you agree HeavenDesk.ai can use this information solely to design a
          potential HeavenDesk workflow for your firm and follow up with you about it. No spam.
          No sharing your data.
        </p>

        {error && <p className="discovery-error">{error}</p>}
      </form>
      </div>
    </main>
  );
}

/**
 * Per-section rendering
 */
function renderSection(index, form, helpers) {
  const { handleChange, handleCheckboxGroup } = helpers;

  switch (index) {
    // SECTION 1 — PROFILE
    case 0:
      return (
        <div className="discovery-fields">
          <p style={smallLabelStyle}>
            Short, structured questions so I can see your real workflow, deal / matter cycle, and
            admin bottlenecks. Approximate answers are fine.
          </p>

          <div className="discovery-field">
            <label>What best describes your firm?</label>
            <select
              style={selectStyle}
              value={form.firmType}
              onChange={handleChange("firmType")}
            >
              <option value="">Select one</option>
              <option value="ma-brokerage">M&amp;A Brokerage</option>
              <option value="law-firm">Law Firm</option>
              <option value="accounting-finance">Accounting / Finance</option>
              <option value="consulting">Consulting Agency</option>
              <option value="real-estate">Real Estate</option>
              <option value="construction-services">
                Construction / Services
              </option>
              <option value="general-business">General Business / Other</option>
            </select>
          </div>

          <div className="discovery-grid-2">
            <div className="discovery-field">
              <label>Your Name</label>
              <input
                type="text"
                style={inputStyle}
                value={form.name}
                onChange={handleChange("name")}
              />
            </div>
            <div className="discovery-field">
              <label>Company Name</label>
              <input
                type="text"
                style={inputStyle}
                value={form.company}
                onChange={handleChange("company")}
              />
            </div>
          </div>

          <div className="discovery-grid-2">
            <div className="discovery-field">
              <label>Your Role</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="Owner, partner, principal, manager, etc."
                value={form.role}
                onChange={handleChange("role")}
              />
            </div>
            <div className="discovery-field">
              <label>Years in business / industry</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="e.g. 3, 7, 15+"
                value={form.years}
                onChange={handleChange("years")}
              />
            </div>
          </div>

          <div className="discovery-field">
            <label>
              Number of active matters / deals / projects per year (roughly)
            </label>
            <select
              style={selectStyle}
              value={form.mattersPerYear}
              onChange={handleChange("mattersPerYear")}
            >
              <option value="">Select one</option>
              <option value="1-5">1–5</option>
              <option value="6-15">6–15</option>
              <option value="16-30">16–30</option>
              <option value="30plus">30+</option>
            </select>
          </div>
        </div>
      );

    // SECTION 2 — WORKFLOW
    case 1:
      return (
        <div className="discovery-fields">
          <p>
            Engagement / deal pipeline stages you personally handle (check all
            that apply)
          </p>

          <div className="discovery-chips">
            {[
              "Prospecting / lead generation",
              "Preparing clients / assets / cases for review",
              "Client / buyer outreach",
              "Qualification",
              "Intake paperwork",
              "Package / materials distribution (CIM, packets, briefs)",
              "Handling questions / objections",
              "Onboarding (client, buyer, stakeholder)",
              "Document collection",
              "Scheduling calls / meetings",
              "Coordination with third parties (CPA, attorney, vendors)",
              "Status updates and reporting",
              "Closing / wrap-up",
              "Other",
            ].map((label) => (
              <label key={label} style={chipLabelStyle}>
                <input
                  type="checkbox"
                  style={chipCheckboxStyle}
                  checked={(form.workflowStages || []).includes(label)}
                  onChange={handleCheckboxGroup("workflowStages", label)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="discovery-field">
            <label>Which stage consumes you the most time?</label>
            <textarea
              style={textAreaStyle}
              value={form.workflowStageMostTime}
              onChange={handleChange("workflowStageMostTime")}
            />
          </div>
        </div>
      );

    // SECTION 3 — EMAIL
    case 2:
      return (
        <div className="discovery-fields">
          <div className="discovery-field">
            <label>Approx. number of emails you receive daily</label>
            <select
              style={selectStyle}
              value={form.emailsPerDay}
              onChange={handleChange("emailsPerDay")}
            >
              <option value="">Select one</option>
              <option value="10-25">10–25</option>
              <option value="25-50">25–50</option>
              <option value="50-100">50–100</option>
              <option value="100plus">100+</option>
            </select>
          </div>

          <div className="discovery-field">
            <label>
              What email problems do you face most often? (check all that
              apply)
            </label>
            <div className="discovery-chips">
              {[
                "Important emails get buried",
                "Too many repetitive replies",
                "Documents get lost in threads",
                "Clients / buyers send follow-ups constantly",
                "Senders are slow to respond",
                "Can’t find key emails quickly",
                "Email volume feels overwhelming",
                "No clean organization system",
                "Hard to track what’s missing or next",
                "Losing track of next steps for each matter / deal",
              ].map((label) => (
                <label key={label} style={chipLabelStyle}>
                  <input
                    type="checkbox"
                    style={chipCheckboxStyle}
                    checked={(form.emailProblems || []).includes(label)}
                    onChange={handleCheckboxGroup("emailProblems", label)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="discovery-field">
            <label>Which emails do you repeat the most?</label>
            <textarea
              style={textAreaStyle}
              placeholder={`e.g. “Here’s the NDA”, “Here’s the CIM”, status updates, next steps…`}
              value={form.emailRepeats}
              onChange={handleChange("emailRepeats")}
            />
          </div>
        </div>
      );

    // SECTION 4 — DOCUMENTS
    case 3:
      return (
        <div className="discovery-fields">
          <div className="discovery-field">
            <label>
              Where do you store documents today? (check all that apply)
            </label>
            <div className="discovery-chips">
              {[
                "Email only",
                "Google Drive",
                "Dropbox",
                "OneDrive / SharePoint",
                "HubSpot / CRM",
                "Local folders / desktops",
                "Mix of locations",
                "No standard system",
              ].map((label) => (
                <label key={label} style={chipLabelStyle}>
                  <input
                    type="checkbox"
                    style={chipCheckboxStyle}
                    checked={(form.docStorage || []).includes(label)}
                    onChange={handleCheckboxGroup("docStorage", label)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="discovery-field">
            <label>
              Which documents are always late or missing? (check all that
              apply)
            </label>
            <div className="discovery-chips">
              {[
                "Financials (P&L, Balance Sheet)",
                "Tax returns",
                "Legal documents",
                "Seller / client disclosures",
                "Buyer proof of funds / qualification",
                "Signed NDAs",
                "LOIs / proposals",
                "Due diligence items",
                "Closing documents",
              ].map((label) => (
                <label key={label} style={chipLabelStyle}>
                  <input
                    type="checkbox"
                    style={chipCheckboxStyle}
                    checked={(form.docAlwaysLate || []).includes(label)}
                    onChange={handleCheckboxGroup("docAlwaysLate", label)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="discovery-field">
            <label>
              What slows you down the most with documents? (check all that
              apply)
            </label>
            <div className="discovery-chips">
              {[
                "Chasing clients / sellers for docs",
                "Organizing files",
                "Naming files consistently",
                "Turning email attachments into structured folders",
                "Sending the same documents to multiple buyers / parties",
                "Keeping track of what’s missing",
                "All of the above",
              ].map((label) => (
                <label key={label} style={chipLabelStyle}>
                  <input
                    type="checkbox"
                    style={chipCheckboxStyle}
                    checked={(form.docSlowReasons || []).includes(label)}
                    onChange={handleCheckboxGroup("docSlowReasons", label)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );

    // SECTION 5 — INTAKE
    case 4:
      return (
        <div className="discovery-fields">
          <div className="discovery-field">
            <label>How do buyers / clients usually contact you first?</label>
            <select
              style={selectStyle}
              value={form.intakeChannel}
              onChange={handleChange("intakeChannel")}
            >
              <option value="">Select one</option>
              <option value="email">Email</option>
              <option value="website-form">Website form</option>
              <option value="referral-email">Referral → Email</option>
              <option value="phone">Phone call</option>
              <option value="social-dm">Social / DM</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="discovery-field">
            <label>
              What slows down buyer / client intake the most? (check all that
              apply)
            </label>
            <div className="discovery-chips">
              {[
                "Answering repetitive questions",
                "Sending NDAs / agreements",
                "Sending information packets / CIMs",
                "Collecting buyer / client info",
                "Qualifying buyers / clients",
                "Scheduling calls",
                "Document requests",
                "Verifying seriousness / fit",
                "All of the above",
              ].map((label) => (
                <label key={label} style={chipLabelStyle}>
                  <input
                    type="checkbox"
                    style={chipCheckboxStyle}
                    checked={(form.intakeSlowReasons || []).includes(label)}
                    onChange={handleCheckboxGroup("intakeSlowReasons", label)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="discovery-field">
            <label>
              What info do you typically collect from new buyers / clients?
            </label>
            <textarea
              style={textAreaStyle}
              value={form.intakeFields}
              onChange={handleChange("intakeFields")}
            />
          </div>
        </div>
      );

    // SECTION 6 — ONBOARDING
    case 5:
      return (
        <div className="discovery-fields">
          <div className="discovery-field">
            <label>
              What slows sellers / clients down the most? (check all that
              apply)
            </label>
            <div className="discovery-chips">
              {[
                "Getting documents prepared",
                "Missing financials / data",
                "Not understanding next steps",
                "Slow replies",
                "Need hand-holding",
                "Repetitive onboarding questions",
                "Unclear timelines",
                "Data room / folder confusion",
              ].map((label) => (
                <label key={label} style={chipLabelStyle}>
                  <input
                    type="checkbox"
                    style={chipCheckboxStyle}
                    checked={(form.onboardingSlowReasons || []).includes(label)}
                    onChange={handleCheckboxGroup(
                      "onboardingSlowReasons",
                      label
                    )}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="discovery-field">
            <label>
              What do sellers / clients ask you repeatedly during onboarding?
            </label>
            <textarea
              style={textAreaStyle}
              value={form.onboardingQuestions}
              onChange={handleChange("onboardingQuestions")}
            />
          </div>
        </div>
      );

    // SECTION 7 — PAIN POINTS
    case 6:
      return (
        <div className="discovery-fields">
          <div className="discovery-field">
            <label>Top 3 activities that drain the most time:</label>
            <textarea
              style={textAreaStyle}
              value={form.topTimeDrains}
              onChange={handleChange("topTimeDrains")}
            />
          </div>

          <div className="discovery-field">
            <label>Top 3 things that delay deals / matters:</label>
            <textarea
              style={textAreaStyle}
              value={form.topDelays}
              onChange={handleChange("topDelays")}
            />
          </div>
        </div>
      );

    // SECTION 8 — SYSTEMS & TOOLS
    case 7:
      return (
        <div className="discovery-fields">
          <p style={smallLabelStyle}>
            This helps us design an AI agent that fits into your stack instead
            of fighting it.
          </p>

          <div className="discovery-field">
            <label>What do you use for email + calendar today?</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="e.g. Gmail + Google Calendar, Outlook 365, etc."
              value={form.emailSystems}
              onChange={handleChange("emailSystems")}
            />
          </div>

          <div className="discovery-field">
            <label>What do you use for CRM / pipeline tracking?</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="e.g. HubSpot, Pipedrive, Salesforce, spreadsheet, none"
              value={form.crmSystems}
              onChange={handleChange("crmSystems")}
            />
          </div>

          <div className="discovery-field">
            <label>What do you use for chat, phone, or ticketing?</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="e.g. Teams, Slack, WhatsApp, RingCentral, none"
              value={form.chatPhoneSystems}
              onChange={handleChange("chatPhoneSystems")}
            />
          </div>

          <div className="discovery-field">
            <label>Do you use any project / task tools?</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="e.g. Monday, Asana, ClickUp, Trello, none"
              value={form.projectTools}
              onChange={handleChange("projectTools")}
            />
          </div>

          <div className="discovery-field">
            <label>How connected are your systems today?</label>
            <select
              style={selectStyle}
              value={form.integrationLevel}
              onChange={handleChange("integrationLevel")}
            >
              <option value="">Select one</option>
              <option value="manual">
                Nothing connects — everything is manual.
              </option>
              <option value="some">
                Some tools connect or zap together.
              </option>
              <option value="most">
                Most core tools talk to each other.
              </option>
              <option value="full">
                We have a fairly integrated stack.
              </option>
            </select>
          </div>

          <div className="discovery-field">
            <label>
              Which systems MUST HeavenDesk.ai integrate with for this to be
              useful?
            </label>
            <textarea
              style={textAreaStyle}
              value={form.mustConnectTools}
              onChange={handleChange("mustConnectTools")}
            />
          </div>
        </div>
      );

    // SECTION 9 — RULES & GUARDRAILS
    case 8:
      return (
        <div className="discovery-fields">
          <div className="discovery-field">
            <label>
              Do you currently have written scripts or templates for how your
              team should respond?
            </label>
            <select
              style={selectStyle}
              value={form.scriptsStatus}
              onChange={handleChange("scriptsStatus")}
            >
              <option value="">Select one</option>
              <option value="no-scripts">No scripts</option>
              <option value="some-scripts">
                Some scripts / email templates here and there
              </option>
              <option value="full-playbook">
                Yes — full playbook / SOPs
              </option>
            </select>
          </div>

          <div className="discovery-field">
            <label>
              Do you have SOPs or policies that HeavenDesk.ai should follow?
            </label>
            <select
              style={selectStyle}
              value={form.hasSops}
              onChange={handleChange("hasSops")}
            >
              <option value="">Select one</option>
              <option value="none">None yet</option>
              <option value="informal">
                Informal SOPs / policies (not all documented)
              </option>
              <option value="documented">
                Yes — documented SOPs / policies
              </option>
            </select>
          </div>

          <div className="discovery-field">
            <label>
              Is there any information HeavenDesk.ai should{" "}
              <strong>never</strong> share or say without a human reviewing
              first?
            </label>
            <textarea
              style={textAreaStyle}
              value={form.neverShare}
              onChange={handleChange("neverShare")}
            />
          </div>

          <div className="discovery-field">
            <label>
              What decisions should always stay with a human (never fully
              automated)?
            </label>
            <textarea
              style={textAreaStyle}
              value={form.humanOnlyDecisions}
              onChange={handleChange("humanOnlyDecisions")}
            />
          </div>

          <div className="discovery-field">
            <label>
              How would you describe the tone of voice HeavenDesk.ai should use
              with your clients?
            </label>
            <textarea
              style={textAreaStyle}
              placeholder="e.g. warm and professional, direct and efficient, high-touch white-glove, etc."
              value={form.toneOfVoice}
              onChange={handleChange("toneOfVoice")}
            />
          </div>
        </div>
      );

    // SECTION 10 — SUCCESS
    case 9:
      return (
        <div className="discovery-fields">
          <div className="discovery-field">
            <label>
              What would “success in 30–90 days” look like for your operation?
            </label>
            <textarea
              style={textAreaStyle}
              value={form.success30to90}
              onChange={handleChange("success30to90")}
            />
          </div>

          <div className="discovery-field">
            <label>
              Anything else you want HeavenDesk.ai to solve or understand before
              we design your automation map?
            </label>
            <textarea
              style={textAreaStyle}
              value={form.extraNotes}
              onChange={handleChange("extraNotes")}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}

function SubmittedScreen() {
  return (
    <div className="discovery-submitted">
      <h2 className="discovery-section-title">Discovery received ✅</h2>
      <p>
        Thank you for walking through this. HeavenDesk.ai can now design a
        draft workflow map and AI agent plan tailored to how your firm actually
        runs — not a generic template.
      </p>
      <p>We’ll review your answers and follow up with next steps.</p>
    </div>
  );
}
