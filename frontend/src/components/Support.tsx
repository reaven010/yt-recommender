"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Github, Star, Heart, CheckCircle2 } from "lucide-react";

export default function Support() {
  const [showToast, setShowToast] = useState(false);

  const handleShareClick = () => {
    const shareText = "Check out this awesome AI YouTube Recommender that uses autonomous agents to search, analyze transcripts, and rank the best videos! 🚀 https://github.com/Reaven010/yt-recommender";
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
    } else {
      // Fallback copy mechanism for non-secure HTTP contexts
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error("Fallback copy failed: ", err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative glass rounded-[3rem] p-8 md:p-16 border border-white/5 overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700">
          <Heart className="w-64 h-64 fill-white" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
              <SparkleIcon className="w-4 h-4" />
              Support the Creator
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Fuel the <span className="text-primary italic">Innovation</span> <br />
              Behind AI Agents
            </h2>
            
            <p className="text-lg text-neutral-400 font-medium leading-relaxed max-w-lg">
              Developing this autonomous YouTube recommender takes countless hours of research and API resources. 
              If this tool has helped you find your next favorite video, consider supporting its evolution.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.a
                href="https://buymeacoffee.com/reaven010"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-8 py-4 bg-[#FFDD00] text-black rounded-2xl font-bold transition-shadow hover:shadow-[0_0_30px_rgba(255,221,0,0.3)]"
              >
                <Coffee className="w-5 h-5 fill-current" />
                <span>Buy Me a Coffee</span>
              </motion.a>

              <motion.a
                href="https://github.com/Reaven010/yt-recommender"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all"
              >
                <Github className="w-5 h-5" />
                <span>Source Code</span>
              </motion.a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <SupportCard 
              icon={<Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />}
              title="Star on GitHub"
              description="Help us grow by giving the repository a star. It means the world to us!"
              link="https://github.com/Reaven010/yt-recommender"
            />
            <SupportCard 
              icon={<Heart className="w-6 h-6 text-red-500 fill-red-500" />}
              title="Spread the Word"
              description="Share this tool with your friends and help them find better content."
              link="#"
              isInternal
              onClick={handleShareClick}
            />
          </div>
        </div>
      </motion.div>

      {/* Floating Success Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-neutral-900/90 border border-emerald-500/30 text-emerald-200 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-white leading-tight">Link copied!</span>
              <span className="text-[11px] text-neutral-400 font-medium mt-0.5">Spread the word with your friends.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function SupportCard({ icon, title, description, link, isInternal = false, onClick }: { icon: React.ReactNode, title: string, description: string, link: string, isInternal?: boolean, onClick?: () => void }) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.a
      href={link}
      onClick={handleClick}
      target={isInternal ? "_self" : "_blank"}
      rel={isInternal ? "" : "noopener noreferrer"}
      whileHover={{ y: -5 }}
      className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-all flex flex-col gap-4 group/card cursor-pointer"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover/card:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-neutral-500 font-medium leading-relaxed">{description}</p>
    </motion.a>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z" />
      <path d="M12 10V3" />
      <path d="M12 21v-7" />
      <path d="M16.24 7.76l-4.24 4.24" />
      <path d="M12 12l-4.24-4.24" />
      <path d="M21 12h-7" />
      <path d="M10 12H3" />
      <path d="M16.24 16.24l-4.24-4.24" />
      <path d="M12 12l-4.24 4.24" />
    </svg>
  );
}
