// app/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const router = useRouter();

  // --- CTA popup logic (Creed 5s) ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    // If user has already seen/closed popup, never show again
    const alreadySeen = window.localStorage.getItem("heavendesk_cta_seen");
    if (alreadySeen) return;

    const creedSection = document.getElementById("creed");
    if (!creedSection) return;

    let timerId;
    let popupAlreadyTriggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (popupAlreadyTriggered) return;

        if (entry.isIntersecting) {
          // Start 5s timer when Creed is in view
          if (!timerId) {
            timerId = window.setTimeout(() => {
              popupAlreadyTriggered = true;
              setShowPopup(true);
            }, 5000);
          }
        } else if (timerId) {
          // If they scroll away before 5s, cancel timer
          window.clearTimeout(timerId);
          timerId = undefined;
        }
      },
      { threshold: 0.4 } // ~40% of Creed visible
    );

    observer.observe(creedSection);

    return () => {
      if (timerId) window.clearTimeout(timerId);
      observer.disconnect();
    };
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("heavendesk_cta_seen", "true");
    }
  };

  const handleOpenLeadModal = () => {
    setShowLeadModal(true);
  };

  const handleCloseLeadModal = () => {
    setShowLeadModal(false);
  };

  const handlePopupCTA = () => {
    // Close the Creed popup and open the lead modal
    handleClosePopup();
    handleOpenLeadModal();
  };

  const handleLeadSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const website = formData.get("website");

    // TODO: Later, send this to your backend / CRM / email
    console.log("Lead captured:", { name, email, phone, website });

    setShowLeadModal(false);

    // Navigate to the assessment page (we'll build this next)
    router.push("/assessment");
  };

  const currentYear = new Date().getFullYear();

  return (
    <main className="hero">
      {/* Logo */}
      <div className="hero-logo">HeavenDesk.ai</div>

      {/* Hero content */}
      <section className="hero-inner">
        <h1 className="hero-title">
          Are you tired of your staff drowning in calls, questions, and nonstop
          scheduling?
        </h1>

        <p className="hero-paragraph">
          HeavenDesk.ai handles the calls, questions, and tasks that overwhelm
          your team — automatically, accurately, and 24/7. No burnout, no
          callbacks, no confusion. Just instant, consistent support for both
          your customers and employees.
        </p>

        <button
          type="button"
          className="hero-button"
          onClick={handleOpenLeadModal}
        >
          Take the 3-Minute Assessment →
        </button>
      </section>

      {/* Section 2 – Value Proposition */}
      <section className="value-section" id="value">
        <div className="value-inner">
          <p className="section-eyebrow">Why HeavenDesk.ai</p>

          <h2 className="value-title">
            The AI front desk that turns constant interruptions into
            <span className="gradient-text"> predictable, calm flow.</span>
          </h2>

          <p className="value-lead">
            Instead of your team juggling phones, emails, benefits questions,
            and scheduling chaos, HeavenDesk.ai becomes the first line of
            response — answering, routing, and capturing what matters before it
            ever reaches a human.
          </p>

          <div className="value-grid">
            <div className="value-card">
              <h3>Free your front desk</h3>
              <p>
                Offload repetitive “quick questions” about hours, locations,
                eligibility, plan details, and more — without hiring extra
                staff or burning out the team you already have.
              </p>
            </div>

            <div className="value-card">
              <h3>Protect your best people</h3>
              <p>
                Give your operators and benefits team long blocks of
                interruption-free time so they can focus on complex issues,
                high-value clients, and the strategic work that actually moves
                the needle.
              </p>
            </div>

            <div className="value-card">
              <h3>Delight callers &amp; employees</h3>
              <p>
                Provide instant, consistent answers 24/7 — no voicemail loops,
                no “we’ll call you back,” no confusion about who to contact for
                what. Just clear next steps, every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 – The Creed */}
      <section className="creed-section" id="creed">
        <div className="creed-inner">
          <div className="creed-text">
            <p className="section-eyebrow">The Creed</p>

            <h2 className="creed-title">
              Who we serve.{" "}
              <span className="gradient-text">What we stand for.</span> Why the
              research proves this works.
            </h2>

            <p className="creed-paragraph">
              HeavenDesk.ai exists for the overwhelmed operator, the owner doing
              five jobs, the benefits team answering the same questions a
              hundred times a week, and the front desk that holds the entire
              company together.
            </p>

            <div className="creed-list">
              <div className="creed-item">
                <h3>Who</h3>
                <p>
                  Small businesses, TPAs, clinics, offices, schools, and any
                  team where interruptions destroy momentum and support volume
                  is unpredictable.
                </p>
              </div>

              <div className="creed-item">
                <h3>What</h3>
                <p>
                  HeavenDesk provides an AI front desk that answers, routes,
                  books, clarifies, and protects your team’s time — without
                  losing the warmth of human support.
                </p>
              </div>

              <div className="creed-item">
                <h3>The Research</h3>
                <ul>
                  <li>
                    Employees lose{" "}
                    <strong>23 minutes of focus per interruption</strong> (UC
                    Irvine).
                  </li>
                  <li>
                    54% of SMBs report support delays due to staff shortages.
                  </li>
                  <li>
                    78% of employees prefer quick self-service answers (Gartner).
                  </li>
                  <li>
                    AI routing reduces triage time by 42% on average across
                    service teams.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="creed-image-wrapper">
            <img
              src="/ai-agent.png"
              alt="AI Agent Diagram"
              className="creed-image"
            />
           <button
  type="button"
  className="hero-button creed-button"
  onClick={handleOpenLeadModal}
