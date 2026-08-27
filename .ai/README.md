# AI Knowledge Base

## 📚 Overview

This directory contains the **complete system knowledge base** for AI agents working on this codebase. All documentation here is designed to provide AI agents with comprehensive understanding of the system architecture, patterns, and rules.

---

## 🎯 Purpose

**For AI Agents:**
- Understand system architecture before making changes
- Follow established patterns and conventions
- Avoid introducing bugs or regressions
- Maintain code quality and consistency

**For Developers:**
- Onboarding reference
- Architecture documentation
- Development guidelines
- System overview

---

## 📁 Documentation Structure

### Core Documentation

**1. SYSTEM.md** - System Overview
- High-level overview
- Tech stack
- Key features
- System responsibilities
- Design principles
- Project structure

**2. ARCHITECTURE.md** - Architecture Details
- System architecture
- Next.js role and structure
- Strapi role and structure
- Separation of concerns
- API contracts
- Deployment architecture
- Security architecture
- Performance architecture

**3. DATA_FLOW.md** - Data Flow & API
- Complete data flow diagrams
- Preview flow
- Publish & revalidation flow
- Data transformation
- API client layer
- Authentication flow
- Cache strategy
- Error handling

**4. FRONTEND_GUIDE.md** - Frontend Development
- Folder structure
- Component system
- Block system
- Design system
- Data fetching
- Preview mode
- Cache management
- Routing
- Environment variables
- Development workflow
- Build & deployment
- Debugging
- Best practices

**5. CMS_GUIDE.md** - CMS Usage
- Strapi structure
- Content management workflow
- Block types
- Draft & Publish workflow
- Preview system
- Publishing & going live
- Media management
- User roles & permissions
- Configuration
- Troubleshooting
- Content best practices

**6. AI_RULES.md** - AI Execution Rules ⚠️ CRITICAL
- Mandatory statement requirement
- Context loading rules
- No assumptions policy
- Consistency requirements
- Enterprise standards
- Validation requirements
- Strapi v5 compatibility
- Component patterns
- File organization
- Error handling
- Documentation requirements
- Testing mindset
- Breaking changes policy
- Execution checklist
- Quality standards

---

## ⚠️ CRITICAL: AI Agent Requirements

### Before ANY Action

**AI agents MUST:**

1. **Read ALL files in this directory** (`.ai/`)
2. **Understand the system completely**
3. **State the mandatory confirmation:**
   ```
   "I have fully understood the system through the provided documentation."
   ```

### This Statement MUST:
- Be written in English
- Appear BEFORE any action or response
- Confirm all documentation has been read
- Indicate understanding of system architecture

**If this statement is missing, the AI has NOT followed the rules.**

---

## 📖 Reading Order

### For First-Time Understanding

**Recommended reading order:**

1. **SYSTEM.md** (15 min)
   - Get high-level overview
   - Understand tech stack
   - Learn key features

2. **ARCHITECTURE.md** (20 min)
   - Understand system architecture
   - Learn separation of concerns
   - Study deployment architecture

3. **DATA_FLOW.md** (20 min)
   - Understand data flow
   - Learn preview flow
   - Study revalidation flow

4. **FRONTEND_GUIDE.md** (30 min)
   - Learn frontend structure
   - Understand component system
   - Study development patterns

5. **CMS_GUIDE.md** (20 min)
   - Understand CMS structure
   - Learn content workflow
   - Study editor experience

6. **AI_RULES.md** (20 min) ⚠️ CRITICAL
   - Learn mandatory rules
   - Understand requirements
   - Study quality standards

**Total time: ~2 hours for complete understanding**

### For Quick Reference

**When working on specific tasks:**

- **Adding new component** → FRONTEND_GUIDE.md (Component System)
- **Modifying data fetching** → DATA_FLOW.md + FRONTEND_GUIDE.md (Data Fetching)
- **Fixing preview mode** → DATA_FLOW.md (Preview Flow)
- **Updating cache logic** → DATA_FLOW.md (Cache Strategy)
- **Adding new block** → FRONTEND_GUIDE.md (Block System)
- **CMS configuration** → CMS_GUIDE.md (Configuration)
- **Understanding architecture** → ARCHITECTURE.md
- **Following rules** → AI_RULES.md ⚠️ ALWAYS

---

## 🎯 Key Concepts

### System Architecture

```
User → Next.js (Frontend) → Strapi API (Backend) → PostgreSQL (Database)
```

**Decoupled Architecture:**
- Frontend and backend are separate
- Communication via REST API
- Independent deployment
- Clear separation of concerns

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4

**Backend:**
- Strapi v5
- PostgreSQL
- TypeScript

### Key Features

1. **Dynamic Page Builder** - Block-based layout system
2. **Draft & Publish** - Content lifecycle management
3. **Preview Mode** - Preview draft content before publishing
4. **On-Demand Revalidation** - Webhook-based cache invalidation
5. **Performance Optimization** - Static generation + ISR
6. **SEO Optimization** - Dynamic metadata generation

---

## 🔄 Data Flow Summary

### Published Content Flow

```
User Request → Next.js → Check Cache → (Miss) → Fetch from Strapi (status=published) → Transform → Cache → Render
```

### Preview Flow

```
Editor → Preview Button → Next.js Preview API → Enable Draft Mode → Fetch from Strapi (status=draft) → Render with Banner
```

### Revalidation Flow

```
Editor Publishes → Strapi Webhook → Next.js Revalidate API → Clear Cache → Next Request Fetches Fresh Data
```

---

## 🎨 Component Architecture

### Component Hierarchy

