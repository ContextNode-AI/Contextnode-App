
# ContextNode — Workflows Marketplace Page (Next.js 15 + TypeScript + Tailwind + shadcn/ui)

You are designing a premium AI-native Workflows discovery page for ContextNode.

Before generating anything, understand the product.

---

## Product Context

ContextNode is NOT:

* a generic prompt marketplace
* an AI tools directory
* an ecommerce marketplace
* a Gumroad clone

ContextNode is an AI-native asset discovery ecosystem.

The platform contains:

* Prompts
* Workflows
* Context Packs

Hierarchy:

```txt
Prompt
↓
Workflow
↓
Context Pack
```

### Prompts

Single AI instruction.

Example:

```txt
Generate a SaaS landing page headline
```

---

### Workflows

Multi-step AI execution processes.

Example:

```txt
Build SaaS MVP Workflow

Step 1 → Market Research
Step 2 → Validation
Step 3 → PRD Generation
Step 4 → Architecture Planning
Step 5 → Development
Step 6 → Testing
Step 7 → Deployment
```

Workflows help users execute complete processes.

---

### Context Packs

Complete production systems.

Example:

```txt
AI SaaS Starter Context Pack

Architecture
Folder Structure
Coding Standards
API Contracts
Database Schema
Implementation Plan
Deployment Guide
```

---

# Design Direction

The page must feel:

* premium
* cinematic
* futuristic
* AI-native
* intelligent
* developer-focused
* creator-focused

Visual inspiration:

* Raycast
* Linear
* Vercel
* Framer
* Supabase

DO NOT COPY.

Use only atmosphere and visual quality.

---

# Color System

Background:

```css
#050505
#0B0B0F
#101014
```

Accent effects:

```css
Blue glow
Soft red glow
Subtle purple blur
```

Avoid:

* bright gradients
* cyberpunk
* colorful marketplace feel

---

# Existing Site Requirements

Must integrate perfectly with existing ContextNode frontend.

Use:

* Existing Navbar
* Existing Footer
* Existing Container Widths
* Existing Design Tokens
* Existing Glow Effects
* Existing Typography System

Navbar already contains:

```txt
Explore
Context Packs
Prompts
Workflows
Get Started
```

Workflows should appear as active menu item.

---

# Page Objective

Help users discover ready-made AI execution systems.

Users should instantly understand:

```txt
Prompt = One instruction

Workflow = Process

Context Pack = Complete System
```

Without explicitly showing that comparison table.

The UI should naturally communicate it.

---

# Layout Structure

Generate complete page UI.

---

## Section 1 — Hero

Large cinematic hero.

Headline:

```txt
Execute Complete AI Workflows
```

Subheadline:

```txt
Discover production-ready workflows for development, content creation, business operations, marketing, research, and AI-assisted execution.
```

Include:

* animated glow background
* subtle grid
* floating workflow visualization
* premium typography

Right side visual:

Workflow diagram card:

```txt
Build SaaS MVP

Research
↓
Planning
↓
Architecture
↓
Development
↓
Testing
↓
Launch
```

Glassmorphism effect.

---

## Section 2 — Workflow Search

Large centered search.

Placeholder:

```txt
Search workflows...
```

Include filters:

* All
* Development
* Content
* Marketing
* Business
* AI Agents
* Design
* Productivity

Premium pill filters.

---

## Section 3 — Featured Workflows

Section title:

```txt
Featured Workflows
```

Large premium cards.

Each card contains:

* Cover image
* Workflow title
* Category
* Number of steps
* Difficulty
* Estimated completion time
* Creator name
* Save button

Example cards:

```txt
Build SaaS MVP
YouTube Automation System
AI Content Pipeline
Laravel API Development Flow
Startup Validation Workflow
```

Hover animations.

Premium glass cards.

---

## Section 4 — Trending This Week

Horizontal card carousel.

Show:

* trending badge
* workflow title
* execution count
* category

Cards slightly smaller than featured section.

---

## Section 5 — Workflow Categories

Grid layout.

Categories:

```txt
Development
Content Creation
Marketing
Business Operations
AI Automation
Research
Design
Productivity
```

Each category card contains:

* icon
* workflow count
* short description

---

## Section 6 — How Workflows Work

Three-step visual explanation.

Card 1:

```txt
Choose Workflow
```

Card 2:

```txt
Follow Execution Steps
```

Card 3:

```txt
Get Predictable Results
```

Use connected timeline graphics.

---

## Section 7 — Workflow Showcase

Large interactive section.

Example workflow:

```txt
Laravel SaaS Development Workflow
```

Display:

```txt
Step 1
Requirements

Step 2
Architecture

Step 3
Database Design

Step 4
API Development

Step 5
Frontend Integration

Step 6
Testing

Step 7
Deployment
```

Timeline style UI.

Modern vertical progress design.

Looks premium and educational.

---

## Section 8 — Creator Spotlight

Show workflow creators.

Card contains:

* avatar
* creator name
* total workflows
* total uses
* specialization

Premium creator cards.

---

## Section 9 — CTA

Large cinematic CTA.

Headline:

```txt
Build Faster With Proven Workflows
```

Buttons:

```txt
Explore Workflows
Create Workflow
```

Background:

* subtle blue glow
* red edge lighting
* glass surface

---

# Workflow Card Design

Every workflow card must display:

```txt
Cover
Title
Category
Step Count
Difficulty
Completion Time
Creator
Bookmark
```

Optional:

```txt
Uses Count
Trending Badge
```

---

# Animations

Use Motion.

Include:

* fade up
* staggered cards
* hover lift
* glow intensity on hover
* subtle floating effects

No excessive motion.

Must feel premium.

---

# Technical Requirements

Generate production-ready design for:

* Next.js 15 App Router
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion

Use reusable components.

Structure:

```txt
components/workflows/

Hero.tsx
SearchFilters.tsx
FeaturedWorkflows.tsx
TrendingWorkflows.tsx
WorkflowCategories.tsx
WorkflowProcess.tsx
CreatorSpotlight.tsx
CTA.tsx
WorkflowCard.tsx
```

---

# Important UX Goal

When a visitor lands on the page they should immediately understand:

```txt
These are complete AI execution processes,
not just prompts.
```

The page should feel like browsing proven execution systems used by creators, developers, founders, and AI builders.

Output a complete premium UI design specification with section-by-section visual details, layout decisions, component structure, spacing system, and interaction behavior.
