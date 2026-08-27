# Strapi V5 JSON Schema Dump in UI Bug

## Critical Bug: Serialized JSON dumped into Text fields
When using `strapi.documents().create(...)` or during legacy data migrations, it was found that technical JSON schema (e.g., `{"hero": {"badge": "About Us", ...}}`) was accidentally saved into pure text fields like `description` or `content` in the `pages` collection.

**The Impact**:
The frontend components (Next.js) incorrectly rendered these JSON strings directly into the UI, resulting in a technical schema dump that broke the user-facing pages.

## The Fix / Pattern

### 1. Data Sanitization (Transformer/Query Layer)
Implemented a `cleanDescription` helper in `queries.ts` and `transformers.ts` to detect and suppress JSON strings.
```typescript
function cleanDescription(desc: string | undefined): string | undefined {
  if (!desc) return undefined;
  if (desc.trim().startsWith("{") || desc.trim().startsWith("[")) {
    try {
      JSON.parse(desc);
      return undefined; // Do NOT render technical JSON dumps
    } catch {
      return desc;
    }
  }
  return desc;
}
```

### 2. Component-Level Robustness
Updated `AboutUsContent.tsx` and `CustomerContent.tsx` to handle technical noise gracefully.
- **Guard Clause**: If `typeof content === 'string'`, it's identified as a schema dump. 
- **Required Sections**: If critical sections (like `hero`) are missing, the component triggers a **Standardized Error UI**.
- **Error UI**: Provides a clean "Content Initialization" message with a **Reload Page** button instead of showing technical schema.

### 3. Cleanup of Default Text
Removed all hardcoded descriptive fallbacks from `queries.ts` (e.g. "Discover why thousands...").
- Default values must be `""` or `0`.
- This forces the UI to either show real CMS content or a clean error state, preventing misleading or stale "ghost" text.
