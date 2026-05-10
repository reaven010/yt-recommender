"use client";

import { useState } from "react";
import { Search, Bot, CheckCircle2, Youtube } from "lucide-react";

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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
      const response = await fetch(`${baseUrl}/api/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, max_results: 3 }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations. Please try again.");
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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-12">
      {/* Search Header */}
      <div className="flex flex-col items-center text-center gap-6 py-16">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center">
          <Youtube className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          AI YouTube <span className="text-red-500">Recommender</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl font-medium">
          Enter a topic, and our specialized CrewAI agents will search, watch, analyze, and rank the best videos for you in real-time.
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-2xl relative mt-8 group">
          <div className="relative flex items-center w-full h-16 rounded-2xl bg-neutral-900 border-2 border-neutral-800 focus-within:border-red-500/50 focus-within:ring-4 focus-within:ring-red-500/10 transition-all overflow-hidden shadow-2xl">
            <div className="grid place-items-center h-full w-16 text-neutral-400 group-focus-within:text-red-400 transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <input
              className="peer h-full w-full outline-none text-base md:text-lg text-white bg-transparent pr-4 font-medium placeholder:text-neutral-600"
              type="text"
              id="search"
              placeholder="E.g., Best Next.js 15 tutorials for beginners..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button
              disabled={loading}
              type="submit"
              className="h-[calc(100%-12px)] mr-[6px] px-8 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors disabled:opacity-50 disabled:hover:bg-red-600 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Analyze"
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-950 border border-red-900/50 text-red-200 rounded-2xl text-center shadow-lg font-medium max-w-2xl mx-auto w-full">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-8 animate-in fade-in">
          <div className="relative flex items-center justify-center w-32 h-32">
            <div className="absolute inset-0 border-[6px] border-neutral-800 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <Bot className="w-12 h-12 text-neutral-300 animate-pulse" />
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-white">Agents are working...</h3>
            <div className="flex items-center gap-2 justify-center text-neutral-400 font-medium bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              This may take up to a minute as they analyze full transcripts.
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-20 animate-in fade-in duration-1000 slide-in-from-bottom-12 pb-20">
          
          {/* Intermediate Steps Section */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 border-b border-neutral-800 pb-6">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Agent Activity Log</h2>
                <p className="text-neutral-400 mt-1">See exactly how the crew arrived at these recommendations.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {result.steps?.map((step: any, idx: number) => (
                <div key={idx} className="flex flex-col bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all duration-300 h-[450px] shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-black shadow-lg shadow-blue-500/30">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white truncate" title={step.agent_name}>
                      {step.agent_name}
                    </h3>
                  </div>
                  <div className="text-sm text-blue-200/60 font-medium mb-5 pb-5 border-b border-neutral-800/80 leading-relaxed">
                    {step.task_description}
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <pre className="text-sm text-neutral-300 whitespace-pre-wrap font-mono leading-relaxed">
                      {step.output}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Recommendations Section */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 border-b border-neutral-800 pb-6">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Final Recommendations</h2>
                <p className="text-neutral-400 mt-1">The best videos ranked and analyzed by our AI crew.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-8 text-neutral-200 text-lg leading-relaxed shadow-xl">
              {result.summary}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {result.recommendations?.map((rec: any, idx: number) => (
                <a 
                  key={idx}
                  href={`https://youtube.com/watch?v=${rec.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-6 p-6 rounded-3xl bg-neutral-900/50 border border-neutral-800 hover:border-red-500/50 hover:bg-neutral-800/80 transition-all duration-300 group shadow-lg hover:shadow-red-500/5"
                >
                  <div className="w-full relative rounded-2xl overflow-hidden aspect-video bg-neutral-950 border border-neutral-800/50">
                    <img 
                      src={`https://img.youtube.com/vi/${rec.video_id}/maxresdefault.jpg`} 
                      alt={rec.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${rec.video_id}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-all duration-300">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-600/50 transform scale-90 group-hover:scale-100 transition-transform">
                        <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1 gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors leading-tight">
                          {rec.title}
                        </h3>
                        <p className="text-neutral-400 font-medium">{rec.channel_title}</p>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl text-red-400 font-black text-xl">
                        {rec.score}
                        <span className="text-[10px] text-red-400/60 -mt-1 font-bold tracking-widest">/10</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto bg-black/40 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-bold text-red-400 tracking-wider uppercase">Agent Reasoning</span>
                      </div>
                      <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                        {rec.reasoning}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
        </div>
      )}

      {/* Global styles for custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
