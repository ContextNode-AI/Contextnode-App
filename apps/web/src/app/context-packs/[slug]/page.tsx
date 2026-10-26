"use client";

import { useState, use } from "react";
import { 
  ArrowLeft, 
  Download, 
  Copy, 
  Check, 
  Star, 
  Cpu, 
  BookOpen, 
  ChevronRight, 
  File, 
  Terminal, 
  Sparkles,
  Search,
  Code
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CONTEXT_PACKS, ContextPack } from "@/lib/data";

interface MockFile {
  name: string;
  path: string;
  size: string;
  content: string;
  language: string;
}

// Custom mock files mapping for the 6 slugs
const MOCK_FILES_BY_SLUG: Record<string, MockFile[]> = {
  "nextjs-15-app-router": [
    {
      name: "next.config.ts",
      path: "next.config.ts",
      size: "820 B",
      language: "typescript",
      content: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true, // Enable Partial Prerendering
    dynamicIO: true, // Strict dynamic input-output checks
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;`
    },
    {
      name: "layout.tsx",
      path: "app/layout.tsx",
      size: "1.2 KB",
      language: "tsx",
      content: `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ContextNode client application",
  description: "Built on Next.js 15 App Router",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}`
    },
    {
      name: "page.tsx",
      path: "app/page.tsx",
      size: "940 B",
      language: "tsx",
      content: `import { Suspense } from "react";
import UserProfile from "@/components/UserProfile";

export const experimental_ppr = true;

export default async function HomePage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      
      {/* Dynamic shell resolved at runtime */}
      <Suspense fallback={<div>Loading User Profile...</div>}>
        <UserProfile />
      </Suspense>
    </main>
  );
}`
    },
    {
      name: "actions.ts",
      path: "app/actions.ts",
      size: "1.1 KB",
      language: "typescript",
      content: `"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const FormSchema = z.object({
  id: z.string(),
  status: z.enum(["active", "inactive"]),
});

export async function updateStatus(prevState: any, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid parameters supplied." };
  }

  // Database action...
  revalidatePath("/");
  return { success: true };
}`
    }
  ],
  "tailwind-css-v4-reference": [
    {
      name: "global.css",
      path: "src/global.css",
      size: "540 B",
      language: "css",
      content: `@import "tailwindcss";

@theme {
  --color-brand-cyan: #06b6d4;
  --color-brand-purple: #8b5cf6;
  
  --font-display: "Outfit", sans-serif;
  
  --animate-orbit: orbit 12s linear infinite;
}

@keyframes orbit {
  from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
}`
    },
    {
      name: "index.html",
      path: "public/index.html",
      size: "720 B",
      language: "html",
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="/src/global.css">
  <title>Tailwind CSS v4 Preview</title>
</head>
<body class="bg-black text-white font-display min-h-screen flex items-center justify-center">
  <div class="p-8 border border-white/10 rounded-2xl bg-brand-purple/10 animate-orbit">
    <h1 class="text-3xl text-brand-cyan font-bold">Tailwind v4</h1>
  </div>
</body>
</html>`
    }
  ],
  "prisma-schema-postgres-optimization": [
    {
      name: "schema.prisma",
      path: "prisma/schema.prisma",
      size: "1.4 KB",
      language: "prisma",
      content: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())

  @@index([email]) // Speed up user lookup by email hash
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([authorId, published]) // Compound index for query efficiency
}`
    },
    {
      name: "db.ts",
      path: "src/lib/db.ts",
      size: "480 B",
      language: "typescript",
      content: `import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prevent multiple instances of Prisma Client during hot-reload in dev
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;`
    }
  ],
  "fastapi-pydantic-v2-patterns": [
    {
      name: "main.py",
      path: "app/main.py",
      size: "950 B",
      language: "python",
      content: `from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import UserCreate, UserResponse

app = FastAPI(title="FastAPI Pydantic v2 Core Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate):
    # Simulated db insertion logic
    return {**user.model_dump(), "id": 1, "is_active": True}`
    },
    {
      name: "schemas.py",
      path: "app/schemas.py",
      size: "820 B",
      language: "python",
      content: `from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    id: int
    is_active: bool

    # Pydantic v2 configuration
    model_config = {
        "from_attributes": True
    }`
    }
  ],
  "framer-motion-animation-maps": [
    {
      name: "FadeIn.tsx",
      path: "src/components/FadeIn.tsx",
      size: "880 B",
      language: "tsx",
      content: `"use client";

import { motion } from "framer-motion";

const springPreset = {
  type: "spring",
  stiffness: 260,
  damping: 20
};

export default function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={springPreset}
    >
      {children}
    </motion.div>
  );
}`
    }
  ],
  "langchain-ai-agentic-loops": [
    {
      name: "agent.py",
      path: "app/agent.py",
      size: "1.2 KB",
      language: "python",
      content: `from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.tools import get_system_status

