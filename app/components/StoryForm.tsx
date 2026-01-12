"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { storySchema, type StoryFormData } from "../lib/schema";
import { Mic, User, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function StoryForm({
  onSuccess,
}: {
  onSuccess: (data: StoryFormData) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    unregister,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      anonymous: false,
      transcript: false,
      email: undefined,
    },
  });

  const anonymous = watch("anonymous");
  const transcript = watch("transcript");

  useEffect(() => {
    if (!transcript) {
      unregister("email");
      setValue("email", undefined);
    }
  }, [transcript, unregister, setValue]);

  const [micError, setMicError] = useState<string | null>(null);

  async function requestMicPermission() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("UNSUPPORTED");
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some((d) => d.kind === "audioinput");
      if (!hasMic) throw new Error("NO_MIC");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());

      setMicError(null);
      return true;
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setMicError(
          "Microphone access was denied. Please allow microphone permissions and try again."
        );
      } else if (err.name === "NotFoundError" || err.message === "NO_MIC") {
        setMicError("No microphone was found. Please connect one and try again.");
      } else {
        setMicError("Unable to access microphone. Please check browser settings.");
      }
      return false;
    }
  }

  async function onSubmit(data: StoryFormData) {
    const micOk = await requestMicPermission();
    if (!micOk) return;
    onSuccess(data);
  }

  return (
    <>
      <style>{`
        .form-container {
          margin-top: 32px;
          max-width: 640px;
          border: 1px solid #e5e7eb;
          background: #fff;
          padding: 32px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .form-header h2 {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .form-header p {
          font-size: 14px;
          color: #4b5563;
        }

        .field-group {
          margin-top: 20px;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper svg {
          position: absolute;
          left: 10px;
          top: 10px;
          color: #9ca3af;
        }

        input[type="text"],
        input[type="email"],
        input[type="date"] {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #cccccc;
          font-family: inherit;
        }

        .input-icon {
          padding-left: 36px;
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #cccccc;
          padding: 16px;
          margin-top: 16px;
        }

        .warning {
          background: #fffbeb;
          padding: 12px;
          font-size: 14px;
          color: #92400e;
          margin-top: 12px;
        }

        .error-text {
          margin-top: 4px;
          font-size: 13px;
          color: #dc2626;
        }

        .mic-error {
          display: flex;
          gap: 8px;
          border: 1px solid #fecaca;
          background: #fef2f2;
          padding: 12px;
          font-size: 14px;
          color: #b91c1c;
          margin-top: 16px;
        }

        .submit-btn {
          margin-top: 24px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #e295c1;
          color: white;
          padding: 12px 24px;
          font-size: 14px;
          border: none;
          cursor: pointer;
        }

        .submit-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }
      `}</style>

      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <header className="form-header">
          <h2>Story details</h2>
          <p>A little context helps listeners connect with your story.</p>
        </header>

        <div className="field-group">
          {!anonymous && (
            <>
              <label>Name *</label>
              <div className="input-wrapper">
                <User size={16} />
                <input
                  type="text"
                  {...register("name", {
                    required: !anonymous
                      ? "Name is required when not anonymous"
                      : false,
                  })}
                  className="input-icon"
                />
              </div>
              {errors.name && (
                <div className="error-text">{errors.name.message}</div>
              )}
            </>
          )}

          {anonymous && (
            <div className="warning">
              Please avoid sharing names, places, or other identifying details.
            </div>
          )}

          <div className="field-group">
            <label>Birthdate *</label>
            <input type="date" {...register("birthdate")} />
            {errors.birthdate && (
              <div className="error-text">{errors.birthdate.message}</div>
            )}
          </div>

          <div className="field-group">
            <label>Story title (optional)</label>
            <input type="text" {...register("storyTitle")} />
          </div>

          <div className="checkbox-row">
            <input type="checkbox" {...register("anonymous")} />
            <span>Share this story <strong>anonymously</strong></span>
          </div>

          <div className="checkbox-row">
            <input type="checkbox" {...register("transcript")} />
            <span>Email me a transcript when my story is ready</span>
          </div>

          {transcript && (
            <div className="field-group">
              <label>Email address *</label>
              <div className="input-wrapper">
                <Mail size={16} />
                <input
                  type="email"
                  {...register("email", { required: transcript })}
                  className="input-icon"
                />
              </div>
              {errors.email && (
                <div className="error-text">{errors.email.message}</div>
              )}
            </div>
          )}

          {micError && (
            <div className="mic-error">
              <AlertCircle size={16} />
              {micError}
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-btn">
          <Mic size={16} />
          Continue to recorder
          <ArrowRight size={16} />
        </button>
      </form>
    </>
  );
}
