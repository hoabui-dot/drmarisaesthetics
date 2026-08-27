# Debugging Prompts

## Overview

Prompts for debugging and troubleshooting issues in the application.

---

## Prompt: Debug API Data Fetching

### When to Use

Troubleshooting issues with Strapi API data not loading correctly.

### Prompt Template

```
Debug API data fetching issue for [PAGE/COMPONENT].

Symptoms: [DESCRIBE_ISSUE]

Debugging steps:

1. **Check API Response**
   Add logging to query function:

   console.log('[QueryName] Fetching with params:', params)
   const response = await apiClient(endpoint, { params })
   console.log('[QueryName] Response:', JSON.stringify(response, null, 2))

2. **Verify Environment Variables**
   console.log('[Debug] STRAPI_URL:', process.env.STRAPI_URL)
   console.log('[Debug] Has API Token:', !!process.env.STRAPI_API_TOKEN)

3. **Check Data Transformation**
   console.log('[Transform] Input:', strapiData)
   const transformed = transformFunction(strapiData)
   console.log('[Transform] Output:', transformed)

4. **Test API Directly**
   curl -X GET "https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?filters[slug][$eq]=page-slug&populate=*" \
     -H "Authorization: Bearer YOUR_TOKEN"

5. **Verify Component Data**
   export function Component({ content, page }) {
       console.log('[Component] content:', content)
       console.log('[Component] page:', page)
       // ...
   }

Common issues:
- Missing populate parameter (nested data not included)
- Wrong filter syntax (Strapi v5 uses different syntax)
- Token permissions (API token doesn't have read access)
- Draft content not published
- JSON parse error in content field
```

---

## Prompt: Debug Rendering Issues

### When to Use

Troubleshooting why a component isn't rendering correctly.

### Prompt Template

```
Debug rendering issue in [COMPONENT].

Symptoms: [DESCRIBE_ISSUE]

Debugging checklist:

1. **Check Props**
   console.log('[v0] Component props:', { content, page })

2. **Verify Conditional Rendering**
   console.log('[v0] hero exists:', !!content?.hero)
   console.log('[v0] sections length:', content?.sections?.length)

3. **Check Data Structure**
   // Ensure data matches expected shape
   console.log('[v0] hero structure:', JSON.stringify(content?.hero, null, 2))

4. **Inspect Array Mapping**
   {items?.map((item, index) => {
       console.log(`[v0] Rendering item ${index}:`, item)
       return <Item key={index} {...item} />
   })}

5. **Check CSS/Tailwind Classes**
   // Verify classes are applied
   <div className="debug-border border-2 border-red-500">
       {/* Content to debug */}
   </div>

6. **Verify Image URLs**
   const imageUrl = getImageUrl(image)
   console.log('[v0] Image URL:', imageUrl)
   // Check if URL is valid and accessible

7. **Client vs Server Component**
   // Ensure 'use client' is present for hooks/interactivity
   // Check if hook is called before early return

Common issues:
- Missing 'use client' directive
- Hook called after conditional return
- Undefined data causing blank render
- CSS not applied (wrong class names)
- Image 404 (wrong STRAPI_URL)
```

---

## Prompt: Debug Animation Issues

### When to Use

Troubleshooting Framer Motion animation problems.

### Prompt Template

```
Debug animation issue in [COMPONENT].

Symptoms: [DESCRIBE_ISSUE - not animating, stuttering, infinite loop, etc.]

Debugging steps:

1. **Check Animation Variants**
   const fadeInUp = {
       hidden: { opacity: 0, y: 60 },
       visible: {
           opacity: 1,
           y: 0,
           transition: { duration: 0.6 }
       }
   }
   // Ensure 'transition' is inside 'visible', not at root

2. **Verify Initial/Animate/Variants Setup**
   <motion.div
       initial="hidden"        // Must match variant key
       whileInView="visible"   // Must match variant key
       variants={fadeInUp}     // Must contain both keys
   >

3. **Check Viewport Settings**
   viewport={{
       once: true,           // Animation fires once
       margin: "-100px"      // Trigger 100px before entering
   }}
   // Remove 'once' to test repeated animations

4. **Debug Stagger Container**
   // Parent must have staggerContainer variants
   // Children must have their own variants
   <motion.div variants={staggerContainer}>
       <motion.div variants={fadeInUp}>Child 1</motion.div>
       <motion.div variants={fadeInUp}>Child 2</motion.div>
   </motion.div>

5. **Check for Conflicting Styles**
   // CSS transitions can conflict with Framer Motion
   // Remove transition-* classes when using motion

6. **Verify Component Re-renders**
   // Unnecessary re-renders can restart animations
   // Use useCallback/useMemo to stabilize props

Common issues:
- Variant names mismatch (hidden/visible vs initial/animate)
- Missing 'once: true' causing repeated animations
- CSS transitions conflicting with motion
- Parent missing staggerContainer variants
- Infinite re-renders restarting animation
```