# Initialize system model
llm = ChatOpenAI(model="gpt-4o", temperature=0)

tools = [get_system_status]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a cloud diagnostics agent. Assist users in fixing backend bugs."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

agent = create_openai_tools_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)`
    }
  ]
};

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Gracefully handle Next.js 15+ promise dynamic parameters
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const slug = resolvedParams?.slug;

  const pack = CONTEXT_PACKS.find((p) => p.slug === slug);
  const files = MOCK_FILES_BY_SLUG[slug] || [];

  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCLI, setCopiedCLI] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!pack) {
    return (
      <div className="min-h-screen bg-[#05060A] flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Context Pack Not Found</h1>
        <p className="text-muted-foreground text-sm mb-6">The requested pack might have been removed or renamed.</p>
        <Link href="/context-packs" className="text-xs bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors">
          Back to Asset Registry
        </Link>
      </div>
    );
  }

  const selectedFile = files[selectedFileIndex] || null;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCLI = () => {
    navigator.clipboard.writeText(`npx contextnode clone ${pack.slug}`);
    setCopiedCLI(true);
    setTimeout(() => setCopiedCLI(false), 2000);
  };

  const copyCode = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] pt-8 pb-20 relative">
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <Link 
          href="/context-packs" 
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Registry
        </Link>

        {/* Dynamic Detail Hero Section */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 border-b border-white/5 pb-8 mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/70 rounded-full text-[10px] font-medium uppercase tracking-wider">
                {pack.category}
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-[10px] font-semibold">
                <Star className="w-3 h-3 fill-current" />
                <span>{pack.rating} Rating</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">
              {pack.title}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {pack.description}
            </p>
          </div>

          {/* Quick Stats Panel */}
          <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] border border-white/10 p-5 rounded-2xl lg:min-w-[320px]">
            <div className="flex-1 min-w-[100px]">
              <div className="text-[10px] text-white/40 uppercase font-semibold">Files</div>
              <div className="text-lg font-bold text-white mt-0.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-white/60" />
                {pack.filesCount}
              </div>
            </div>
            <div className="flex-1 min-w-[100px]">
              <div className="text-[10px] text-white/40 uppercase font-semibold">Context Tokens</div>
              <div className="text-lg font-bold text-white mt-0.5 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-white/60" />
                {pack.tokensCount}
              </div>
            </div>
            <div className="w-full h-[1px] bg-white/5 my-1" />
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] text-white/40">Author: {pack.author}</span>
              <span className="text-[10px] text-white/40">{pack.downloads} clones</span>
            </div>
          </div>
        </div>

        {/* Installation and CLI tool */}
        <div className="bg-[#080808] border border-white/10 rounded-xl p-5 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Install via CLI</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Use the ContextNode wrapper tool to dynamically inject this into your local workspace.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-black border border-white/10 rounded-lg p-1.5 w-full md:w-auto md:min-w-[360px] justify-between">
            <span className="font-mono text-[10px] text-white/80 px-2 select-all">npx contextnode clone {pack.slug}</span>
            <button 
              onClick={copyCLI}
              className="p-2 bg-white/5 hover:bg-white/10 rounded text-white transition-colors"
            >
              {copiedCLI ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Files Explorer Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* File sidebar selector */}
          <div className="lg:col-span-4 bg-[#080808] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <File className="w-4 h-4 text-white/60" />
                Package Files
              </h3>
              <span className="text-[10px] text-white/40">{files.length} items</span>
            </div>
            
            <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto pr-1">
              {files.map((file, idx) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={cn(
                    "w-full flex items-center justify-between text-left p-2.5 rounded-lg text-xs transition-all duration-200",
                    selectedFileIndex === idx 
                      ? "bg-white/10 border border-white/10 text-white font-medium" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Code className={cn("w-3.5 h-3.5 flex-shrink-0", selectedFileIndex === idx ? "text-red-400" : "text-white/30")} />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span className="text-[9px] text-white/30 font-mono flex-shrink-0 ml-2">{file.size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Code Viewer Area */}
          <div className="lg:col-span-8 bg-black border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col min-h-[400px]">
            
            {/* Code view header */}
            <div className="flex items-center justify-between bg-[#080808] border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 opacity-65">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <span className="text-[11px] font-mono text-white/60 ml-3 truncate">
                  {selectedFile ? selectedFile.path : "No active file"}
                </span>
              </div>

              {selectedFile && (
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 text-[10px] text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-md transition-colors font-mono"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Code Content */}
            <div className="p-6 flex-1 overflow-x-auto font-mono text-xs leading-relaxed text-white/80 bg-[#020202]">
              {selectedFile ? (
                <pre className="text-[11px] text-neutral-300 font-mono select-text whitespace-pre">
                  <code>{selectedFile.content}</code>
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-20 font-mono">
                  Select a file from the sidebar list to inspect contents.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