>
  Take the 3-Minute Assessment →
</button>

          </div>
        </div>
      </section>

      {/* Premium SaaS Footer */}
      <footer className="footer-section">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">HeavenDesk.ai</div>
            <p className="footer-tagline">
              The always-on AI front desk for teams drowning in calls,
              questions, and nonstop scheduling.
            </p>
          </div>

          <div className="footer-columns">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li>
                  <a href="#value">Why HeavenDesk</a>
                </li>
                <li>
                  <a href="#creed">The Creed</a>
                </li>
                <li>
                  <a href="#assessment">3-Minute Assessment</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Who It’s For</h4>
              <ul>
                <li>Front desks &amp; office staff</li>
                <li>TPAs &amp; benefits teams</li>
                <li>Clinics, schools &amp; service teams</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Contact</h4>
              <ul>
                <li>
                  <a href="mailto:hello@heavendesk.ai">
                    hello@heavendesk.ai
                  </a>
                </li>
                <li>Based in the U.S.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p className="footer-copy">
              © {currentYear} HeavenDesk.ai. Built for the overwhelmed operator.
            </p>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Section 4 – CTA Popup (triggered after 5s on Creed) */}
      {showPopup && (
        <div className="cta-popup">
          <button
            type="button"
            className="cta-popup-close"
            aria-label="Close"
            onClick={handleClosePopup}
          >
            ×
          </button>

          <p className="cta-popup-eyebrow">3-Minute Assessment</p>

          <h3 className="cta-popup-title">
            See how much time HeavenDesk can save your team.
          </h3>

          <p className="cta-popup-text">
            Answer a few quick questions and get a personalized snapshot of
            where an AI front desk can take work off your plate.
          </p>

          <button
            type="button"
            className="cta-popup-button"
            onClick={handlePopupCTA}
          >
            Start the 3-Minute Assessment →
          </button>

          <p className="cta-popup-note">
            No credit card. No obligation. Just clarity.
          </p>
        </div>
      )}

      {/* Lead Capture Modal */}
      {showLeadModal && (
        <div
          className="lead-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseLeadModal();
            }
          }}
        >
          <div className="lead-modal">
            <button
              type="button"
              className="lead-modal-close"
              aria-label="Close"
              onClick={handleCloseLeadModal}
            >
              ×
            </button>

            <p className="lead-modal-eyebrow">3-Minute Automation Scan</p>
            <h3 className="lead-modal-title">
              Let’s tailor HeavenDesk to your business.
            </h3>
            <p className="lead-modal-text">
              Share a few details so we can shape your automation blueprint
              around your actual business, not a generic demo.
            </p>

            <form className="lead-modal-form" onSubmit={handleLeadSubmit}>
              <div className="lead-modal-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Smith"
                />
              </div>

              <div className="lead-modal-field">
                <label htmlFor="email">Work email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                />
              </div>

              <div className="lead-modal-field">
                <label htmlFor="phone">Mobile or direct line</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="lead-modal-field">
                <label htmlFor="website">Business website</label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  required
                  placeholder="https://yourbusiness.com"
                />
              </div>

              <div className="lead-modal-actions">
                <button type="submit" className="lead-modal-button">
                  Begin the 3-Minute Assessment →
                </button>
                <p className="lead-modal-note">
                  We’ll use this only to prepare a meaningful automation
                  snapshot for your business. No spam. Ever.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
