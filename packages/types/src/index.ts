// Core ContextNode Platform Types

export interface Prompt {
  id: number;
  slug: string;
  title: string;
  copies: string;
  category: string;
  image: string;
  promptText: string;
  author: string;
  models: string[];
}

export interface ContextPack {
  id: number;
  slug: string;
  title: string;
  category: string;
  downloads: string;
  verified: boolean;
  image: string;
  description: string;
  author: string;
  tags: string[];
  systemPrompt: string;
  ruleFileContent: string;
  workflowsCount: number;
  promptsCount: number;
}

export interface DevPrompt {
  id: number;
  slug: string;
  title: string;
  useCase: string;
  framework: string;
  rating: number;
  reviews: number;
  copies: string;
  systemPromptSnippet: string;
  author: string;
}

export interface AIAssetSummary {
  id: string | number;
  title: string;
  slug?: string;
  assetType?: 'prompt' | 'workflow' | 'contextpack' | 'system';
  promptType?: 'image' | 'video' | 'text' | 'code';
  status?: 'draft' | 'pending_review' | 'published' | 'archived';
  category?: string;
  coverImage?: string | { url?: string };
  author?: string | { name?: string; email?: string };
  createdAt?: string;
  updatedAt?: string;
}
