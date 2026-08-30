# Dr. Maris Aesthetics — Editorial Lead Typography Enhancement

## Objective

Improve the typography hierarchy across selected high-value homepage sections by introducing a dedicated **Editorial Lead Statement** style using **Cormorant Garamond**.

The goal is to create a stronger visual bridge between:

```text
large serif headings
↓
supporting medical copy
```

without making the entire page serif-heavy.

Keep the overall typography system premium, clinical, and editorial.

---

# 1. Typography Principle

Use:

```text
H1 / H2:
Cormorant Garamond
large
strong
structured

Editorial Lead Statement:
Cormorant Garamond
smaller
lighter
more expressive
optionally italic

Body Copy:
existing clean sans-serif
```

The Editorial Lead must feel related to the heading, but clearly sit one level below it.

Do not style the lead like another heading.

---

# 2. Editorial Lead Style

Recommended desktop baseline:

```text
font-family:
Cormorant Garamond

font-size:
24–30px

font-weight:
500–600

font-style:
italic where appropriate

line-height:
1.2–1.35

letter-spacing:
approximately -0.01em to 0

color:
#173868
or
#002D72 with reduced visual intensity

max-width:
approximately 560–720px
```

Use regular or medium italic depending on the sentence.

Avoid bold italic unless the design specifically requires stronger emphasis.

---

# 3. Hero Section

Current hierarchy should become:

```text
EYEBROW

H1

EDITORIAL LEAD

BODY COPY

CTA
```

Example:

```text
HOSPITAL-BASED COSMETIC SURGERY · HO CHI MINH CITY
```

remains sans-serif.

Keep:

```text
Plastic Surgery
in Vietnam for
International Patients
```

as the primary H1 using Cormorant Garamond.

Promote this sentence:

```text
Cosmetic surgery is a medical decision
before it is an aesthetic one.
```

into the new Editorial Lead style.

Use approximately:

```text
Cormorant Garamond
26–28px
Medium Italic
line-height 1.25
```

The remaining explanatory text should stay in the existing sans-serif body style.

Do not use the same serif size/weight for both H1 and lead.

---

# 4. Revision Surgery Section

Keep:

```text
Revision Cosmetic Surgery Vietnam
```

as the large display heading.

Promote:

```text
When your first surgery did not go as planned.
```

into an Editorial Lead Statement.

Recommended:

```text
Cormorant Garamond
26–30px
Medium Italic
white / rgba(255,255,255,0.9)
```

The clinical explanation below should remain sans-serif.

This creates:

```text
Display Statement
↓
Emotional / Editorial Lead
↓
Clinical Explanation
```

---

# 5. The Maris Method / Surgeon-Led Care Section

For strong philosophy statements such as:

```text
Every case begins with the surgeon,
not a procedure menu.
```

use the Editorial Lead style.

This content should feel more like a brand principle than normal body copy.

Recommended:

```text
Cormorant Garamond
28–32px
Medium Italic or Medium Roman
```

Do not make it visually compete with the main section title.

---

# 6. Hospital / CIH Section

Keep the main hospital heading large.

Use the Editorial Lead style for a short trust statement such as:

```text
Major cosmetic surgery requires
more than a surgical suite.
```

or the strongest existing supporting sentence.

Recommended:

```text
Cormorant Garamond
24–28px
Medium
```

Avoid italic if the section already contains a legal disclaimer in italic.

The legal disclaimer must remain sans-serif and visually separate.

---

# 7. International Patient Journey

Keep:

```text
From your first inquiry
to confident recovery.
```

as the main display heading if it is already the primary H2.

Do not convert every supporting sentence to serif.

Instead, use the Editorial Lead style selectively for a short supporting statement if needed, for example:

```text
A seamless, medically supervised experience
from first contact to recovery.
```

Use a restrained serif treatment only if it improves hierarchy.

If the section is already visually dense because of GSAP storytelling, keep body text sans-serif.

---

# 8. Patient Results

A statement such as:

```text
Results are individual.
Planning is personal.
```

should use the Editorial Lead style.

Recommended:

```text
Cormorant Garamond
28–34px
Medium Italic
```

This is a strong editorial use case because the sentence communicates philosophy rather than factual detail.

---

# 9. Final Consultation CTA

Use the Editorial Lead style for a short reassurance statement beneath the main CTA heading.

Example:

```text
Your case begins with understanding
your actual condition.
```

Recommended:

```text
Cormorant Garamond
24–28px
Medium Italic
```

Do not use serif inside form labels, inputs, validation, or buttons.

---

# 10. Do Not Apply Editorial Lead Everywhere

Use this style only for important statements that are:

```text
philosophical
emotional
trust-building
positioning-oriented
narrative
```

Do not use it for:

```text
long body paragraphs
technical explanations
lists
form copy
metadata
navigation
legal text
FAQ answers
procedure descriptions
```

The effect depends on rarity.

---

# 11. Typography Hierarchy

Recommended homepage system:

```text
Display XL
Cormorant Garamond
72–96px
SemiBold

H1 / H2
Cormorant Garamond
52–80px
SemiBold

H3
Cormorant Garamond
30–42px
Medium

Editorial Lead
Cormorant Garamond
24–30px
Medium / Medium Italic

Body Large
existing sans-serif
18–20px

Body
existing sans-serif
15.5–17px

Eyebrow / UI / Button / Navigation
existing sans-serif
```

---

# 12. Responsive Behavior

Desktop:

```text
24–30px
```

Tablet:

```text
22–26px
```

Mobile:

```text
20–24px
```

Keep line lengths controlled.

Recommended:

```text
max-width:
approximately 30–38 characters
```

for important editorial statements.

Do not allow large serif lead text to become long full-width paragraphs on mobile.

---

# 13. Spacing

Maintain clear spacing between hierarchy levels.

Recommended:

```text
H1 → Editorial Lead:
24–32px

Editorial Lead → Body:
16–24px

Body → CTA:
24–32px
```

Avoid placing the Editorial Lead directly against the heading with insufficient breathing room.

---

# 14. GSAP Integration

If the section already uses GSAP, animate the Editorial Lead as a separate typography layer.

Recommended:

```text
H1:
masked line reveal

Editorial Lead:
opacity 0 → 1
y 16px → 0

Body:
opacity 0 → 1
y 12px → 0
```

The Editorial Lead should enter after the main heading but before body copy.

Do not animate it character-by-character.

Do not use aggressive SplitText effects on long lead statements.

---

# 15. Final Acceptance Criteria

The implementation is successful when:

```text
[ ] Cormorant Garamond remains the dominant display typeface

[ ] important lead statements also use Cormorant Garamond

[ ] lead statements use a clearly smaller and lighter style than H1/H2

[ ] body copy remains sans-serif for readability

[ ] serif is not overused

[ ] emotional / positioning statements feel more premium

[ ] hierarchy reads clearly:
Heading → Editorial Lead → Body

[ ] mobile typography remains readable

[ ] GSAP animation preserves the hierarchy
```

The intended result should feel:

**luxury editorial typography layered onto a credible medical interface**, not a fully serif fashion website.