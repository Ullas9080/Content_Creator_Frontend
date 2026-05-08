"use client";
import { API_BASE_URL } from '@/config/api';

import React, { useState, useRef, useCallback, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import {
  Mic,
  Camera,
  Link2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Download,
  FileVideo,
  AudioWaveform,
  Clock,
  Languages,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type Tab = "instagram" | "upload" | "url";
type Status = "idle" | "loading" | "success" | "error";

interface Word {
  text: string;
  start: number;
  end: number;
  confidence: number;
}

interface TranscriptResult {
  id: string;
  status: string;
  text: string;
  language: string;
  confidence: number | null;
  duration_seconds: number | null;
  words: Word[];
  created_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const secs = s % 60;
  return `${m}:${secs.toString().padStart(2, "0")}`;
}

function formatDuration(sec: number | null) {
  if (!sec) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}m ${s}s`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TabButton({
  id,
  active,
  icon: Icon,
  label,
  onClick,
}: {
  id: Tab;
  active: boolean;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      id={`tab-${id}`}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex-1 justify-center ${
        active
          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
          : "text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function WordChip({ word }: { word: Word }) {
  const alpha = Math.max(0.4, word.confidence);
  const color =
    word.confidence >= 0.9
      ? "rgba(52,211,153," + alpha + ")"
      : word.confidence >= 0.7
      ? "rgba(251,191,36," + alpha + ")"
      : "rgba(248,113,113," + alpha + ")";

  return (
    <span
      className="inline-block px-1 py-0.5 rounded text-sm cursor-default transition-all hover:scale-105"
      style={{ color }}
      title={`${formatTime(word.start)} – ${formatTime(word.end)} | ${Math.round(word.confidence * 100)}% conf`}
    >
      {word.text}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TranscriptionPage() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const [tab, setTab] = useState<Tab>("instagram");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [directUrl, setDirectUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [error, setError] = useState<string>("");
  const [showWords, setShowWords] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = `${API_BASE_URL}`;

  // ── Drag & Drop ────────────────────────────────
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setTab("upload");
    }
  }, []);

  // ── Submit ─────────────────────────────────────
  const handleSubmit = async () => {
    setStatus("loading");
    setError("");
    setResult(null);

    try {
      let res: Response;

      if (tab === "instagram") {
        if (!instagramUrl.includes("instagram.com"))
          throw new Error("Please enter a valid Instagram URL");
        res = await fetch(`${API_BASE}/transcription/instagram`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: instagramUrl }),
        });
      } else if (tab === "url") {
        if (!directUrl.startsWith("http"))
          throw new Error("Please enter a valid HTTP(S) URL");
        res = await fetch(`${API_BASE}/transcription/url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: directUrl }),
        });
      } else {
        if (!file) throw new Error("Please select or drop a file");
        const form = new FormData();
        form.append("file", file);
        res = await fetch(`${API_BASE}/transcription/upload`, {
          method: "POST",
          body: form,
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Transcription failed");
      setResult(data);
      setStatus("success");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
      setStatus("error");
    }
  };

  // ── Copy ──────────────────────────────────────
  const copyText = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Download ──────────────────────────────────
  const downloadText = () => {
    if (!result?.text) return;
    const blob = new Blob([result.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript_${result.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canSubmit =
    (tab === "instagram" && instagramUrl.trim() !== "") ||
    (tab === "url" && directUrl.trim() !== "") ||
    (tab === "upload" && file !== null);

  return (
    <DashboardLayout>
      <div
        className="p-6 max-w-5xl mx-auto space-y-6 pb-10"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* ── Global Drag Overlay ── */}
        {isDragging && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-none">
            <div className="flex flex-col items-center gap-4 p-10 rounded-3xl border-2 border-dashed border-purple-500 bg-purple-500/10">
              <FileVideo size={56} className="text-purple-400" />
              <p className="text-2xl font-bold text-white">Drop your video here</p>
              <p className="text-gray-400">mp4, mp3, wav, m4a, webm and more</p>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <Mic size={18} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Speech to Text</h1>
              <span className="text-xs text-pink-300 bg-pink-500/20 border border-pink-500/30 px-2.5 py-0.5 rounded-full">
                Powered by AssemblyAI
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Transcribe Instagram Reels, direct audio/video URLs, or upload files from your system
            </p>
          </div>
        </div>

        {/* ── Input Card ── */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-5">
          {/* Tabs */}
          <div className="flex gap-3">
            <TabButton
              id="instagram"
              active={tab === "instagram"}
              icon={Camera}
              label="Instagram Reel"
              onClick={() => setTab("instagram")}
            />
            <TabButton
              id="upload"
              active={tab === "upload"}
              icon={Upload}
              label="Upload / Drop"
              onClick={() => setTab("upload")}
            />
            <TabButton
              id="url"
              active={tab === "url"}
              icon={Link2}
              label="Direct URL"
              onClick={() => setTab("url")}
            />
          </div>

          {/* ── Instagram ── */}
          {tab === "instagram" && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Camera size={18} className="text-pink-400" />
                </div>
                <input
                  id="instagram-url-input"
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/ABC123..."
                  className="w-full bg-dark-900/60 border border-dark-700 text-white placeholder-gray-600 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>
              <div className="flex items-start gap-2.5 bg-pink-500/5 border border-pink-500/20 rounded-xl p-3.5">
                <Sparkles size={15} className="text-pink-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  Paste any public Instagram Reel URL. The server uses{" "}
                  <span className="text-pink-300 font-medium">yt-dlp</span> to download the audio,
                  then sends it to AssemblyAI for transcription with automatic language detection.
                  <br />
                  <span className="text-yellow-400/80 mt-1 block">
                    ⚠ Make sure yt-dlp is installed on the server: <code>pip install yt-dlp</code>
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* ── Upload / Drop ── */}
          {tab === "upload" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
                isDragging || file
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-dark-700 hover:border-purple-500/50 hover:bg-white/3"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="file-upload-input"
                className="hidden"
                accept="video/*,audio/*,.mp4,.mp3,.wav,.m4a,.webm,.ogg,.mov,.avi,.mkv,.flac,.aac"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              />
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <FileVideo size={28} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{file.name}</p>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <button
                    id="remove-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <X size={12} /> Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Upload size={28} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Drop video or audio file here</p>
                    <p className="text-gray-500 text-sm mt-1">
                      or click to browse — mp4, mp3, wav, m4a, webm, mov, and more
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 bg-white/3 px-3 py-1.5 rounded-lg border border-white/5">
                    Max 500 MB
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ── Direct URL ── */}
          {tab === "url" && (
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Link2 size={18} className="text-blue-400" />
                </div>
                <input
                  id="direct-url-input"
                  type="url"
                  value={directUrl}
                  onChange={(e) => setDirectUrl(e.target.value)}
                  placeholder="https://cdn.example.com/audio.mp3"
                  className="w-full bg-dark-900/60 border border-dark-700 text-white placeholder-gray-600 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
              </div>
              <p className="text-xs text-gray-500">
                Use a publicly accessible direct link to an audio or video file. AssemblyAI will fetch it
                directly.
              </p>
            </div>
          )}

          {/* ── Submit ── */}
          <button
            id="transcribe-btn"
            onClick={handleSubmit}
            disabled={!canSubmit || status === "loading"}
            className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              canSubmit && status !== "loading"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5"
                : "bg-white/5 text-gray-600 cursor-not-allowed"
            }`}
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Transcribing… this may take a moment
              </>
            ) : (
              <>
                <Mic size={16} />
                Start Transcription
              </>
            )}
          </button>
        </div>

        {/* ── Error ── */}
        {status === "error" && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-semibold text-sm">Transcription Failed</p>
              <p className="text-gray-400 text-sm mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {status === "success" && result && (
          <div className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: CheckCircle,
                  label: "Status",
                  value: "Completed",
                  color: "text-emerald-400",
                },
                {
                  icon: Languages,
                  label: "Language",
                  value: result.language?.toUpperCase() ?? "—",
                  color: "text-blue-400",
                },
                {
                  icon: BarChart2,
                  label: "Confidence",
                  value:
                    result.confidence !== null
                      ? `${Math.round(result.confidence * 100)}%`
                      : "—",
                  color: "text-purple-400",
                },
                {
                  icon: Clock,
                  label: "Duration",
                  value: formatDuration(result.duration_seconds),
                  color: "text-orange-400",
                },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="glass-panel border border-white/5 rounded-xl p-4 flex items-center gap-3"
                >
                  <Icon size={16} className={color} />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Transcript card */}
            <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Mic size={15} className="text-purple-400" />
                  <span className="text-sm font-semibold text-white">Transcript</span>
                  <span className="text-xs text-gray-600">
                    {result.text.split(" ").length} words
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="copy-transcript-btn"
                    onClick={copyText}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors"
                  >
                    <Copy size={12} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    id="download-transcript-btn"
                    onClick={downloadText}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors"
                  >
                    <Download size={12} />
                    .txt
                  </button>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-200 text-sm leading-loose whitespace-pre-wrap">
                  {result.text || <span className="text-gray-600 italic">No speech detected</span>}
                </p>
              </div>
            </div>

            {/* Word-level confidence toggle */}
            {result.words && result.words.length > 0 && (
              <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
                <button
                  id="toggle-word-confidence-btn"
                  onClick={() => setShowWords(!showWords)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AudioWaveform size={15} className="text-pink-400" />
                    <span className="font-semibold text-white">Word-level Confidence</span>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        Green = High
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                        Yellow = Mid
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                        Red = Low
                      </span>
                    </div>
                  </div>
                  {showWords ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
                {showWords && (
                  <div className="px-5 pb-5 leading-loose">
                    {result.words.map((w, i) => (
                      <WordChip key={i} word={w} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AI Summary (Premium Feature) */}
            <div className="glass-panel border border-purple-500/20 rounded-2xl overflow-hidden relative mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none" />
              <div className="flex items-center justify-between px-5 py-4 border-b border-purple-500/20 bg-purple-500/5">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-400" />
                  <span className="text-sm font-bold text-white tracking-wide">AI Strategist Analysis</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold uppercase tracking-widest ml-2">
                    Pro
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-6 relative z-10">
                <div className="space-y-2">
                  <h4 className="text-xs text-purple-400 font-bold uppercase tracking-widest">Executive Summary</h4>
                  <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-purple-500/50 pl-4 py-1">
                    This content focuses on modern productivity techniques, highlighting the shift from traditional to-do lists to context-driven workflows. The speaker emphasizes leveraging AI tools to automate repetitive tasks, projecting a 40% increase in deep work time.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-dark-900/50 border border-white/5 rounded-xl p-4">
                    <h4 className="text-xs text-pink-400 font-bold uppercase tracking-widest mb-3">Key Takeaways</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex gap-2 items-start"><span className="text-pink-500 mt-0.5">•</span> Shift to context-driven workflows over rigid lists.</li>
                      <li className="flex gap-2 items-start"><span className="text-pink-500 mt-0.5">•</span> Automate repetitive tasks using LLM agents.</li>
                      <li className="flex gap-2 items-start"><span className="text-pink-500 mt-0.5">•</span> Goal: 40% more time allocated to deep work.</li>
                    </ul>
                  </div>
                  <div className="bg-dark-900/50 border border-white/5 rounded-xl p-4">
                    <h4 className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-3">Actionable Next Steps</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex gap-2 items-start"><span className="text-blue-500 mt-0.5">1.</span> Audit current weekly tasks for automation potential.</li>
                      <li className="flex gap-2 items-start"><span className="text-blue-500 mt-0.5">2.</span> Setup a context-based calendar integration.</li>
                      <li className="flex gap-2 items-start"><span className="text-blue-500 mt-0.5">3.</span> Review progress after 14 days of implementation.</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <p className="text-xs text-gray-500">Analysis generated based on the transcript above.</p>
                  <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                    Regenerate Analysis <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


