# Skilldex Web

> The official marketing and documentation website for Skilldex — the package manager for Claude Code skills.

## 🎯 Overview

Skilldex Web is a Next.js-based website that serves as the central hub for the Skilldex ecosystem. It provides:

- **Landing page** showcasing the Skilldex platform and its core benefits
- **Comprehensive documentation** including CLI reference, concepts, and publishing guides
- **Installation instructions** for the Skilldex CLI across multiple platforms
- **Registry preview** and skill discovery interface
- **Educational content** about skill creation, validation, and best practices

This repository hosts the website infrastructure while the CLI tool and registry backend are maintained separately.

## 🚀 What is Skilldex?

Skilldex solves a fundamental problem in the Claude Code ecosystem: **how to package, share, and discover reusable AI agent instruction sets (skills)**.

Think of it like npm, but for AI agent capabilities instead of JavaScript libraries:

- **Skills** are markdown files containing reusable instruction sets that extend what Claude Code can do
- **The CLI** (`skillpm`) provides commands to install, manage, and publish skills
- **The Registry** is a central hub for discovering and publishing vetted skills
- **The Spec** defines what makes a valid, conformant skill

### The Problem Skilldex Solves

1. **No central home** — Skills live scattered across projects with no standard way to share them
2. **No install command** — Sharing a skill means attaching files to messages, no versioning or distribution
3. **No quality signal** — No way to know if a skill follows standards, targets current Claude versions, or is maintained

## 📁 Project Structure

```
skilldex-web/
├── src/
│   ├── app/                          # Next.js application routes
│   │   ├── layout.tsx               # Root layout with navbar and footer
│   │   ├── page.tsx                 # Landing page
│   │   ├── globals.css              # Global styles (Tailwind)
│   │   ├── docs/                    # Documentation pages
│   │   │   ├── layout.tsx           # Docs layout with sidebar
│   │   │   ├── page.tsx             # Docs index
│   │   │   └── [...slug]/page.tsx   # Dynamic doc pages
│   │   └── install/                 # CLI installation page
│   │       └── page.tsx
│   ├── components/
│   │   ├── landing/                 # Landing page sections
│   │   │   ├── Hero.tsx             # Main hero section
│   │   │   ├── ProblemSection.tsx   # Problem statement
│   │   │   ├── HowItWorks.tsx       # 3-step workflow visualization
│   │   │   ├── TerminalDemo.tsx     # Animated terminal demo
│   │   │   ├── RegistryPreview.tsx  # Registry preview
│   │   │   └── InstallStrip.tsx     # Install CTA strip
│   │   ├── docs/                    # Documentation components
│   │   │   ├── DocsSidebar.tsx      # Navigation sidebar
│   │   │   ├── DocsSidebarClient.tsx # Client-side sidebar logic
│   │   │   ├── DocsPager.tsx        # Previous/next page navigation
│   │   │   └── MdxContent.tsx       # MDX content renderer
│   │   ├── install/
│   │   │   └── InstallTabs.tsx      # Platform selection tabs
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # Site navigation
│   │   │   └── Footer.tsx           # Site footer
│   │   └── ui/                      # Reusable UI components
│   │       ├── Badge.tsx            # Badge component
│   │       ├── CodeBlock.tsx        # Syntax-highlighted code
│   │       ├── CopyButton.tsx       # Copy-to-clipboard button
│   │       └── TabSwitcher.tsx      # Tab switcher component
│   ├── content/
│   │   └── docs/                    # MDX documentation files
│   │       ├── cli/                 # CLI command references
│   │       │   ├── install.mdx
│   │       │   ├── list.mdx
│   │       │   ├── publish.mdx
│   │       │   ├── suggest.mdx
│   │       │   ├── uninstall.mdx
│   │       │   └── validate.mdx
│   │       ├── concepts/            # Core concepts
│   │       │   ├── manifest.mdx
│   │       │   ├── quality-scoring.mdx
│   │       │   ├── scopes.mdx
│   │       │   └── skill-format.mdx
│   │       ├── getting-started/     # Onboarding guides
│   │       │   ├── index.mdx
│   │       │   ├── installation.mdx
│   │       │   ├── quick-reference.mdx
│   │       │   └── first-skill.mdx
│   │       └── publishing/          # Publishing guides
│   │           ├── creating-a-skill.mdx
│   │           ├── packaging.mdx
│   │           └── publishing-to-registry.mdx
│   ├── lib/
│   │   └── docs.ts                  # Documentation utilities
│   │       └── Functions for parsing, organizing, and navigating MDX files
│   └── types/
│       ├── docs.ts                  # Type definitions for documentation
│       └── registry.ts              # Type definitions for registry data
├── public/                          # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── next.config.mjs                 # Next.js configuration
└── README.md
```

## 🏗️ Architecture & Technology Stack

### Core Technologies

- **Next.js 14.2** — React framework with app router, SSR, and static generation
- **React 18** — UI library
- **TypeScript** — Static type checking for robust code quality
- **Tailwind CSS 3** — Utility-first styling framework
- **MDX** — Markdown with JSX for rich documentation content

