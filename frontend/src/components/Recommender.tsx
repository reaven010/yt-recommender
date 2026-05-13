"use client";

import { useState } from "react";
import { Search, Bot, CheckCircle2, Youtube, Sparkles, Zap, ArrowRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Recommender() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

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
        body: JSON.stringify({ query, max_results: 3 }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to fetch recommendations. Please try again.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-16 min-h-screen relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] -z-10" />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center gap-8 py-20 relative"
      >
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 glass premium-shadow"
        >
          <Youtube className="w-10 h-10 text-primary" />
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            className="text-5xl md:text-7xl font-black tracking-tight text-white"
          >
            AI <span className="text-primary italic">YouTube</span> <br />
            <span className="text-gradient">Recommender</span>
          </motion.h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl font-medium mx-auto leading-relaxed">
            Harness the power of autonomous AI agents to search, analyze, and rank the best videos for any topic.
          </p>
        </div>

        <motion.form 
          onSubmit={handleSearch} 
          className="w-full max-w-2xl relative mt-4"
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
                    <Zap className="w-4 h-4 fill-white group-hover:btn:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.form>
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

        {loading && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-10"
          >
            <div className="relative flex items-center justify-center w-40 h-40">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[2px] border-primary/20 rounded-full border-t-primary shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)]"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-[2px] border-blue-500/20 rounded-full border-b-blue-500"
              />
              <Bot className="w-14 h-14 text-white animate-pulse" />
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-black text-white tracking-tight">Deploying AI Agents...</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-neutral-400 font-medium px-6 py-3 rounded-full glass border border-white/5">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  Scanning YouTube Data API
                </div>
                <p className="text-sm text-neutral-500 max-w-md">Our specialized agents are searching for high-retention videos and analyzing transcripts to ensure quality.</p>
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
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-blue-400 font-bold tracking-widest uppercase text-xs">
                    <Sparkles className="w-4 h-4" />
                    Internal Reasoning
                  </div>
                  <h2 className="text-4xl font-black text-white">Agent Activity Log</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {result.steps?.map((step: any, idx: number) => (
                  <motion.div 
                    key={`step-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="group relative h-[480px]"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div className="relative h-full flex flex-col glass-card rounded-[2rem] p-7 overflow-hidden">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black">
                          0{idx + 1}
                        </div>
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                          {step.agent_name.split(' ')[0]}
                        </h3>
                      </div>
                      
                      <div className="text-xs text-neutral-400 font-semibold mb-6 pb-6 border-b border-white/5 leading-relaxed italic uppercase tracking-wider">
                        "{step.task_description.length > 80 ? step.task_description.substring(0, 80) + '...' : step.task_description}"
                      </div>
                      
                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar bg-black/20 rounded-xl p-4">
                        <pre className="text-[13px] text-neutral-300 whitespace-pre-wrap font-mono leading-relaxed selection:bg-blue-500/30">
                          {step.output}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="flex flex-col gap-12">
              <div className="flex items-end justify-between border-b border-white/5 pb-8">
                <div className="space-y-2">
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
                className="relative overflow-hidden rounded-[2.5rem] p-10 glass border border-white/5 shadow-inner"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Bot className="w-32 h-32" />
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
                {result.recommendations?.map((rec: any, idx: number) => (
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
                      className="group flex flex-col gap-6 p-2 rounded-[2.5rem] glass-card border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-2xl hover:shadow-primary/5 h-full"
                    >
                      <div className="w-full relative rounded-[2rem] overflow-hidden aspect-video bg-black border border-white/5">
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
                          <div className="absolute top-6 left-6 px-4 py-2 bg-primary/90 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20 shadow-xl">
                            Agent Choice
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col flex-1 px-6 pb-6 gap-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors leading-tight">
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
                              <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Why it's recommended</span>
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
