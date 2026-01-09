"use client";

import React, { useState } from "react";
import { Tag, Sparkles, FileText, Trash2, Loader2, Lock, Crown } from "lucide-react";
import { toast } from "react-hot-toast";

import { ResumeData } from "@/types/resume";
import { callAICompletion } from "@/utils/ai";

interface KeywordsFormProps {
  data: ResumeData;
  onChange: (data: Partial<ResumeData>) => void;
  isPremium?: boolean;
}

export default function KeywordsForm({ data, onChange, isPremium = false }: KeywordsFormProps) {
  const [loadingAction, setLoadingAction] = useState<
    "extract" | "generate" | null
  >(null);

  const jobDescription = (data as any).jobDescription || "";
  const keywords: string[] = (data as any).keywords || [];

  const updateKeywords = (nextKeywords: string[]) => {
    onChange({ ...(data as any), keywords: nextKeywords });
  };

  const updateJobDescription = (value: string) => {
    onChange({ ...(data as any), jobDescription: value });
  };

  const handleAddKeyword = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    if (keywords.some((k) => k.toLowerCase() === trimmed.toLowerCase())) {
      toast("Keyword already added");
      return;
    }

    updateKeywords([...keywords, trimmed]);
  };

  const handleRemoveKeyword = (keyword: string) => {
    updateKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleClearAll = () => {
    updateKeywords([]);
  };

  const callKeywordsAPI = async (
    mode: "extract" | "generate",
    extraPrompt?: string
  ) => {
    if (!isPremium) {
      toast.error("AI keyword extraction is a premium feature");
      window.location.href = '/pricing';
      return;
    }

    try {
      setLoadingAction(mode);

      const payload: any = {
        jobDescription,
        targetRole: data.personalInfo?.title || "",
        resumeText: extraPrompt || "",
        existingKeywords: keywords,
      };

      const response = await fetch("/api/ai/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to generate keywords");
      }

      const responseData = await response.json();
      const newKeywords: string[] = Array.isArray(responseData.keywords)
        ? responseData.keywords
        : [];

      if (!newKeywords.length) {
        toast("AI did not return any keywords. Try adjusting the description.");
        return;
      }

      const merged = Array.from(
        new Set([...keywords, ...newKeywords].map((k) => k.trim()))
      ).filter(Boolean);

      updateKeywords(merged);
      toast.success("Keywords updated with AI suggestions");
    } catch (err: any) {
      console.error("Keyword AI error", err);
      toast.error(err.message || "Failed to generate keywords");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExtractFromJD = async () => {
    if (!jobDescription.trim()) {
      toast.error("Paste a job description first");
      return;
    }
    await callKeywordsAPI("extract");
  };

  const handleGenerateByRole = async () => {
    if (!data.personalInfo?.title) {
      toast.error("Add your target job title in Personal Info first");
      return;
    }

    const extraPrompt = `Current skills: ${
      (data.skills || []).map((s: any) => s.name).join(", ") || "None"
    }`;

    await callKeywordsAPI("generate", extraPrompt);
  };

  const [keywordInput, setKeywordInput] = useState("");

  const handleKeywordInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword(keywordInput);
      setKeywordInput("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-lime-400 mb-2">
          ATS Keywords & Job Description
        </h2>
        <p className="text-sm text-gray-300">
          Paste the target job description and we&apos;ll help you extract the most
          important ATS keywords. You can also generate more keywords based on
          your target role and skills.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-200 mb-2">
            <FileText className="w-4 h-4 text-teal-400" />
            Target Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => updateJobDescription(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 border border-gray-700 bg-gray-900/60 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-500 text-sm"
            placeholder="Paste the exact job description from the job posting here..."
          />
          <p className="mt-2 text-xs text-gray-400">
            We&apos;ll scan this description and highlight critical keywords your
            resume should include for a higher ATS match.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <Tag className="w-4 h-4 text-amber-400" />
              Target Keywords
            </label>
            {keywords.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1 text-xs text-red-300 hover:text-red-200"
              >
                <Trash2 className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordInputKeyDown}
              placeholder="Add a keyword and press Enter (e.g., Project Management)"
              className="flex-1 px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={() => {
                handleAddKeyword(keywordInput);
                setKeywordInput("");
              }}
              className="px-3 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-500"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-lg bg-gray-900/40 border border-dashed border-gray-700">
            {keywords.length === 0 ? (
              <p className="text-xs text-gray-500">
                No keywords added yet. Use AI to extract them from the job
                description or add them manually.
              </p>
            ) : (
              keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-900/40 border border-amber-600/60 text-amber-100 text-xs"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-1 text-amber-200/70 hover:text-amber-50"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleExtractFromJD}
              disabled={loadingAction === "extract"}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium relative ${
                isPremium
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-500 hover:to-emerald-500'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
              title={!isPremium ? 'Premium feature - Upgrade to use AI extraction' : ''}
            >
              {!isPremium && <Lock className="w-4 h-4" />}
              {loadingAction === "extract" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Extract from Job Description
              {!isPremium && <Crown className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />}
            </button>

            <button
              type="button"
              onClick={handleGenerateByRole}
              disabled={loadingAction === "generate"}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border relative ${
                isPremium
                  ? 'bg-gray-800 text-teal-200 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
              title={!isPremium ? 'Premium feature - Upgrade to use AI generation' : ''}
            >
              {!isPremium && <Lock className="w-4 h-4" />}
              {loadingAction === "generate" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate More Keywords by Role
              {!isPremium && <Crown className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />}
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Tip: Try to have 15-40 highly relevant keywords that match the job
            description. Avoid stuffing random buzzwords – focus on what&apos;s truly
            required.
          </p>
        </div>
      </div>
    </div>
  );
}