```
RootLayout (Server)
  │
  ├─► Homepage (Server)
  │
  └─► Dynamic Page (Server)
        ├─► Preview Banner (Client)
        └─► Block Renderer (Server)
              ├─► Hero Block (Server)
              ├─► Services Block (Server)
              └─► CTA Block (Server)
```

### Component Types

**Server Components (Default):**
- Render on server
- Can fetch data
- No JavaScript to client
- Better performance

**Client Components (Opt-in):**
- Render on client
- Can use React hooks
- Handle interactions
- Use `'use client'` directive

---

## 🔐 Security Model

### Authentication Layers

1. **API Token** - Full access for Next.js
2. **Preview Secret** - Enables preview mode
3. **Webhook Secret** - Validates revalidation webhooks
4. **Admin Credentials** - Strapi admin access

### Security Principles

- Secrets in environment variables
- Token validation on all protected routes
- Draft content not publicly accessible
- Webhook requests validated

---

## 📊 Cache Strategy

### Cache Behavior

**Published Content:**
```typescript
cache: 'force-cache'
next: { tags: ['pages', 'page'], revalidate: false }
```

**Draft Content:**
```typescript
cache: 'no-store'
next: undefined
```

### Cache Invalidation

**Webhook triggers:**
- `revalidateTag('pages')` - All page queries
- `revalidateTag('page')` - Single page queries
- `revalidatePath('/')` - Homepage
- `revalidatePath('/{slug}')` - Specific page

---

## 🚨 Critical Rules Summary

### The 12 Mandatory Rules

1. **Context Loading** - Read all docs first
2. **No Assumptions** - Always verify
3. **Consistency** - Follow patterns
4. **Enterprise Standards** - Quality code
5. **Validation First** - Test flows
6. **Strapi v5 Compatibility** - Use correct syntax
7. **Component Patterns** - Server by default
8. **File Organization** - Follow structure
9. **Error Handling** - Always handle errors
10. **Documentation** - Comment and update
11. **Testing Mindset** - Verify before done
12. **Breaking Changes** - Never without migration

### Strapi v5 Critical Change

**ALWAYS use:**
```typescript
status=draft          // For draft content
status=published      // For published content
```

**NEVER use (deprecated):**
```typescript
publicationState=preview  // Strapi v4 syntax
publicationState=live     // Strapi v4 syntax
```

---

## ✅ Quality Standards

### Every Change MUST:

- ✅ Compile without errors
- ✅ Be type-safe (TypeScript)
- ✅ Follow existing patterns
- ✅ Have error handling
- ✅ Have proper logging
- ✅ Be well-documented
- ✅ Be maintainable
- ✅ Be performant
- ✅ Be secure
- ✅ Be tested

---

## 📚 Additional Resources

### Project Documentation

- `README.md` - Project overview
- `CONTENT_LIFECYCLE_AUDIT.md` - System audit
- `STRAPI_V5_DRAFT_FIX.md` - Draft mode fix
- `ON_DEMAND_REVALIDATION_GUIDE.md` - Revalidation guide
- `PRODUCTION_DEPLOYMENT_CHECKLIST.md` - Deployment guide

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi Documentation](https://docs.strapi.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🎓 For Developers

### Onboarding Checklist

- [ ] Read SYSTEM.md
- [ ] Read ARCHITECTURE.md
- [ ] Read DATA_FLOW.md
- [ ] Read FRONTEND_GUIDE.md
- [ ] Read CMS_GUIDE.md
- [ ] Set up development environment
- [ ] Run project locally
- [ ] Create test page in Strapi
- [ ] Test preview mode
- [ ] Test publish flow
- [ ] Review existing code

### Development Workflow

1. Read relevant documentation
2. Understand existing patterns
3. Plan your changes
4. Implement following patterns
5. Test thoroughly
6. Update documentation if needed
7. Commit with clear message

---

## 🤖 For AI Agents

### Execution Workflow

1. **Read all `.ai/` documentation**
2. **State mandatory confirmation**
3. **Understand the task**
4. **Identify affected files**
5. **Check existing patterns**
6. **Plan the approach**
7. **Implement following rules**
8. **Test thoroughly**
9. **Update documentation**
10. **Verify quality standards**

### Success Criteria

**Your work is successful when:**
- ✅ Follows all 12 mandatory rules
- ✅ Matches existing patterns
- ✅ Compiles without errors
- ✅ Passes manual testing
- ✅ No regressions introduced
- ✅ Documentation updated
- ✅ Production-ready quality

---

## 📞 Support

### If Documentation is Unclear

**For AI Agents:**
- Re-read relevant sections
- Check related documentation
- Verify against actual code
- Ask for clarification if needed

**For Developers:**
- Check project README
- Review code comments
- Check Git history
- Ask team members

---

## 🔄 Keeping Documentation Updated

### When to Update

**Update documentation when:**
- Architecture changes
- New patterns introduced
- Breaking changes made
- New features added
- Rules change

### How to Update

1. Identify affected documentation
2. Update relevant sections
3. Maintain consistency
4. Review for accuracy
5. Commit with clear message

---

## ✅ Documentation Status

**Current Version**: 1.0.0  
**Last Updated**: March 19, 2026  
**Status**: Complete and Production-Ready  
**Confidence Level**: 95%

### Coverage

- ✅ System overview
- ✅ Architecture details
- ✅ Data flow diagrams
- ✅ Frontend guide
- ✅ CMS guide
- ✅ AI execution rules
- ✅ Best practices
- ✅ Quality standards

---

**This knowledge base ensures consistent, high-quality work on this codebase. Follow the rules, understand the system, and maintain the standards.**
