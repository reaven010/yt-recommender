"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Search, Bot, CheckCircle2, Youtube, Sparkles, Zap, ArrowRight, Play, 
  Terminal as TerminalIcon, FileText, Brain, Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AgentStep {
  agent_name: string;
  task_description: string;
  output: string;
}

interface VideoRecommendation {
  video_id: string;
  title: string;
  channel_title: string;
  description: string;
  score: number;
  reasoning: string;
}

interface RecommendationResponse {
  query: string;
  steps: AgentStep[];
  recommendations: VideoRecommendation[];
  summary: string;
}

const SUGGESTIONS = [
  "Quantum Computing explained simply",
  "Next.js 15 Server Actions masterclass",
  "History of the Roman Empire documentary",
  "Build autonomous AI agents with CrewAI"
];

const getAgentConfig = (agentName: string) => {
  const name = agentName.toLowerCase();
  if (name.includes("search")) {
    return {
      icon: <Search className="w-5 h-5 text-blue-400" />,
      themeColor: "text-blue-400",
      borderColor: "hover:border-blue-500/30",
      shadowColor: "hover:shadow-blue-500/10",
      badgeBg: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      bgGradient: "from-blue-500/5 via-transparent to-transparent"
    };
  } else if (name.includes("transcript")) {
    return {
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      themeColor: "text-emerald-400",
      borderColor: "hover:border-emerald-500/30",
      shadowColor: "hover:shadow-emerald-500/10",
      badgeBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      bgGradient: "from-emerald-500/5 via-transparent to-transparent"
    };
  } else if (name.includes("analysis") || name.includes("analyst")) {
    return {
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      themeColor: "text-purple-400",
      borderColor: "hover:border-purple-500/30",
      shadowColor: "hover:shadow-purple-500/10",
      badgeBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      bgGradient: "from-purple-500/5 via-transparent to-transparent"
    };
  } else {
    return {
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      themeColor: "text-amber-400",
      borderColor: "hover:border-amber-500/30",
      shadowColor: "hover:shadow-amber-500/10",
      badgeBg: "bg-amber-500/10 text-amber-400 border border-amber-400/20",
      bgGradient: "from-amber-500/5 via-transparent to-transparent"
    };
  }
};

