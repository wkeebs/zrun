'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionButton from '@/components/action-button';

const phrases = ['Run Faster...', 'Race Better...', 'Go Further...'];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setText(current => {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
          // Deleting text
          if (current === '') {
            setIsDeleting(false);
            setPhraseIndex((phraseIndex + 1) % phrases.length);
            return '';
          }
          return current.slice(0, -1);
        } else {
          // Typing text
          if (current === currentPhrase) {
            setTimeout(() => setIsDeleting(true), 2000);
            return current;
          }
          return currentPhrase.slice(0, current.length + 1);
        }
      });
    }, isDeleting ? 50 : 100);

    return () => clearInterval(interval);
  }, [phraseIndex, isDeleting]);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden flex items-center justify-center">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800" />
      
      {/* Grain effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: '0.4'
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-12 max-w-2xl px-4">
        {/* Tagline */}
        <div className={`space-y-4 transition-all duration-1000 
          ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-50">
            Train Smarter
          </h1>
          <p className="text-3xl text-zinc-400 h-8 font-mono">
            {text}
          </p>
        </div>

        {/* CTA Button */}
        <ActionButton
          route="/plans/new"
          className={`group relative px-8 py-6 bg-zinc-200 text-zinc-900 rounded-lg font-medium 
            border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-50
            transition-all duration-500 
            ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <span className="flex items-center gap-2 text-lg">
            Start Now
            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </ActionButton>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,zinc-800_1px,transparent_1px),linear-gradient(to_bottom,zinc-800_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-5" />
    </div>
  );
}