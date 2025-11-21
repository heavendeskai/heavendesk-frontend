// app/results/[id]/ResultsClient.js
'use client';

import { useMemo } from 'react';

const SECTION_LABELS = {
  frontDesk: 'Front Desk & Communication Load',
  benefitsHr: 'Benefits, HR & Employee Support Load',
  sales: 'Sales, Leads & Website Funnel',
  marketing: 'Marketing, Social Media & Presence',
  support: 'Support, Communication & Customer Experience',
  hrHiring: 'HR, Hiring & Employee Support',
  leadCapture: 'Lead Capture & Sales Process',
  techStack: 'Tech Stack, Systems & Workflow',
};

export default function ResultsClient({ result }) {
  const { overallScore, tier, sections = [], quickWins = [] } = result;

  const ownerActions = useMemo(() => {
    const TEMPLATES = {
      frontDesk: [
        'Write down your top 10 most common front desk questions and draft one clear answer for each. Keep it by every phone.',
      ],
      benefitsHr: [
        'Create a single, easy-to-find document or page where employees can see PTO, benefits contacts, and key dates.',
      ],
      sales: [
        'Pick one lead channel (website or phone) and create a simple 3-touch follow-up rule you can stick to for 30 days.',
      ],
      marketing: [
        'Choose one social channel and commit to 2 posts per week that answer real questions your customers ask.',
      ],
      support: [
        'List your most common customer complaints and add a short “What happens next” script your team can read from.',
      ],
      hrHiring: [
        'Document the 5 steps of your hiring/onboarding process in a checklist and use it for every new hire.',
      ],
      leadCapture: [
        'Add a single, clear call-to-action on your website (Book a Call / Request Info) instead of multiple scattered links.',
      ],
      techStack: [
        'Pick one manual task you repeat every day and explore if your current tools can automate even part of it.',
      ],
    };

    const sorted = [...sections].sort(
      (a, b) => (a.score ?? 0) - (b.score ?? 0)
    );
    const worst = sorted.slice(0, 3);

    const tips = [];
    worst.forEach((sec) => {
      const arr = TEMPLATES[sec.key];
      if (arr && arr.length > 0) tips.push(...arr);
    });

    return tips;
  }, [sections]);

  return (
    <div className="assessment-card">
      <h1 className="assessment-title">
        Your HeavenDesk Automation Readiness Score
      </h1>

      <div className="assessment-score-wrapper">
        <div className="assessment-score-main">
          <div className="assessment-score-number">{overallScore}</div>
          <div className="assessment-score-meta">
            <p className="assessment-score-tier">{tier}</p>
            <p className="assessment-score-text">
              This reflects how much of your current workload is still handled
              manually — and how much time{' '}
              <span className="gradient-text">Heaven</span> can give back to
              your team.
            </p>
          </div>
        </div>
      </div>

      <div className="assessment-sections-breakdown">
        <h3>Area-by-area breakdown</h3>
        <div className="assessment-sections-grid">
          {sections.map((sec) => (
            <div key={sec.key} className="assessment-section-score">
              <div className="assessment-section-top">
                <span className="assessment-section-label">
                  {SECTION_LABELS[sec.key] || sec.label || sec.key}
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

      {ownerActions.length > 0 && (
        <div className="assessment-quickwins">
          <h3>What you can start improving this week (even without Heaven)</h3>
          <ul>
            {ownerActions.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {quickWins.length > 0 && (
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
          If you’d like, Heaven can build a tailored automation plan for your
          business and walk you through the exact flows that will save you the
          most time.
        </p>
        <a href="/" className="assessment-button primary">
          Back to HeavenDesk.ai
        </a>
      </div>
    </div>
  );
}