---

## Prompt: Debug Build/Deploy Errors

### When to Use

Troubleshooting errors during build or deployment.

### Prompt Template

```
Debug build/deploy error.

Error message: [ERROR_MESSAGE]

Common build errors and fixes:

1. **Type Errors**
   Error: Type 'X' is not assignable to type 'Y'

   Fix: Check type definitions, add proper typing
   const data: ContentType = response  // Add explicit type

2. **Missing Dependencies**
   Error: Module not found: Can't resolve 'package-name'

   Fix: npm install package-name

3. **Import Errors**
   Error: Cannot find module '@/src/...'

   Fix: Check tsconfig.json paths alias
   {
       "paths": {
           "@/*": ["./*"]
       }
   }

4. **Server/Client Component Mismatch**
   Error: You're importing a component that needs useState

   Fix: Add 'use client' to component using hooks

5. **Dynamic Route Errors**
   Error: generateStaticParams must return an array

   Fix: Ensure function returns array, even if empty
   export async function generateStaticParams() {
       const slugs = await getAllSlugs()
       return slugs.map(slug => ({ slug }))
   }

6. **Environment Variable Errors**
   Error: NEXT_PUBLIC_* is undefined

   Fix:
   - Ensure .env.local exists
   - Use NEXT_PUBLIC_ prefix for client-side vars
   - Restart dev server after adding env vars

7. **Image Optimization Errors**
   Error: Invalid src prop on next/image

   Fix: Add domain to next.config.ts
   images: {
       remotePatterns: [
           { protocol: 'https', hostname: 'your-strapi-url.com' }
       ]
   }
```

---

## Prompt: Debug Hydration Errors

### When to Use

Troubleshooting React hydration mismatches.

### Prompt Template

```
Debug hydration mismatch error.

Error: Text content does not match server-rendered HTML
Error: Hydration failed because the initial UI does not match

Common causes and fixes:

1. **Date/Time Rendering**
   // Problem: Server and client have different timezones
   // Fix: Format dates consistently or use suppressHydrationWarning
   <time dateTime={date} suppressHydrationWarning>
       {formatDate(date)}
   </time>

2. **Browser-Only APIs**
   // Problem: Using window/document during SSR
   // Fix: Check for client-side
   const [mounted, setMounted] = useState(false)
   useEffect(() => setMounted(true), [])
   if (!mounted) return null

3. **Random Values**
   // Problem: Math.random() gives different values
   // Fix: Use deterministic values or client-only rendering
   const id = useMemo(() => Math.random(), [])  // Stable after mount

4. **Dynamic Content Based on Viewport**
   // Problem: Server doesn't know screen size
   // Fix: Use CSS for responsive, not JS
   // Or render placeholder on server

5. **Third-Party Scripts**
   // Problem: Scripts modify DOM after hydration
   // Fix: Load scripts after hydration
   useEffect(() => {
       const script = document.createElement('script')
       // ...
   }, [])

6. **Incorrect HTML Nesting**
   // Problem: Invalid HTML like <p><div>
   // Fix: Use valid HTML structure
   <div><p>...</p></div>  // Correct
   // <p><div>...</div></p>  // Wrong

Debug technique:
- Add console.log on both server and client
- Compare rendered output
- Use React DevTools to inspect component tree
```
