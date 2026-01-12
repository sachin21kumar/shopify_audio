"use client";

import { useState } from "react";
import { CheckCircle, Lock } from "lucide-react";

export default function ConsentGate({ onNext }: { onNext: () => void }) {
  const [age, setAge] = useState(false);
  const [terms, setTerms] = useState(false);

  const canContinue = age && terms;

  return (
    <>
      <style>{`
        .consent-container {
          margin-top: 32px;
          max-width: 640px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          padding: 32px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .consent-header {
          margin-bottom: 24px;
        }

        .consent-header-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .consent-title {
          font-size: 24px;
          font-weight: 600;
        }

        .consent-subtitle {
          margin-top: 8px;
          font-size: 14px;
          color: #4b5563;
        }

        .consent-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .consent-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid #e5e7eb;
          padding: 16px;
          cursor: pointer;
        }

        .consent-item input {
          margin-top: 4px;
          cursor: pointer;
        }

        .consent-text {
          font-size: 14px;
          color: #374151;
        }

        .consent-text a {
          text-decoration: underline;
          color: inherit;
        }

        .consent-button {
          margin-top: 24px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          transition: all 0.2s ease;
        }

        .consent-button.enabled {
          background-color: #e295c1;
          color: #ffffff;
          cursor: pointer;
        }

        .consent-button.disabled {
          background-color: #e5e7eb;
          color: #6b7280;
          cursor: not-allowed;
        }

        .consent-footer {
          margin-top: 16px;
          font-size: 12px;
          color: #6b7280;
        }
      `}</style>

      <div className="consent-container">
        <header className="consent-header">
          <div className="consent-header-row">
            <Lock size={20} color="#6b7280" />
            <h2 className="consent-title">Before you begin</h2>
          </div>
          <p className="consent-subtitle">
            We just need your consent before you record your Coffee Mug Story.
          </p>
        </header>

        <div className="consent-list">
          <label className="consent-item">
            <input
              type="checkbox"
              checked={age}
              onChange={(e) => setAge(e.target.checked)}
            />
            <span className="consent-text">
              I confirm that I am <strong>at least 18 years old</strong>.
            </span>
          </label>

          <label className="consent-item">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <span className="consent-text">
              I have read and agree to the{" "}
              <a
                href="https://www.goodbyecycle.com/policies/privacy-policy"
                target="_blank"
              >
                Story Recording Terms
              </a>{" "}
              and{" "}
              <a
                href="https://www.goodbyecycle.com/policies/privacy-policy"
                target="_blank"
              >
                Privacy Notice
              </a>.
            </span>
          </label>
        </div>

        <button
          disabled={!canContinue}
          onClick={onNext}
          className={`consent-button ${
            canContinue ? "enabled" : "disabled"
          }`}
        >
          <CheckCircle size={16} />
          Start Story
        </button>

        <p className="consent-footer">
          Your recording is private and will only be used according to our terms.
        </p>
      </div>
    </>
  );
}