### Key Libraries

- **next-mdx-remote** — Renders MDX content dynamically
- **gray-matter** — Parses YAML frontmatter from MDX files
- **shiki** — Syntax highlighting for code blocks with theme support
- **clsx** — Utility for conditional classNames
- **tailwind-merge** — Merges Tailwind class names intelligently

### Design Decisions

1. **MDX for Documentation** — Allows embedding React components within markdown, enabling interactive docs
2. **Static Site Generation** — Most pages are pre-rendered at build time for optimal performance
3. **File-based Routing** — Documentation structure mirrors filesystem structure for maintainability
4. **Tailwind CSS** — Rapid development with consistent design tokens

## 🎨 Key Features

### 1. Landing Page

- **Hero Section** — Introduces Skilldex and the CLI
- **Problem Statement** — Illustrates what Skilldex solves
- **How It Works** — 3-step workflow with code examples
- **Terminal Demo** — Animated demonstration of CLI usage
- **Registry Preview** — Showcases available skills
- **Call-to-Action** — Guides users to get started

### 2. Documentation Site

- **Sidebar Navigation** — Auto-generated from document frontmatter
- **Multi-section organization**:
  - Getting Started — Onboarding and basic setup
  - Concepts — Core ideas (skill format, quality scoring, scopes)
  - CLI Reference — Complete command documentation
  - Publishing — Guides for creating and publishing skills
- **Page Navigation** — Previous/next page links
- **Rich Content** — Syntax-highlighted code blocks, badges, callouts

### 3. Installation Page

- **Platform Tabs** — macOS, Linux, Windows installation methods
- **Multiple Package Managers** — npm, Homebrew, curl, winget, Scoop
- **Clear Instructions** — Step-by-step setup guides

### 4. UI Components

- **CodeBlock** — Syntax-highlighted code with copy button (using Shiki)
- **CopyButton** — One-click copy-to-clipboard for code
- **TabSwitcher** — Content tabs for comparing options
- **Badge** — Labels for skill tiers (Verified, Community)
- **Responsive Design** — Mobile-first, works across all devices

## 📖 Documentation Structure

All documentation is stored as MDX files in `src/content/docs/` with YAML frontmatter:

```yaml
---
title: "Page Title"
description: "Brief description for metadata"
section: "Section Name" # e.g., "Getting Started", "Concepts", "CLI Reference"
order: 1 # Sort order within section
editUrl?: "github.com/..." # Optional link to edit on GitHub
---
# Content goes here...
```

The documentation system automatically:

- Parses frontmatter and file structure
- Generates navigation trees by section
- Creates page slugs from file paths (`/docs/section/page`)
- Indexes all documents for navigation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anthropics/skilldex
cd skilldex-web

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`

### Building for Production

```bash
# Build the static site
npm run build

# Start production server
npm start
```

### Linting

```bash
npm run lint
```

## 🔧 Development

### Adding Documentation

1. Create a new `.mdx` file in `src/content/docs/` (in the appropriate section folder)
2. Add required frontmatter (title, description, section, order)
3. Write markdown content with optional JSX components
4. The site will automatically detect and route the new page

Example:

```mdx
---
title: "My New Guide"
description: "A guide about something useful"
section: "Getting Started"
order: 5
---

# My New Guide

Here's some content with a [code block](my-file.ts).
```

### Adding Components

1. Create new component in `src/components/` in the appropriate subdirectory
2. Use TypeScript for type safety
3. Style with Tailwind CSS classes
4. Export from component file for use in pages/layouts

### Styling

The project uses Tailwind CSS with custom design tokens defined in `tailwind.config.ts`:

- Color palette (brand, surface, text, terminal colors)
- Typography scales
- Spacing system
- Responsive breakpoints

## 📋 Key Concepts

### Skills

Reusable instruction sets for Claude Code. Each skill is a `SKILL.md` file with YAML frontmatter containing metadata and the instruction content.

### Quality Scoring

A 0-100 format conformance score measuring how well a skill follows the Skilldex spec. Calculated by checking:

- Presence of required frontmatter fields
- Valid semantic versioning
- Resource file integrity
- Markdown validity
- Documentation quality

### Skill Scopes

Three installation contexts:

- **Global** — Available in all Claude Code sessions
- **Shared** — Shared with team members
- **Project** — Checked into repository

### Spec Version

Skills declare which Skilldex specification version they conform to, ensuring forward compatibility.

## 🔗 Related Repositories

- **CLI Tool** — The `skillpm` command-line interface
- **Registry Backend** — The skill registry API and storage
- **Spec Repository** — The formal Skilldex specification

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- **Documentation** — More guides, examples, and tutorials
- **Components** — New UI components for docs or landing
- **Features** — Interactive registry, search functionality
- **Localization** — Support for multiple languages
- **SEO** — Improved metadata and structured data

## 📄 License

MIT License — Skilldex is open source and free to use.

---

**Learn more:** Visit [skilldex.dev](https://skilldex.dev) or read the full documentation for detailed guides and API reference.
