# ContextNode Frontend

Frontend application for ContextNode — an AI-native asset discovery platform for:

- AI prompts
- AI workflows
- Context Packs
- developer systems
- creative AI assets

This project focuses ONLY on the frontend layer using Next.js.

Backend, dashboard logic, APIs, authentication, admin panel, and database architecture will be handled separately using Laravel.

---

# Frontend Vision

The frontend should feel:

- premium
- cinematic
- futuristic
- fast
- SEO-friendly
- AI-native
- smooth and responsive

Design inspiration:

- Raycast
- Linear
- Vercel
- Framer
- Supabase

The UI should NOT feel like:

- ecommerce website
- generic SaaS template
- AI tools directory
- prompt spam marketplace

---

# Tech Stack

## Core Framework

- Next.js 15 (App Router)
- React 19
- TypeScript

---

# Styling

- Tailwind CSS
- shadcn/ui
- clsx
- tailwind-merge

---

# Animation

## Primary Animation Library

### Motion (Framer Motion)

Reason:

- production-grade
- optimized
- smooth animations
- modern React support
- highly customizable
- better ecosystem
- perfect for premium UI

Used only for:

- subtle transitions
- hover effects
- fade animations
- reveal animations
- floating motion

Avoid:

- excessive animations
- heavy parallax
- complex 3D rendering

---

# Icons

- Lucide React

---

# Fonts

- Geist
- Inter

---

# SEO Strategy

The frontend must be fully SEO optimized.

Requirements:

- server-rendered pages
- metadata optimization
- Open Graph support
- Twitter cards
- sitemap
- robots.txt
- semantic HTML
- optimized heading structure
- clean URLs
- image optimization
- schema markup support

---

# Main Frontend Pages

## Public Pages

### Landing Page

Main storytelling and discovery homepage.

---

### Explore Page

Unified AI asset discovery page.

Features:

- search
- categories
- trending assets
- filters
- recommendations

---

### Prompt Marketplace

Dedicated page for:

- image prompts
- video prompts
- cinematic prompts
- creative AI assets

---

### Context Pack Marketplace

Dedicated page for:

- developer Context Packs
- AI workflows
- architecture systems
- execution kits

---

### Asset Detail Pages

Dynamic pages for:

- prompts
- Context Packs
- workflows

Includes:

- previews
- descriptions
- tags
- creator info
- related assets

---

### Category Pages

Examples:

- /prompts/image
- /prompts/video
- /context-packs/saas
- /workflows

---

# Frontend Features

## Search Experience

Unified AI-native search system for:

- prompts
- workflows
- Context Packs
- creators

---

## UI Features

- premium dark mode
- smooth hover interactions
- responsive layouts
- modern card system
- cinematic hero sections
- subtle ambient glow
- optimized animations

---

# Design System

## Design Direction

Inspired by Raycast color atmosphere:

- deep black backgrounds
- subtle red-blue ambient glow
- minimal distractions
- elegant spacing
- cinematic lighting

---

## UI Feel

The interface should feel:

- elite
- premium
- modern
- intelligent
- creator-focused
- developer-friendly

---

# Frontend Folder Structure

```bash
src
├── app
│   ├── (public)
│   │   ├── page.tsx
│   │   ├── explore
│   │   ├── prompts
│   │   ├── context-packs
│   │   ├── workflows
│   │   └── categories
│   │
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── components
│   ├── ui
│   ├── layout
│   ├── navbar
│   ├── footer
│   ├── hero
│   ├── cards
│   ├── search
│   ├── sections
│   ├── animations
│   └── marketplace
│
├── lib
│   ├── metadata
│   ├── seo
│   ├── constants
│   ├── helpers
│   └── utils
│
├── hooks
│
├── styles
│
├── types
│
├── data
│
└── public
    ├── images
    ├── icons
    └── assets
```

---

# Routing Structure

```bash
/
├── /explore
├── /prompts
│   ├── /image
│   ├── /video
│   └── /cinematic
│
├── /context-packs
│   ├── /saas
│   ├── /ai-agents
│   └── /developer-tools
│
├── /workflows
├── /categories
└── /search
```

---

# Performance Goals

Frontend should prioritize:

- fast loading
- smooth rendering
- low layout shift
- optimized images
- SEO performance
- accessibility
- clean animations

---

# Important UI Rules

DO:

- keep layouts spacious
- maintain premium feel
- use subtle animations
- prioritize typography
- use clean component hierarchy

DO NOT:

- overuse gradients
- create cluttered pages
- use heavy animations
- use neon cyberpunk visuals
- make it feel like ecommerce

---

# Development Priorities

Build order:

1. Design System
2. Global Layout
3. Navbar
4. Hero Section
5. Search Experience
6. Asset Cards
7. Marketplace Pages
8. Detail Pages
9. Mobile Optimization
10. SEO Optimization

---

# Development Setup

## Install Dependencies

```bash
npm install
```

---

## Run Development Server

```bash
npm run dev
```

---

## Production Build

```bash
npm run build
```

---

# Environment Variables

```env
NEXT_PUBLIC_APP_NAME=ContextNode
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

# Future Backend Integration

Backend will be developed separately using Laravel.

Laravel responsibilities:

- authentication
- dashboard
- APIs
- asset management
- admin panel
- payment systems
- analytics
- database architecture

Next.js responsibilities:

- frontend rendering
- SEO
- UI/UX
- asset discovery
- public marketplace pages

---

# Final Product Goal

ContextNode aims to become:
a premium AI-native discovery ecosystem for creators and developers.

The platform combines:

- prompts
- workflows
- Context Packs
- AI systems
- creative assets

into one unified modern experience.