export default function Recommender() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState("");

  // Loading Terminal states
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) return;

    const logs = [
      "🚀 Bootstrapping CrewAI youtube-recommender-crew...",
      "⚙️ Configuring LLM: gemini-2.0-flash with LiteLLM bridge...",
      "👤 Agent Spawning: [Search Agent] initialized (Role: Video Scout)...",
      "🔍 Search Agent: scanning YouTube API for high-retention content matching '" + query + "'...",
      "🔍 Search Agent: analyzed search metadata (view counts, upload dates, engagement)...",
      "🔍 Search Agent: selected 5 candidate videos for deep review. Passing parameters...",
      "👤 Agent Spawning: [Transcript Extractor] initialized (Role: Captions Analyst)...",
      "📑 Transcript Extractor: establishing connections to YouTube Transcript database...",
      "📑 Transcript Extractor: successfully compiled transcripts for all candidate videos.",
      "📑 Transcript Extractor: parsing text segments, stripping noise, and preparing chunks...",
      "👤 Agent Spawning: [Content Analyst] initialized (Role: Topic Assessor)...",
      "🧠 Content Analyst: performing semantic keyword validation on compiled transcripts...",
      "🧠 Content Analyst: generating detailed content summaries and assessing intent...",
      "🧠 Content Analyst: determining subject-matter expertise and depth of coverage...",
      "👤 Agent Spawning: [Comparison Agent] initialized (Role: Final Evaluator)...",
      "🏆 Comparison Agent: applying multi-dimensional ranking matrix (1-10 scale)...",
      "🏆 Comparison Agent: factoring transcript depth, formatting clarity, and video scores...",
      "✨ Evaluator: composing master executive summary and finalizing recommendation payload...",
      "🤖 Crew process complete! Sending recommendations payload to Next.js API client..."
    ];

    let index = 0;

    const interval = setInterval(() => {
      index++;
      if (index < logs.length) {
        setTerminalLogs(prev => [...prev, logs[index]]);
        // Update phase based on log progression
        if (index >= 15) setLoadingPhase(3);
        else if (index >= 10) setLoadingPhase(2);
        else if (index >= 6) setLoadingPhase(1);
        else setLoadingPhase(0);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [loading, query]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  const triggerSearch = async (searchQuery: string) => {
    if (!searchQuery) return;

    setLoadingPhase(0);
    setTerminalLogs([]);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      let baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
      baseUrl = baseUrl.replace(/\/$/, "");
      
      const response = await fetch(`${baseUrl}/api/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery, max_results: 3 }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to fetch recommendations. Please try again.");
      }

      const data = await response.json() as RecommendationResponse;
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch recommendations. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(query);
  };

  const handleSuggestionClick = (topic: string) => {
    setQuery(topic);
    triggerSearch(topic);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-16 min-h-screen relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] -z-10" />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center gap-8 py-20 relative"
      >
        <div className="flex-1 flex justify-center">
          <div className="bg-white/5 rounded-full px-5 py-2 flex items-center gap-2.5 w-fit border border-white/10 backdrop-blur-md">
            <span className="text-xs flex items-center gap-2 font-semibold text-neutral-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              AI YouTube Scouts Online
            </span>
          </div>
        </div>

        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 glass premium-shadow"
        >
          <Youtube className="w-10 h-10 text-primary" />
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1]"
          >
            AI <span className="text-primary italic">YouTube</span> <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-amber-400">Recommender</span>
          </motion.h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl font-medium mx-auto leading-relaxed">
            Harness a specialized crew of collaborative AI agents to search, analyze transcripts, and rank the absolute best videos.
          </p>
        </div>

        <div className="w-full max-w-2xl flex flex-col gap-6 mt-4">
          <motion.form 
            onSubmit={handleSearch} 
            className="w-full relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex items-center w-full h-16 rounded-2xl bg-neutral-950 border border-white/10 focus-within:border-primary/50 transition-all overflow-hidden">
                <div className="grid place-items-center h-full w-16 text-neutral-500 group-focus-within:text-primary transition-colors">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  className="peer h-full w-full outline-none text-base md:text-lg text-white bg-transparent pr-4 font-medium placeholder:text-neutral-700"
                  type="text"
                  placeholder="What do you want to learn today?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                />
                <button
                  disabled={loading}
                  type="submit"
                  className="h-[calc(100%-12px)] mr-[6px] px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 group/btn"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Analyze</span>
                      <Zap className="w-4 h-4 fill-white group-hover/btn:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>

          {/* Search Suggestions */}
          {!loading && !result && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto"
            >
              {SUGGESTIONS.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(topic)}
                  className="bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 rounded-full px-4 py-2 text-xs md:text-sm transition-all duration-300 font-medium text-neutral-400 hover:text-white cursor-pointer hover:border-primary/30"
                >
                  {topic}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl text-center glass max-w-2xl mx-auto w-full font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* High-Tech Simulated Loading Dashboard */}
        {loading && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full max-w-3xl mx-auto flex flex-col gap-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              {[
                { label: "Search Video Scout", step: 0, desc: "Scanning YouTube APIs" },
                { label: "Transcript Extractor", step: 1, desc: "Fetching & Stripping captions" },
                { label: "Content Analyst", step: 2, desc: "Semantic relevance maps" },
                { label: "Comparison Agent", step: 3, desc: "Final scoring & selections" }
              ].map((phase, i) => {
                const isActive = loadingPhase === phase.step;
                const isCompleted = loadingPhase > phase.step;
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "p-5 rounded-2xl border transition-all duration-500 text-left flex flex-col gap-2 relative overflow-hidden backdrop-blur-md",
                      isActive ? "bg-primary/5 border-primary/40 shadow-[0_0_25px_rgba(239,68,68,0.1)]" :
                      isCompleted ? "bg-emerald-500/5 border-emerald-500/30" : "bg-white/[0.02] border-white/5 opacity-50"
                    )}
                  >
                    {/* Pulsing indicator */}
                    {isActive && (
                      <div className="absolute top-0 right-0 p-3">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                      </div>
                    )}
                    
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      isActive ? "text-primary animate-pulse" :
                      isCompleted ? "text-emerald-400" : "text-neutral-500"
                    )}>
                      {isCompleted ? "✓ Completed" : isActive ? "⚡ Active" : "⏱ Pending"}
                    </span>
                    <h4 className="text-base font-bold text-white leading-snug">{phase.label}</h4>
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">{phase.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Simulated Live Console */}
            <div className="glass rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col h-[320px] bg-neutral-950/80 backdrop-blur-xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-900/60">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-xs font-bold text-neutral-500 font-mono ml-4 flex items-center gap-1.5">
                    <TerminalIcon className="w-3.5 h-3.5 text-neutral-500" />
                    AGENT_CONTROLLER
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-black text-emerald-400 font-mono tracking-widest uppercase">LIVE_DECK</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 font-mono text-[13px] leading-relaxed text-left flex flex-col gap-2.5 custom-scrollbar">
                {terminalLogs.map((log, idx) => {
                  let colorClass = "text-neutral-400";
                  if (log.includes("🚀") || log.includes("🤖") || log.includes("⚙️")) colorClass = "text-amber-400 font-bold";
                  else if (log.includes("Search Agent") || log.includes("🔍")) colorClass = "text-blue-400";
                  else if (log.includes("Transcript") || log.includes("📑")) colorClass = "text-emerald-400";
                  else if (log.includes("Content Analyst") || log.includes("🧠")) colorClass = "text-purple-400";
                  else if (log.includes("Comparison Agent") || log.includes("🏆")) colorClass = "text-amber-400";

                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn("flex items-start gap-3", colorClass)}
                    >
                      <span className="text-neutral-600 select-none">[{idx + 1}]</span>
                      <span className="whitespace-pre-wrap">{log}</span>
                    </motion.div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-24 pb-32"
          >
            {/* Agent Activity Section */}
            <div className="flex flex-col gap-10">
              <div className="flex items-end justify-between border-b border-white/5 pb-8">
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-3 text-blue-400 font-bold tracking-widest uppercase text-xs">
                    <Sparkles className="w-4 h-4" />
                    Internal Reasoning
                  </div>
                  <h2 className="text-4xl font-black text-white">Agent Activity Log</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {result.steps?.map((step: AgentStep, idx: number) => {
                  const agentName = step.agent_name || "Unknown Agent";
                  const config = getAgentConfig(agentName);
                  return (
                    <motion.div 
                      key={`step-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="group relative h-[480px]"
                    >
                      <div className={cn(
                        "absolute -inset-0.5 bg-gradient-to-b rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500 -z-10",
                        agentName.toLowerCase().includes("search") ? "from-blue-500/20 to-transparent" :
                        agentName.toLowerCase().includes("transcript") ? "from-emerald-500/20 to-transparent" :
                        agentName.toLowerCase().includes("analyst") ? "from-purple-500/20 to-transparent" :
                        "from-amber-500/20 to-transparent"
                      )} />
                      <div className={cn(
                        "relative h-full flex flex-col glass-card rounded-[2rem] p-7 overflow-hidden transition-all duration-500",
                        config.borderColor,
                        config.shadowColor
                      )}>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3 truncate">
                            <div className={cn("flex items-center justify-center w-9 h-9 rounded-xl border", config.badgeBg)}>
                              {config.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white truncate group-hover:text-white transition-colors">
                              {agentName.split(' ')[0]}
                            </h3>
                          </div>
                          <span className={cn("text-[10px] font-black uppercase px-2.5 py-1 rounded-md border tracking-wider", config.badgeBg)}>
                            Agent 0{idx + 1}
                          </span>
                        </div>
                        
                        <div className="text-[11px] text-neutral-400 font-semibold mb-6 pb-6 border-b border-white/5 leading-relaxed italic uppercase tracking-wider h-14 overflow-hidden text-left font-sans">
                          {`"${step.task_description && step.task_description.length > 80 ? step.task_description.substring(0, 80) + '...' : step.task_description || 'Analyze YouTube Data'}"`}
                        </div>
                        
                        {/* Styled mini-terminal frame for logs */}
                        <div className="flex-1 overflow-hidden flex flex-col rounded-2xl border border-white/5 bg-black/40 relative shadow-inner">
                          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-neutral-950/60 shrink-0">
                            <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            </div>
                            <span className="text-[9px] font-bold text-neutral-600 font-mono tracking-widest uppercase">STDOUT</span>
                          </div>

                          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar text-left font-mono">
                            <pre className="text-[12px] text-neutral-300 whitespace-pre-wrap leading-relaxed selection:bg-white/10">
                              {step.output}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="flex flex-col gap-12">
              <div className="flex items-end justify-between border-b border-white/5 pb-8">
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-3 text-primary font-bold tracking-widest uppercase text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified Selection
                  </div>
                  <h2 className="text-4xl font-black text-white">Curated Recommendations</h2>
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[2.5rem] p-10 glass border border-white/5 shadow-inner text-left"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Bot className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-white/40 font-bold uppercase text-[10px] tracking-[0.2em]">
                    Executive Summary
                  </div>
                  <p className="text-xl md:text-2xl text-neutral-200 font-medium leading-relaxed max-w-4xl">
                    {result.summary}
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {result.recommendations?.map((rec: VideoRecommendation, idx: number) => (
                  <motion.div
                    key={rec.video_id || idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <a 
                      href={`https://youtube.com/watch?v=${rec.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-6 p-2 rounded-[2.5rem] glass-card border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-2xl hover:shadow-primary/5 h-full text-left"
                    >
                      <div className="w-full relative rounded-[2rem] overflow-hidden aspect-video bg-black border border-white/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={`https://img.youtube.com/vi/${rec.video_id}/maxresdefault.jpg`} 
                          alt={rec.title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${rec.video_id}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(239,68,68,0.5)] transform scale-90 group-hover:scale-100 transition-transform duration-500">
                            <Play className="w-8 h-8 ml-1 fill-white" />
                          </div>
                        </div>
                        {idx === 0 && (
                          <div className="absolute top-6 left-6 px-4 py-2 bg-primary/95 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20 shadow-xl">
                            Agent Choice
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col flex-1 px-6 pb-6 gap-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex flex-col gap-2">
                            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors leading-tight">
                              {rec.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                <Bot className="w-3 h-3 text-white/50" />
                              </div>
                              <p className="text-sm text-neutral-500 font-bold tracking-wide uppercase">{rec.channel_title}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-2xl group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                            <span className="text-2xl font-black text-white group-hover:text-primary">{rec.score}</span>
                            <span className="text-[10px] text-neutral-500 group-hover:text-primary/60 -mt-1 font-bold uppercase tracking-tighter">Score</span>
                          </div>
                        </div>
                        
                        <div className="mt-auto relative group/reason">
                          <div className="absolute -inset-4 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-3 h-3 text-primary" />
                              <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">{"Why it's recommended"}</span>
                            </div>
                            <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-medium line-clamp-3 group-hover:line-clamp-none transition-all">
                              {rec.reasoning}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest">
                            <ArrowRight className="w-3 h-3" />
                            Click to watch on YouTube
                          </div>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
