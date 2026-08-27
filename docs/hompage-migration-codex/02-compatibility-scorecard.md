# 02 — Compatibility Scorecard

The scores below are engineering estimates based on repository inspection and the target Figma spec. They are not runtime benchmark results.

| Area | Compatibility | Decision |
|---|---:|---|
| Next.js / React / TS stack | 95% | Keep |
| Tailwind styling approach | 90% | Keep, remap tokens |
| Strapi v5 dynamic-zone architecture | 85% | Keep, add missing blocks |
| Homepage server data flow | 90% | Keep |
| Media handling via Next Image | 90% | Keep |
| Existing carousel infrastructure | 90% | Keep selectively |
| Booking business flow | 85% | Reuse in embedded consultation |
| Existing homepage content model | 65% | Extend/add semantic blocks |
| Header behavior | 80% | Keep behavior, simplify visuals |
| Footer behavior/data | 70% | Reuse, major visual rewrite |
| Hero data model | 75% | Extend a few fields |
| Hero visual implementation | 35% | Rewrite |
| Services data model | 80% | Align schema drift |
| Services visual implementation | 35% | Rewrite |
| Proof/trust target | 45% | New proof-showcase block |
| Technology target | 10% | New block |
| Equipment target | 10% | New block |
| Doctors data model | 85% | Keep |
| Doctors visual implementation | 40% | Rewrite |
| Certification data model | 85% | Keep |
| Certification visual implementation | 40% | Rewrite |
| Results mechanics | 80% | Reuse slider logic |
| Testimonials + press model | 35% | New social-proof block |
| Articles data model | 85% | Keep |
| Articles visual implementation | 50% | Rewrite |
| Consultation target | 50% | New block + reuse form logic |
| Current theme/token match | 40% | Migrate |
| Current motion style match | 45% | Simplify significantly |
| Responsive foundation | 70% | Keep breakpoints, change layouts |

## Overall conclusion

**The project does not need a frontend rewrite.**

The highest-value path is:

```text
Preserve architecture
→ normalize design tokens
→ extend CMS where semantically missing
→ rewrite section presentation
→ seed/reorder homepage
→ visual + responsive + performance verification
```

## What would be wasteful

- rebuilding the homepage outside Strapi;
- replacing Tailwind;
- adding a second carousel library;
- adding another animation library;
- adding a new form stack;
- using Three.js just because it already exists;
- hard-coding screenshot text inside components;
- deleting legacy blocks before the new homepage is proven.
