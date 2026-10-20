import { Hero } from "@/components/workflows/Hero";
import { SearchFilters } from "@/components/workflows/SearchFilters";
import { FeaturedWorkflows } from "@/components/workflows/FeaturedWorkflows";
import { TrendingWorkflows } from "@/components/workflows/TrendingWorkflows";
import { WorkflowCategories } from "@/components/workflows/WorkflowCategories";
import { WorkflowProcess } from "@/components/workflows/WorkflowProcess";
import { CreatorSpotlight } from "@/components/workflows/CreatorSpotlight";
import { CTA } from "@/components/workflows/CTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflows Marketplace | ContextNode",
  description: "Discover production-ready AI execution workflows for development, content creation, business operations, and more.",
};

export default function WorkflowsPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      {/* 
        Section 1 — Hero 
      */}
      <Hero />

      {/* 
        Section 2 — Workflow Search 
      */}
      <SearchFilters />

      {/* 
        Section 3 — Featured Workflows 
      */}
      <FeaturedWorkflows />

      {/* 
        Section 4 — Trending This Week 
      */}
      <TrendingWorkflows />

      {/* 
        Section 5 — Workflow Categories 
      */}
      <WorkflowCategories />

      {/* 
        Section 6 & 7 combined conceptually — How Workflows Work / Process 
      */}
      <WorkflowProcess />

      {/* 
        Section 8 — Creator Spotlight 
      */}
      <CreatorSpotlight />

      {/* 
        Section 9 — CTA 
      */}
      <CTA />
    </main>
  );
}
