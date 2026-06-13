import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, MapPin, ChevronRight, Search, Heart,
  Star, CheckCircle, Users, TrendingUp, Shield, Zap,
  Building2, Home as HomeIcon, Trees, Briefcase, LayoutGrid,
  Phone, Mail, Instagram, Linkedin, Twitter, ChevronDown,
  Play, X
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}

// ── CSS injected once ────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@400;500;700&display=swap');

  :root {
    --black: #0a0a0a;
    --white: #ffffff;
    --cream: #f8f6f1;
    --accent: #c8a96e;
    --accent-dark: #a88748;
    --text-muted: #6b6b6b;
    --border: rgba(255,255,255,0.08);
    --border-dark: rgba(0,0,0,0.08);
    --card-radius: 20px;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
    --space-xl: 120px;
    --space-lg: 80px;
    --space-md: 48px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .reb-root { font-family: 'Satoshi', sans-serif; background: var(--black); color: var(--white); overflow-x: hidden; }

  /* ── NAVBAR ── */
  .reb-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    padding: 1.25rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
    transition: all 0.4s var(--ease);
  }
  .reb-nav.scrolled {
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 0.875rem 2rem;
    border-bottom: 1px solid var(--border);
  }
  .reb-nav-logo { font-family: 'Clash Display', sans-serif; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.04em; color: var(--white); text-decoration: none; }
  .reb-nav-logo span { color: var(--accent); }
  .reb-nav-links { display: flex; align-items: center; gap: 2.5rem; }
  .reb-nav-links a { color: rgba(255,255,255,0.65); font-size: 0.875rem; font-weight: 500; text-decoration: none; letter-spacing: 0.01em; transition: color 0.2s; }
  .reb-nav-links a:hover { color: var(--white); }
  .reb-nav-cta { display: flex; align-items: center; gap: 0.75rem; }
  .nav-btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: var(--white); padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem; font-family: 'Satoshi', sans-serif; }
  .nav-btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); }
  .nav-btn-solid { background: var(--accent); border: 1px solid var(--accent); color: var(--black); padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.25s; text-decoration: none; font-family: 'Satoshi', sans-serif; }
  .nav-btn-solid:hover { background: var(--accent-dark); transform: translateY(-1px); }

  /* ── HERO ── */
  .reb-hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; }
  .reb-hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transform-origin: center; }
  .reb-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.1) 30%, rgba(10,10,10,0.7) 70%, rgba(10,10,10,0.95) 100%);
  }
  .reb-hero-content { position: relative; z-index: 2; padding: 0 2rem 5rem; max-width: 1280px; margin: 0 auto; width: 100%; }
  .reb-hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(200,169,110,0.15); border: 1px solid rgba(200,169,110,0.3); color: var(--accent); padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 1.75rem; }
  .reb-hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse-dot 2s infinite; }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }

  .reb-hero-h1 { font-family: 'Clash Display', sans-serif; font-size: clamp(3rem, 7vw, 6.5rem); font-weight: 700; line-height: 0.95; letter-spacing: -0.04em; color: var(--white); margin-bottom: 1.5rem; }
  .reb-hero-h1 em { font-style: italic; color: var(--accent); }
  .reb-hero-sub { font-size: 1.0625rem; color: rgba(255,255,255,0.6); max-width: 520px; line-height: 1.7; margin-bottom: 2.5rem; }

  /* ── HERO SEARCH ── */
  .hero-search-wrap { background: rgba(255,255,255,0.07); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; padding: 6px; display: flex; align-items: center; gap: 0; max-width: 760px; margin-bottom: 2.5rem; }
  .hero-search-field { flex: 1; display: flex; align-items: center; gap: 0.625rem; padding: 0.875rem 1.25rem; border-right: 1px solid rgba(255,255,255,0.1); }
  .hero-search-field:last-of-type { border-right: none; }
  .hero-search-field svg { color: var(--accent); flex-shrink: 0; }
  .hero-search-field select, .hero-search-field input {
    background: transparent; border: none; outline: none; color: var(--white); font-family: 'Satoshi', sans-serif; font-size: 0.9375rem; font-weight: 500; width: 100%; cursor: pointer;
  }
  .hero-search-field select option { background: #1a1a1a; color: var(--white); }
  .hero-search-field select::placeholder, .hero-search-field input::placeholder { color: rgba(255,255,255,0.4); }
  .hero-search-btn { background: var(--accent); color: var(--black); border: none; border-radius: 12px; padding: 0.875rem 1.75rem; font-family: 'Satoshi', sans-serif; font-size: 0.9375rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.25s; flex-shrink: 0; }
  .hero-search-btn:hover { background: var(--accent-dark); transform: scale(1.02); }

  /* ── AVATAR STACK ── */
  .avatar-stack { display: flex; align-items: center; gap: 0; }
  .avatar-stack img { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--black); margin-left: -8px; object-fit: cover; }
  .avatar-stack img:first-child { margin-left: 0; }
  .avatar-stack-text { margin-left: 0.75rem; font-size: 0.8125rem; color: rgba(255,255,255,0.6); }
  .avatar-stack-text strong { color: var(--white); font-weight: 600; }

  /* ── MARQUEE ── */
  .reb-marquee { overflow: hidden; padding: 1.125rem 0; background: var(--accent); }
  .reb-marquee-track { display: flex; gap: 0; white-space: nowrap; animation: marquee-scroll 28s linear infinite; }
  .reb-marquee-track:hover { animation-play-state: paused; }
  @keyframes marquee-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  .reb-marquee-item { font-family: 'Clash Display', sans-serif; font-size: 0.75rem; font-weight: 600; color: var(--black); letter-spacing: 0.12em; text-transform: uppercase; padding: 0 2rem; }

  /* ── SECTION COMMONS ── */
  .section-eyebrow { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); display: block; margin-bottom: 0.75rem; }
  .section-h2 { font-family: 'Clash Display', sans-serif; font-size: clamp(2rem, 4.5vw, 3.5rem); font-weight: 700; line-height: 1.05; letter-spacing: -0.03em; }
  .section-h2-white { color: var(--white); }
  .section-h2-black { color: var(--black); }

  /* ── MEDIA LOGOS ── */
  .media-strip { background: var(--cream); padding: 2.5rem 2rem; }
  .media-strip-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; gap: 3rem; flex-wrap: wrap; justify-content: center; }
  .media-strip-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #aaa; flex-shrink: 0; }
  .media-logo { font-family: 'Clash Display', sans-serif; font-size: 1.125rem; font-weight: 700; color: #bbb; letter-spacing: -0.02em; transition: color 0.25s; cursor: default; }
  .media-logo:hover { color: var(--black); }

  /* ── STATS ── */
  .stats-section { background: var(--black); padding: var(--space-xl) 2rem; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border: 1px solid #1c1c1c; border-radius: var(--card-radius); overflow: hidden; }
  .stat-cell { padding: 3rem 2.5rem; border-right: 1px solid #1c1c1c; position: relative; overflow: hidden; }
  .stat-cell:last-child { border-right: none; }
  .stat-cell::before { content:''; position:absolute; bottom:-40px; right:-40px; width:120px; height:120px; border-radius:50%; background: radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%); }
  .stat-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(200,169,110,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; color: var(--accent); }
  .stat-number { font-family: 'Clash Display', sans-serif; font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 700; color: var(--white); letter-spacing: -0.04em; line-height: 1; }
  .stat-label { font-size: 0.875rem; color: rgba(255,255,255,0.45); margin-top: 0.5rem; font-weight: 500; }

  /* ── CITY EXPLORER ── */
  .city-section { background: var(--cream); padding: var(--space-xl) 2rem; }
  .city-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 3.5rem; }
  .city-card { position: relative; border-radius: var(--card-radius); overflow: hidden; aspect-ratio: 4/3; cursor: pointer; }
  .city-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease); }
  .city-card:hover .city-card-img { transform: scale(1.07); }
  .city-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%); }
  .city-card-body { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem; display: flex; justify-content: space-between; align-items: flex-end; }
  .city-card-name { font-family: 'Clash Display', sans-serif; font-size: 1.375rem; font-weight: 700; color: var(--white); letter-spacing: -0.02em; }
  .city-card-count { font-size: 0.8125rem; color: rgba(255,255,255,0.6); margin-top: 3px; }
  .city-card-arrow { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; color: var(--white); transition: all 0.3s; flex-shrink: 0; }
  .city-card:hover .city-card-arrow { background: var(--accent); border-color: var(--accent); color: var(--black); transform: rotate(45deg); }
  .city-card.large { grid-row: span 1; }

  /* ── FEATURED LISTINGS ── */
  .listings-section { background: var(--black); padding: var(--space-xl) 2rem; }
  .prop-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 3.5rem; }
  .prop-card-new { border-radius: var(--card-radius); overflow: hidden; background: #111; border: 1px solid #1c1c1c; transition: border-color 0.3s, transform 0.4s var(--ease); cursor: pointer; transform-style: preserve-3d; }
  .prop-card-new:hover { border-color: #2a2a2a; }
  .prop-img-wrap { position: relative; overflow: hidden; aspect-ratio: 4/3; }
  .prop-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease); display: block; }
  .prop-card-new:hover .prop-img-wrap img { transform: scale(1.05); }

  .prop-badge-row { position: absolute; top: 1rem; left: 1rem; right: 1rem; display: flex; justify-content: space-between; align-items: center; }
  .prop-type-badge { background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); color: var(--white); padding: 0.3rem 0.75rem; border-radius: 100px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.04em; }
  .prop-status-badge { padding: 0.3rem 0.75rem; border-radius: 100px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .badge-new { background: rgba(200,169,110,0.9); color: var(--black); }
  .badge-trending { background: rgba(239,68,68,0.85); color: var(--white); }
  .badge-drop { background: rgba(34,197,94,0.85); color: var(--white); }

  .wishlist-btn { position: absolute; top: 1rem; right: 1rem; width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.25s; color: rgba(255,255,255,0.7); }
  .wishlist-btn:hover, .wishlist-btn.active { background: rgba(239,68,68,0.9); border-color: transparent; color: var(--white); }
  .wishlist-btn.active svg { fill: var(--white); }

  .prop-glass-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%); padding: 1.25rem; transform: translateY(100%); transition: transform 0.4s var(--ease); }
  .prop-card-new:hover .prop-glass-overlay { transform: translateY(0); }
  .prop-emi { font-size: 0.8125rem; color: rgba(255,255,255,0.75); font-weight: 500; }

  .prop-body { padding: 1.25rem; }
  .prop-title { font-family: 'Clash Display', sans-serif; font-size: 1.125rem; font-weight: 600; color: var(--white); letter-spacing: -0.02em; margin-bottom: 0.4rem; }
  .prop-location { font-size: 0.8125rem; color: rgba(255,255,255,0.45); display: flex; align-items: center; gap: 0.3rem; margin-bottom: 1rem; }
  .prop-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #1c1c1c; padding-top: 1rem; }
  .prop-price { font-family: 'Clash Display', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--accent); letter-spacing: -0.02em; }
  .prop-cta-icon { width: 34px; height: 34px; border-radius: 50%; border: 1px solid #2a2a2a; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); transition: all 0.25s; }
  .prop-card-new:hover .prop-cta-icon { border-color: var(--accent); color: var(--accent); }

  /* ── STEPS ── */
  .steps-section { background: var(--cream); padding: var(--space-xl) 2rem; }
  .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 4rem; position: relative; }
  .steps-connector { position: absolute; top: 2.75rem; left: calc(16.66% + 1rem); right: calc(16.66% + 1rem); height: 1px; background: linear-gradient(to right, var(--accent), transparent 40%, transparent 60%, var(--accent)); opacity: 0.3; }
  .step-block { position: relative; }
  .step-icon-wrap { width: 52px; height: 52px; border-radius: 14px; background: var(--black); display: flex; align-items: center; justify-content: center; color: var(--accent); margin-bottom: 1.5rem; position: relative; transition: transform 0.3s var(--ease); }
  .step-block:hover .step-icon-wrap { transform: scale(1.1) rotate(-5deg); }
  .step-num-tag { position: absolute; top: -8px; right: -8px; width: 20px; height: 20px; border-radius: 50%; background: var(--accent); color: var(--black); font-size: 0.625rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }
  .step-title { font-family: 'Clash Display', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--black); margin-bottom: 0.75rem; letter-spacing: -0.02em; }
  .step-text { font-size: 0.9375rem; color: #555; line-height: 1.7; margin-bottom: 1rem; }
  .step-micro { font-size: 0.8125rem; font-weight: 600; color: var(--accent-dark); display: flex; align-items: center; gap: 0.3rem; }

  /* ── TESTIMONIALS ── */
  .testimonials-section { background: var(--black); padding: var(--space-xl) 2rem; }
  .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 3.5rem; }
  .testi-card { background: #111; border: 1px solid #1c1c1c; border-radius: var(--card-radius); padding: 2rem; transition: border-color 0.3s, transform 0.3s var(--ease); }
  .testi-card:hover { border-color: #2c2c2c; transform: translateY(-4px); }
  .testi-stars { display: flex; gap: 3px; margin-bottom: 1.25rem; }
  .testi-stars svg { color: var(--accent); fill: var(--accent); }
  .testi-text { font-size: 0.9375rem; color: rgba(255,255,255,0.65); line-height: 1.75; margin-bottom: 1.5rem; font-style: italic; }
  .testi-author { display: flex; align-items: center; gap: 0.875rem; }
  .testi-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #2a2a2a; flex-shrink: 0; }
  .testi-name { font-weight: 700; color: var(--white); font-size: 0.9375rem; }
  .testi-meta { font-size: 0.8125rem; color: rgba(255,255,255,0.4); margin-top: 2px; }
  .testi-verified { display: inline-flex; align-items: center; gap: 4px; font-size: 0.7rem; font-weight: 700; color: #22c55e; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 4px; }

  /* ── CATEGORIES CAROUSEL ── */
  .category-section { background: #0a0a0a; padding: var(--space-xl) 0; }
  .category-card-new { width: 240px; border-radius: 18px; overflow: hidden; flex-shrink: 0; position: relative; aspect-ratio: 3/4; cursor: grab; }
  .category-card-new:active { cursor: grabbing; }
  .category-card-new img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s var(--ease); pointer-events: none; }
  .category-card-new:hover img { transform: scale(1.06); }
  .category-card-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem 1.25rem; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%); }
  .category-card-name { font-family: 'Clash Display', sans-serif; font-size: 1.125rem; font-weight: 700; color: var(--white); }
  .category-card-sub { font-size: 0.8125rem; color: rgba(255,255,255,0.55); margin-top: 3px; }
  .category-count { display: inline-block; background: rgba(200,169,110,0.2); border: 1px solid rgba(200,169,110,0.3); color: var(--accent); font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 100px; margin-top: 6px; }

  /* ── CTA ── */
  .cta-section { background: var(--cream); padding: var(--space-xl) 2rem; position: relative; overflow: hidden; }
  .cta-bg-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-family: 'Clash Display', sans-serif; font-size: clamp(6rem, 18vw, 16rem); font-weight: 900; color: rgba(0,0,0,0.04); white-space: nowrap; pointer-events: none; letter-spacing: -0.05em; user-select: none; }
  .cta-inner { max-width: 760px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
  .cta-live-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2rem; }
  .cta-live-dot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; animation: pulse-dot 1.5s infinite; }
  .cta-h2 { font-family: 'Clash Display', sans-serif; font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 700; color: var(--black); line-height: 1.0; letter-spacing: -0.04em; margin-bottom: 1.25rem; }
  .cta-h2 em { font-style: italic; color: var(--accent-dark); }
  .cta-sub { font-size: 1.0625rem; color: #666; line-height: 1.7; max-width: 520px; margin: 0 auto 2.5rem; }
  .cta-split { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-width: 560px; margin: 0 auto; }
  .cta-btn-buy { background: var(--black); color: var(--white); border: none; border-radius: 14px; padding: 1.125rem; font-family: 'Satoshi', sans-serif; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.25s; text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 3px; }
  .cta-btn-buy:hover { background: #1a1a1a; transform: translateY(-2px); }
  .cta-btn-buy small { font-size: 0.75rem; font-weight: 400; color: rgba(255,255,255,0.5); }
  .cta-btn-sell { background: var(--accent); color: var(--black); border: none; border-radius: 14px; padding: 1.125rem; font-family: 'Satoshi', sans-serif; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.25s; text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 3px; }
  .cta-btn-sell:hover { background: var(--accent-dark); transform: translateY(-2px); }
  .cta-btn-sell small { font-size: 0.75rem; font-weight: 400; color: rgba(0,0,0,0.5); }
  .cta-trust-row { display: flex; justify-content: center; align-items: center; gap: 2rem; margin-top: 2.5rem; flex-wrap: wrap; }
  .cta-trust-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: #888; font-weight: 500; }
  .cta-trust-item svg { color: var(--accent-dark); }

  /* ── FOOTER ── */
  .reb-footer { background: #060606; border-top: 1px solid #141414; padding: var(--space-lg) 2rem 2rem; }
  .footer-grid { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 4rem; }
  .footer-brand-desc { font-size: 0.9375rem; color: rgba(255,255,255,0.4); line-height: 1.7; margin-top: 1rem; max-width: 280px; }
  .footer-social { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
  .footer-social a { width: 36px; height: 36px; border-radius: 10px; background: #141414; border: 1px solid #1c1c1c; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.45); transition: all 0.25s; text-decoration: none; }
  .footer-social a:hover { background: #1c1c1c; color: var(--white); border-color: #2a2a2a; }
  .footer-col-title { font-family: 'Clash Display', sans-serif; font-size: 0.875rem; font-weight: 700; color: var(--white); letter-spacing: 0.04em; margin-bottom: 1.25rem; }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
  .footer-links li a { font-size: 0.875rem; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
  .footer-links li a:hover { color: rgba(255,255,255,0.8); }
  .footer-bottom { max-width: 1280px; margin: 0 auto; border-top: 1px solid #141414; padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
  .footer-bottom-text { font-size: 0.8125rem; color: rgba(255,255,255,0.25); }
  .footer-trust { display: flex; gap: 1.5rem; }
  .trust-seal { font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.3); display: flex; align-items: center; gap: 0.35rem; }
  .trust-seal svg { color: var(--accent); }

  /* ── GENERAL BTNS ── */
  .reb-btn-white { background: var(--white); color: var(--black); border: none; padding: 0.9rem 2rem; border-radius: 100px; font-family: 'Satoshi', sans-serif; font-size: 0.9375rem; font-weight: 700; cursor: pointer; transition: all 0.25s; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; }
  .reb-btn-white:hover { background: #e8e8e8; transform: translateY(-2px); }
  .reb-btn-ghost-black { background: transparent; color: var(--black); border: 1.5px solid rgba(0,0,0,0.2); padding: 0.9rem 2rem; border-radius: 100px; font-family: 'Satoshi', sans-serif; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: all 0.25s; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; }
  .reb-btn-ghost-black:hover { border-color: rgba(0,0,0,0.4); }
  .section-header-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0; flex-wrap: wrap; gap: 1rem; }
  .view-all-link { font-size: 0.875rem; font-weight: 600; color: var(--accent); text-decoration: none; display: flex; align-items: center; gap: 0.3rem; transition: gap 0.2s; }
  .view-all-link:hover { gap: 0.6rem; }

  @media (max-width: 1024px) {
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .stat-cell:nth-child(2) { border-right: none; }
    .stat-cell:nth-child(1), .stat-cell:nth-child(2) { border-bottom: 1px solid #1c1c1c; }
    .city-grid { grid-template-columns: repeat(2,1fr); }
    .prop-grid { grid-template-columns: repeat(2,1fr); }
    .testimonials-grid { grid-template-columns: repeat(2,1fr); }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
  }
  @media (max-width: 768px) {
    :root { --space-xl: 72px; --space-lg: 48px; }
    .reb-nav-links { display: none; }
    .hero-search-wrap { flex-direction: column; gap: 6px; padding: 10px; }
    .hero-search-field { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0.75rem 1rem; }
    .hero-search-field:last-of-type { border-bottom: none; }
    .hero-search-btn { width: 100%; justify-content: center; border-radius: 10px; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .city-grid { grid-template-columns: 1fr; }
    .prop-grid { grid-template-columns: 1fr; }
    .steps-grid { grid-template-columns: 1fr; }
    .steps-connector { display: none; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .cta-split { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr; }
    .section-header-row { flex-direction: column; align-items: flex-start; }
  }
`;

// ── Easing ──────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1];

// ── Animated Counter ────────────────────────────────────────
function AnimatedCounter({ to, suffix = '', prefix = '', decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const motionVal = useMotionValue(0);
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(motionVal, to, {
      duration: 2, ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) {
          const fmt = decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toLocaleString('en-IN');
          ref.current.textContent = `${prefix}${fmt}${suffix}`;
        }
      },
    });
    return ctrl.stop;
  }, [inView, to]);
  return <span ref={ref} className="stat-number">{prefix}0{suffix}</span>;
}

// ── ClipReveal ──────────────────────────────────────────────
function ClipReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <div ref={ref} style={{ overflow: 'hidden' }} className={className}>
      <motion.div
        initial={{ y: '105%', opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.65, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ── Stagger ─────────────────────────────────────────────────
const staggerC = { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const staggerI = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };

// ── Data ─────────────────────────────────────────────────────
const MARQUEE = ['✦ Verified Listings', '✦ Zero Brokerage', '✦ Instant Connect', '✦ Trusted Sellers', '✦ Premium Properties', '✦ Fast Deals', '✦ Smart Search', '✦ Transparent Pricing', '✦ RERA Compliant', '✦ Live Support'];

const STATS_DATA = [
  { to: 12000, suffix: '+', label: 'Properties Verified', icon: <Building2 size={20} /> },
  { to: 48, suffix: 'hrs', label: 'Avg. Deal Closed In', icon: <Zap size={20} /> },
  { to: 0, prefix: '₹', suffix: '', label: 'Hidden Charges', icon: <Shield size={20} /> },
  { to: 98, suffix: '%', label: 'Seller Satisfaction', icon: <TrendingUp size={20} /> },
];

const CITIES = [
  { name: 'Mumbai', count: '3,240+', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Bangalore', count: '2,810+', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80' },
  { name: 'Delhi NCR', count: '2,190+', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hyderabad', count: '1,760+', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pune', count: '1,430+', img: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80' },
  { name: 'Chennai', count: '980+', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80' },
];

const FEATURED = [
  { img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80', tag: 'Villa', badge: 'New', badgeClass: 'badge-new', title: 'Prestige Sky Gardens', location: 'Whitefield, Bangalore', price: '₹ 3.2 Cr', emi: '~₹ 1.9L/mo EMI' },
  { img: 'https://vijayrajagroup.com/staticPages/Apartment-in-chennai.webp', tag: 'Apartment', badge: 'Trending', badgeClass: 'badge-trending', title: 'The Oberoi Residences', location: 'Bandra West, Mumbai', price: '₹ 1.85 Cr', emi: '~₹ 1.1L/mo EMI' },
  { img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', tag: 'Penthouse', badge: 'Price Drop', badgeClass: 'badge-drop', title: 'Elara Sky Suites', location: 'Gachibowli, Hyderabad', price: '₹ 5.1 Cr', emi: '~₹ 3.0L/mo EMI' },
];

const STEPS_DATA = [
  { icon: <Search size={22} />, num: '01', title: 'Search Smarter', desc: 'City-level filters, price sliders, property types — designed to cut through the noise instantly.', micro: 'Takes under 2 minutes', link: '/listings' },
  { icon: <Phone size={22} />, num: '02', title: 'Connect Directly', desc: 'No middlemen. No commissions. One click to call, email, or WhatsApp the seller directly.', micro: 'No registration needed', link: '/signup' },
  { icon: <HomeIcon size={22} />, num: '03', title: 'Book Instantly', desc: 'Pay a 5% token amount digitally to secure your property while documents are verified.', micro: '100% refundable token', link: '/signup' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Bought a 2BHK in Pune', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?auto=format&fit=crop&w=100&q=80', quote: 'Found our dream home in under a week. The zero-brokerage promise is real — saved over ₹1.5 lakhs. The seller connect was instant and transparent.' },
  { name: 'Rahul Mehta', city: 'Sold Villa in Bangalore', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80', quote: 'Listed my property and got 14 genuine inquiries in 3 days. Closed the deal in 6 days at asking price. Never going back to brokers again.' },
  { name: 'Anjali Nair', city: 'Rented flat in Mumbai', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', quote: 'REH made the Mumbai rental market actually manageable. Verified listings meant no time wasted on fake posts. Found my place in 4 days.' },
];

const CATEGORIES = [
  { title: 'Apartments', sub: 'Urban Living', count: '8,200+', img: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=600&q=80' },
  { title: 'Villas', sub: 'Luxury Spaces', count: '1,340+', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80' },
  { title: 'Farmlands', sub: 'Agricultural', count: '620+', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80' },
  { title: 'Commercial', sub: 'Office & Retail', count: '940+', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' },
  { title: 'Plots', sub: 'Build Your Dream', count: '2,100+', img: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=600&q=80' },
  { title: 'PG / Hostels', sub: 'Budget Stay', count: '3,400+', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80' },
];

// ── Drag Carousel ────────────────────────────────────────────
function DragCarousel() {
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => setConstraints({ left: -(track.scrollWidth - track.parentElement.offsetWidth), right: 0 });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return (
    <div style={{ overflow: 'hidden', cursor: 'grab' }}>
      <motion.div
        ref={trackRef}
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.06}
        style={{ x, display: 'flex', gap: '1rem', padding: '0 2rem' }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {[...CATEGORIES, ...CATEGORIES].map((cat, i) => (
          <motion.div
            key={i}
            className="category-card-new"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <img src={cat.img} alt={cat.title} draggable={false} />
            <div className="category-card-label">
              <div className="category-card-name">{cat.title}</div>
              <div className="category-card-sub">{cat.sub}</div>
              <span className="category-count">{cat.count} listings</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ── Wishlist Button ──────────────────────────────────────────
function WishlistBtn() {
  const [liked, setLiked] = useState(false);
  return (
    <button className={`wishlist-btn ${liked ? 'active' : ''}`} onClick={e => { e.preventDefault(); setLiked(!liked); }}>
      <Heart size={15} fill={liked ? '#fff' : 'none'} />
    </button>
  );
}

// ── Live Counter ─────────────────────────────────────────────
function LiveCounter() {
  const [count, setCount] = useState(847);
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + Math.floor(Math.random() * 3) - 1), 3500);
    return () => clearInterval(id);
  }, []);
  return <span style={{ fontWeight: 700 }}>{count}</span>;
}

// ── 3D Tilt Card ─────────────────────────────────────────────
function TiltCard({ children }) {
  const ref = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale3d(1.01,1.01,1.01)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)';
  }, []);
  return (
    <div
      ref={ref}
      className="prop-card-new"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.15s ease, border-color 0.3s' }}
    >
      {children}
    </div>
  );
}

// ── Main Home ────────────────────────────────────────────────
const Home = () => {
  const heroBgRef = useRef(null);
  const heroSectionRef = useRef(null);

  useEffect(() => {
    if (!gsap || !heroBgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(heroBgRef.current, {
        yPercent: 22,
        ease: 'none',
        scrollTrigger: { trigger: heroSectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="reb-root">
      <style>{CSS}</style>

      {/* ══ SECTION 1 — HERO ════════════════════════════════ */}
      <section ref={heroSectionRef} className="reb-hero">
        <div
          ref={heroBgRef}
          className="reb-hero-bg"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85')`,
            transform: 'scale(1.12)',
          }}
        />
        <div className="reb-hero-overlay" />

        <div style={{ position: 'relative', zIndex: 2, padding: '0 2rem 5rem', maxWidth: 1280, margin: '0 auto', width: '100%' }}>

          <center>
          <ClipReveal delay={0.1}>
            <div className="reb-hero-badge">
              <span className="reb-hero-badge-dot" />
              India's Most Transparent Property Platform · 2026
            </div>
          </ClipReveal>
          </center>
          
          <ClipReveal delay={0.2}>
            <h1 className="reb-hero-h1">Search. Connect.</h1>
          </ClipReveal>
          <ClipReveal delay={0.3}>
            <h1 className="reb-hero-h1"><em>Move In.</em></h1>
          </ClipReveal>

          <ClipReveal delay={0.45}>
            <p className="reb-hero-sub">
              No brokers. No hidden fees. Browse 12,000+ verified properties across India and connect directly with owners in minutes.
            </p>
          </ClipReveal>

          {/* Search Bar */}
          <ClipReveal delay={0.55}>
            <div className="hero-search-wrap">
              <div className="hero-search-field" style={{ flex: '1.4' }}>
                <MapPin size={17} />
                <select>
                  <option value="">Select City</option>
                  <option>Mumbai</option>
                  <option>Bangalore</option>
                  <option>Delhi NCR</option>
                  <option>Hyderabad</option>
                  <option>Pune</option>
                  <option>Chennai</option>
                  <option>Ahmedabad</option>
                  <option>Kolkata</option>
                </select>
              </div>
              <div className="hero-search-field" style={{ flex: '1.2' }}>
                <Building2 size={17} />
                <select>
                  <option value="">Property Type</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Plot</option>
                  <option>Commercial</option>
                  <option>Farmland</option>
                  <option>PG / Hostel</option>
                </select>
              </div>
              <div className="hero-search-field" style={{ flex: '1.2' }}>
                <ChevronDown size={17} />
                <select>
                  <option value="">Budget</option>
                  <option>Under ₹25L</option>
                  <option>₹25L – ₹50L</option>
                  <option>₹50L – ₹1Cr</option>
                  <option>₹1Cr – ₹3Cr</option>
                  <option>₹3Cr – ₹5Cr</option>
                  <option>Above ₹5Cr</option>
                </select>
              </div>
              <Link to="/signup" className="hero-search-btn">
                <Search size={17} /> Search Properties
              </Link>
            </div>
          </ClipReveal>

          {/* Social Proof */}
          <ClipReveal delay={0.65}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div className="avatar-stack">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b1e0?auto=format&fit=crop&w=60&q=80" alt="" />
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=60&q=80" alt="" />
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" alt="" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" alt="" />
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -8, fontSize: '0.6rem', fontWeight: 800, color: 'var(--black)' }}>+2L</div>
              </div>
              <span className="avatar-stack-text"><strong>2,40,000+</strong> families found their home here</span>
            </div>
          </ClipReveal>

        </div>
      </section>

      {/* ══ SECTION 2 — MARQUEE ══════════════════════════════ */}
      <div className="reb-marquee">
        <div className="reb-marquee-track">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="reb-marquee-item">{item}</span>
          ))}
        </div>
      </div>

      {/* ══ SECTION 2B — MEDIA STRIP ═════════════════════════ */}
      <div className="media-strip">
        <div className="media-strip-inner">
          <span className="media-strip-label">As featured in</span>
          {['Economic Times', 'Mint', 'The Hindu', 'YourStory', 'Inc42', 'Business Standard'].map(m => (
            <span key={m} className="media-logo">{m}</span>
          ))}
        </div>
      </div>

      {/* ══ SECTION 3 — STATS ════════════════════════════════ */}
      <section className="stats-section">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: '3.5rem' }}>
            <ClipReveal><span className="section-eyebrow">By the numbers</span></ClipReveal>
            <ClipReveal delay={0.1}><h2 className="section-h2 section-h2-white">Real estate,<br />reimagined.</h2></ClipReveal>
          </div>
          <div className="stats-grid">
            {STATS_DATA.map((s, i) => (
              <motion.div
                key={i}
                className="stat-cell"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.1 }}
              >
                <div className="stat-icon">{s.icon}</div>
                <AnimatedCounter to={s.to} suffix={s.suffix} prefix={s.prefix || ''} />
                <div className="stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — CITY EXPLORER ════════════════════════ */}
      <section className="city-section">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="section-header-row">
            <div>
              <ClipReveal><span className="section-eyebrow">Explore by city</span></ClipReveal>
              <ClipReveal delay={0.1}><h2 className="section-h2 section-h2-black">Where do you<br />want to live?</h2></ClipReveal>
            </div>
            <Link to="/signup" className="view-all-link">View all cities <ChevronRight size={15} /></Link>
          </div>
          <motion.div
            className="city-grid"
            variants={staggerC}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {CITIES.map((city, i) => (
              <motion.div key={i} variants={staggerI}>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <div className="city-card">
                    <img src={city.img} alt={city.name} className="city-card-img" loading="lazy" />
                    <div className="city-card-overlay" />
                    <div className="city-card-body">
                      <div>
                        <div className="city-card-name">{city.name}</div>
                        <div className="city-card-count">{city.count} properties</div>
                      </div>
                      <div className="city-card-arrow"><ArrowUpRight size={16} /></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ SECTION 5 — FEATURED LISTINGS ════════════════════ */}
      <section className="listings-section">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="section-header-row">
            <div>
              <ClipReveal><span className="section-eyebrow">Handpicked</span></ClipReveal>
              <ClipReveal delay={0.1}><h2 className="section-h2 section-h2-white">Featured<br />Properties</h2></ClipReveal>
            </div>
            <Link to="/signup" className="view-all-link">View all listings <ChevronRight size={15} /></Link>
          </div>
          <motion.div
            className="prop-grid"
            variants={staggerC}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {FEATURED.map((p, i) => (
              <motion.div key={i} variants={staggerI}>
                <Link to="/signup" style={{ textDecoration: 'none', display: 'block' }}>
                  <TiltCard>
                    <div className="prop-img-wrap">
                      <img src={p.img} alt={p.title} loading="lazy" />
                      <div className="prop-badge-row">
                        <span className="prop-type-badge">{p.tag}</span>
                        <span className={`prop-status-badge ${p.badgeClass}`}>{p.badge}</span>
                      </div>
                      <WishlistBtn />
                      <div className="prop-glass-overlay">
                        <div className="prop-emi">{p.emi}</div>
                      </div>
                    </div>
                    <div className="prop-body">
                      <div className="prop-title">{p.title}</div>
                      <div className="prop-location"><MapPin size={12} /> {p.location}</div>
                      <div className="prop-footer">
                        <span className="prop-price">{p.price}</span>
                        <div className="prop-cta-icon"><ArrowUpRight size={15} /></div>
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ SECTION 6 — HOW IT WORKS ═════════════════════════ */}
      <section className="steps-section">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div>
            <ClipReveal><span className="section-eyebrow">The process</span></ClipReveal>
            <ClipReveal delay={0.1}><h2 className="section-h2 section-h2-black">Three steps.<br />No surprises.</h2></ClipReveal>
          </div>
          <div className="steps-grid">
            <div className="steps-connector" />
            {STEPS_DATA.map((step, i) => (
              <motion.div
                key={i}
                className="step-block"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.15 }}
              >
                <div className="step-icon-wrap">
                  {step.icon}
                  <span className="step-num-tag">{step.num}</span>
                </div>
                <div className="step-title">{step.title}</div>
                <div className="step-text">{step.desc}</div>
                <div className="step-micro">
                  <CheckCircle size={13} /> {step.micro}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 7 — TESTIMONIALS ═════════════════════════ */}
      <section className="testimonials-section">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="section-header-row">
            <div>
              <ClipReveal><span className="section-eyebrow">Real stories</span></ClipReveal>
              <ClipReveal delay={0.1}><h2 className="section-h2 section-h2-white">What our<br />customers say</h2></ClipReveal>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.9375rem' }}>
              <Star size={18} fill="currentColor" /> 4.9 / 5 average rating
            </div>
          </div>
          <motion.div
            className="testimonials-grid"
            variants={staggerC}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} variants={staggerI} className="testi-card">
                <div className="testi-stars">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} />)}
                </div>
                <p className="testi-text">"{t.quote}"</p>
                <div className="testi-author">
                  <img src={t.avatar} alt={t.name} className="testi-avatar" />
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-meta">{t.city}</div>
                    <div className="testi-verified"><CheckCircle size={11} /> Verified Buyer</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ SECTION 8 — CATEGORY CAROUSEL ════════════════════ */}
      <section className="category-section">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', marginBottom: '3rem' }}>
          <div className="section-header-row">
            <div>
              <ClipReveal><span className="section-eyebrow">Drag to explore</span></ClipReveal>
              <ClipReveal delay={0.1}><h2 className="section-h2 section-h2-white">Every type.<br />Every budget.</h2></ClipReveal>
            </div>
            <p style={{ color: '#555', fontSize: '0.9rem', maxWidth: 280, lineHeight: 1.6 }}>
              From studios to sky villas — whatever your vision, we have a match.
            </p>
          </div>
        </div>
        <DragCarousel />
      </section>

      {/* ══ SECTION 9 — URGENCY CTA ══════════════════════════ */}
      <section className="cta-section">
        <div className="cta-bg-text">REH</div>
        <div className="cta-inner">
          <ClipReveal>
            <div className="cta-live-badge">
              <span className="cta-live-dot" />
              <LiveCounter /> people searching right now
            </div>
          </ClipReveal>

          <ClipReveal delay={0.1}>
            <h2 className="cta-h2">Your home is<br /><em>one click away.</em></h2>
          </ClipReveal>

          <ClipReveal delay={0.2}>
            <p className="cta-sub">
              Join 2,40,000+ Indians who found their perfect property — without the drama, the middlemen, or the hidden fees.
            </p>
          </ClipReveal>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
          >
            <div className="cta-split">
              <Link to="/listings" className="cta-btn-buy">
                I want to Buy / Rent
                <small>Browse 12,000+ listings</small>
              </Link>
              <Link to="/signup" className="cta-btn-sell">
                I want to Sell / List
                <small>Post free, no brokerage</small>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="cta-trust-row"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="cta-trust-item"><Shield size={14} /> RERA Compliant</span>
            <span className="cta-trust-item"><CheckCircle size={14} /> 100% Verified</span>
            <span className="cta-trust-item"><Zap size={14} /> Zero Brokerage</span>
            <span className="cta-trust-item"><Users size={14} /> 2.4L+ Families</span>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default Home;