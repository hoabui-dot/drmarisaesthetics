# AI Agent Skills System

A comprehensive AI-assisted development framework for the Dental Clinic Next.js + Strapi CMS project.

## Overview

This folder contains reusable prompts, workflows, and context files that enable AI agents (Claude, Kiro, Copilot, etc.) to understand and work effectively with this codebase.

## Folder Structure

```
.ai/
├── index.md                    # This file - system overview
├── context/                    # Project context and architecture
│   ├── architecture.md         # System architecture overview
│   ├── coding-standards.md     # Coding conventions and patterns
│   ├── strapi-cms.md          # Strapi CMS integration guide
│   └── design-system.md       # UI/UX design guidelines
├── prompts/                    # Reusable prompt templates
│   ├── ui-generation.md       # UI component generation prompts
│   ├── strapi-integration.md  # Strapi API integration prompts
│   ├── seo-optimization.md    # SEO optimization prompts
│   ├── refactoring.md         # Code refactoring prompts
│   └── debugging.md           # Debugging and troubleshooting
└── workflows/                  # Step-by-step agent workflows
    ├── new-page.md            # Creating new CMS-driven pages
    ├── new-component.md       # Creating reusable components
    ├── migration-script.md    # Creating Strapi migration scripts
    ├── testing.md             # Testing and QA workflow
    └── deployment.md          # Deployment and CI/CD workflow
```

## Quick Start

### For AI Agents

1. Read `context/architecture.md` to understand the project structure
2. Review `context/coding-standards.md` for coding conventions
3. Use appropriate prompts from `prompts/` folder for specific tasks
4. Follow workflows from `workflows/` for complex multi-step tasks

### For Developers

1. Reference these files when working with AI assistants
2. Add new prompts and workflows as patterns emerge
3. Keep context files updated as the project evolves

## Key Concepts

### 1. Context Files
Provide AI agents with essential understanding of:
- Project architecture and data flow
- Coding standards and naming conventions
- Technology stack and dependencies
- Design system and UI patterns

### 2. Prompt Templates
Pre-built prompts for common development tasks:
- Component generation with consistent styling
- API integration with Strapi CMS
- SEO optimization for pages
- Code refactoring and optimization

### 3. Workflows
Step-by-step guides for complex operations:
- Creating new CMS-driven pages
- Building reusable components
- Writing migration scripts
- Testing and deployment

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **CMS**: Strapi v5 (headless)
- **Database**: PostgreSQL
- **Deployment**: Docker, Vercel

## Design System

- **Theme**: Blue Sky (dental/medical aesthetic)
- **Primary Color**: Sky blue (#3bafda / sky-500)
- **Typography**: Clean, readable fonts
- **Components**: shadcn/ui based

## Migration Scripts

The project uses migration scripts in `/migration_scripts/` and `/scripts/` folders to manage Strapi CMS content and database structure.

### Key Scripts

| Script | Purpose |
|--------|---------|
| `scripts/001-inspect-strapi-database.js` | Inspect database structure |
| `scripts/002-create-customers-group-component.js` | Create Customers page components |
| `scripts/003-verify-fix-about-us-structure.js` | Verify/fix About Us structure |
| `migration_scripts/024-create-customer-page.js` | Create Customer page data |

### Running Scripts

```bash
# Inspect database structure
node scripts/001-inspect-strapi-database.js

# Create customers group components
node scripts/002-create-customers-group-component.js

# Verify and fix about us page
node scripts/003-verify-fix-about-us-structure.js
```

## Contributing

When adding new AI skills:
1. Use clear, descriptive filenames
2. Include usage examples
3. Reference related context files
4. Test with multiple AI agents

## Usage Instructions

### How to Use This System

1. **For Claude/ChatGPT/Kiro**: Copy the relevant context files and prompts into your conversation
2. **For Copilot**: Reference files using `@workspace` mentions
3. **For Custom Agents**: Load files as system prompts or context

### Example: Creating a New Page

```
1. Read: .ai/context/architecture.md
2. Read: .ai/context/strapi-cms.md
3. Follow: .ai/workflows/new-page.md
4. Use: .ai/prompts/ui-generation.md for components
```

### Example: Strapi Integration

```
1. Read: .ai/context/strapi-cms.md
2. Use: .ai/prompts/strapi-integration.md
3. Follow: .ai/workflows/migration-script.md
```
