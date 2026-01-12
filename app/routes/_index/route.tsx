"use client";

import { useEffect, useState } from "react";
import ConsentGate from "app/components/ConsentGate";
import StoryForm from "app/components/StoryForm";
import type { StoryFormData } from "app/lib/schema";
import AudioRecorder from "app/components/AudioRecord";

const STEP_KEY = "record_step";
const META_KEY = "record_meta";

export default function RecordPage() {
  const [step, setStep] = useState<number>(0);
  const [meta, setMeta] = useState<StoryFormData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedStep = localStorage.getItem(STEP_KEY);
    const savedMeta = localStorage.getItem(META_KEY);

    if (savedStep) setStep(Number(savedStep));
    if (savedMeta) setMeta(JSON.parse(savedMeta));

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(STEP_KEY, String(step));
    if (meta) localStorage.setItem(META_KEY, JSON.stringify(meta));
  }, [step, meta, hydrated]);

  if (!hydrated) return null;

  return (
    <>
      <style>{`
        .page-container {
          padding: 40px;
          max-width: 640px;
          margin: 0 auto;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          color: #111;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
        }
      `}</style>

      <main className="page-container">
        <h1 className="page-title">Record Your Mug Story</h1>

        {step === 0 && <ConsentGate onNext={() => setStep(1)} />}

        {step === 1 && (
          <StoryForm
            onSuccess={(data) => {
              setMeta(data);
              setStep(2);
            }}
          />
        )}

        {step === 2 && meta && <AudioRecorder meta={meta} />}
      </main>
    </>
  );
}
