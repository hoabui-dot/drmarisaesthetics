# Workflow: Testing and Quality Assurance

## Overview

Step-by-step guide for testing pages and components before deployment.

---

## Step 1: Component Testing

### 1.1 Visual Inspection

```
For each component, verify:
- [ ] Renders correctly with all prop variations
- [ ] Hover states work as expected
- [ ] Animation triggers properly
- [ ] Icons display correctly
- [ ] Text is readable and properly styled
```

### 1.2 Responsive Testing

```
Test at each breakpoint:
- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)

Check for:
- [ ] Layout doesn't break
- [ ] Text remains readable
- [ ] Images scale properly
- [ ] Touch targets are adequate size on mobile
```

### 1.3 Animation Testing

```
Verify animations:
- [ ] Initial state is hidden (opacity 0, transform applied)
- [ ] Animation triggers on scroll into view
- [ ] Animation only plays once (if using once: true)
- [ ] Stagger timing looks natural
- [ ] No janky or stuttering animations
- [ ] Hover animations are smooth
```

---

## Step 2: Page Testing

### 2.1 Content Verification

```
For each page section:
- [ ] All CMS content renders
- [ ] No undefined/null showing as text
- [ ] Fallback content displays when data missing
- [ ] Links are correct and functional
- [ ] Images load (no 404s)
```

### 2.2 SEO Verification

```
Check meta tags in browser DevTools:
- [ ] Title tag is correct
- [ ] Meta description is present
- [ ] OpenGraph tags present
- [ ] Twitter card tags present
- [ ] Canonical URL is correct

View page source for:
- [ ] Proper heading hierarchy (H1 > H2 > H3)
- [ ] Alt text on images
- [ ] Semantic HTML elements
```

### 2.3 Performance Testing

```
Using Chrome DevTools Lighthouse:
- [ ] Performance score > 90
- [ ] No layout shifts (CLS < 0.1)
- [ ] Images properly sized
- [ ] No render-blocking resources

Check Network tab:
- [ ] API calls complete successfully
- [ ] No failed requests
- [ ] Images optimized
```

---

## Step 3: API Integration Testing

### 3.1 Direct API Testing

```bash
# Test page fetch
curl -X GET \
  "https://guild-biblical-expectations-easily.trycloudflare.com/api/pages?filters[slug][$eq]=customers&populate=*" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq

# Expected: Response with page data
```

### 3.2 Frontend Data Verification

```tsx
// Add temporary logging
console.log("[v0] Page data:", page);
console.log("[v0] Content:", parsedContent);
console.log("[v0] Hero section:", parsedContent?.hero);
```

### 3.3 Error Handling Testing

```
Test error scenarios:
- [ ] API unavailable - graceful fallback
- [ ] Page not found - 404 page displays
- [ ] Invalid JSON content - error handled
- [ ] Missing required fields - fallback values used
```

---

## Step 4: Draft Mode Testing

### 4.1 Enable Draft Mode

```
Navigate to:
/api/preview?slug=page-slug&secret=YOUR_SECRET

Verify:
- [ ] Preview banner displays
- [ ] Unpublished content shows
- [ ] Can exit preview mode
```

### 4.2 Exit Draft Mode

```
Navigate to:
/api/exit-preview

Verify:
- [ ] Preview banner gone
- [ ] Only published content shows
```

---

## Step 5: Cross-Browser Testing

### 5.1 Browser Checklist

```
Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

On each browser check:
- [ ] Layout renders correctly
- [ ] Animations work
- [ ] Forms submit properly
- [ ] No console errors
```

### 5.2 Known Browser Issues

```
Watch for:
- Safari: CSS gap not supported in older versions
- Firefox: Different font rendering
- Safari: backdrop-filter may need prefix
```

---

## Step 6: Accessibility Testing

### 6.1 Keyboard Navigation

```
Test without mouse:
- [ ] Tab through all interactive elements
- [ ] Focus states visible
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/dropdowns
- [ ] Skip link works (if present)
```

### 6.2 Screen Reader Testing

```
Use VoiceOver (Mac) or NVDA (Windows):
- [ ] All images have alt text
- [ ] Headings announced correctly
- [ ] Links describe destination
- [ ] Form labels read properly
- [ ] Button text is meaningful
```

### 6.3 Accessibility Checklist

```
Verify:
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] No content conveyed only by color
- [ ] Focus indicators visible
- [ ] Touch targets at least 44x44px
- [ ] Motion can be reduced (prefers-reduced-motion)
```

---

## Step 7: Form Testing

### 7.1 Validation Testing

```
For each form:
- [ ] Required fields show error when empty
- [ ] Email validation works
- [ ] Phone validation works (if applicable)
- [ ] Error messages are clear
- [ ] Focus moves to first error field
```

### 7.2 Submission Testing

```
Test form submission:
- [ ] Loading state shows during submit
- [ ] Success message displays
- [ ] Form resets after success
- [ ] Error handling for failed submit
```

---

## Testing Checklist Template

```markdown
## Page: [PAGE_NAME]

Date: [DATE]
Tester: [NAME]

### Content

- [ ] All sections render
- [ ] Images load correctly
- [ ] Links work
- [ ] No console errors

### Responsive

- [ ] Mobile layout
- [ ] Tablet layout
- [ ] Desktop layout

### Animations

- [ ] Scroll animations
- [ ] Hover effects
- [ ] No performance issues

### SEO

- [ ] Title tag
- [ ] Meta description
- [ ] OG tags
- [ ] Heading hierarchy

### Accessibility

- [ ] Keyboard navigation
- [ ] Alt text on images
- [ ] Focus states
- [ ] Color contrast

### Performance

- [ ] Lighthouse score > 90
- [ ] No layout shifts
- [ ] Fast load time

### Notes

[Any issues found or observations]
```

---

## Common Issues and Fixes

### Image Not Loading

```
Check:
1. STRAPI_URL environment variable set
2. Image path is correct
3. next.config.ts has domain whitelisted
```

### Animation Not Playing

```
Check:
1. viewport={{ once: true }} is present
2. Variant names match (hidden/visible)
3. Parent has staggerContainer if using stagger
```

### Content Not Rendering

```
Check:
1. API returns data (check Network tab)
2. JSON parsing succeeds
3. Conditional rendering logic correct
4. TypeScript types match data shape
```

### Hydration Mismatch

```
Check:
1. No browser-only code in SSR
2. Consistent date/time formatting
3. No random values during render
4. Valid HTML nesting
```
