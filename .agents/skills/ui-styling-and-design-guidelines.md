---
description: Universal UI styling principles and design constraints for creating clean, restrained, editorial interfaces without generic AI-generated aesthetics.
---

# UI Styling & Design Guidelines

These guidelines establish a consistent approach to frontend interface design, emphasizing clean, restrained, editorial, and professional aesthetics suitable for modern product, SaaS, and enterprise applications.

---

## 1. Visual Philosophy: Restrained, Clean, and Elegant

- **Restrained & Controlled**: Use a limited and intentional visual palette. Avoid excessive colors or visual elements that do not communicate a clear purpose.
- **Functional Color Usage**: Colors should primarily communicate meaning, such as status, feedback, hierarchy, or interaction states. Avoid using bright colors purely for decoration.
- **Typography as a Primary Tool**: Establish hierarchy through typography, spacing, weight, and scale rather than relying heavily on decorative elements.
- **Whitespace Matters**: Use deliberate whitespace to create hierarchy, separation, and visual rhythm. Avoid both cramped layouts and excessive empty space without purpose.
- **Editorial Aesthetic**: Favor layouts that feel structured, calm, precise, and information-focused rather than overly promotional or visually noisy.

---

## 2. Avoid Generic "AI Slop"

The interface should avoid common visual patterns associated with generic AI-generated dashboards or landing pages.

- **No Eyebrow Text (Supertitles / Kickers)**: Do not place tiny, widely spaced, uppercase category labels or tags (e.g. `DESIGN SYSTEM & COMPONENT STANDARDS`, `FEATURED ITEMS`, `HELP & DOCUMENTATION`) directly floating above headings. Headings and section titles must stand strong, clean, and confident on their own without ornamental kicker tags.
- **No Status Indicators with Circular Dots**: Do not use circular colored dots beside text, labels, badges, or headers (e.g. `● LIVE STATUS`, `● ACTIVE ORDER`, `● PREVIEW MODE`). Status labels and badges must be clean text inside restrained rectangular containers—never paired with pseudo-status circular dots.
- **No Glow Effects**: Avoid glowing borders, neon shadows, luminous effects, or excessive focus rings.
- **No Decorative Neon or Gradients**: Do not use highly saturated neon colors, futuristic gradients, or decorative color transitions unless they serve a clear functional purpose.
- **No Excessive Glassmorphism**: Avoid excessive `backdrop-blur`, translucent stacked panels, floating glass surfaces, or blurred decorative backgrounds.
- **No Decorative Blobs**: Avoid floating blobs, abstract gradients, and ornamental background shapes that do not contribute to the product's information hierarchy.
- **No Decorative Side Borders (Single-Edge Accent Bars)**: Strictly avoid single-sided decorative accent borders (e.g. `border-left: 3px solid var(--accent)`, `border-right`, or pseudo-element colored stripes on one edge) on buttons, navigation items, pills, tabs, or cards. On elements with rounded corners (`border-radius`), this creates an unsightly, asymmetric curved sliver. Always use clean surface contrast, typography weight, or a subtle uniform 1px perimeter border instead.
- **Prefer Solid Surfaces**: Components should generally use solid surfaces with clear boundaries, subtle borders, and intentional spacing.

---

## 3. Commercial Reality: Real End-User Focus (Not Hackathons or Tech Showcases)

Products must look and read like mature, production-grade commercial services designed for genuine paying clients or consumers—never like academic prototypes, AI experiments, or hackathon pitch decks.

- **No Technical or ML Bragging**: Never expose internal technical trivia, training datasets, algorithm names, model version tags (e.g. `MODEL AI v1.2`, `TRAINED ON 600+ ROWS`), loss values, or performance metrics ($R^2$, accuracy, F1 score) in consumer-facing UI copy. End-users do not care about the underlying mathematics or architecture; they care about personal relevance and practical outcomes.
- **Focus Exclusively on Real Business Value & Customer Outcomes**: Frame all content, copy, and UI around what the user actually experiences and gains:
  - Clear steps in the transaction or service workflow.
  - Practical prerequisites (what documents or information they need to prepare).
  - Concrete turnaround times, transparent guarantees, and operational procedures.
- **Avoid Unfamiliar Jargon**: Use plain, industry-standard business and consumer language. Do not introduce technical concepts that are uncommon in everyday commerce.
- **Dignified & Honest Tone (Zero Overclaims)**: Professional credibility comes from calm, verifiable operational clarity—not hype, superlative self-praise ("#1 in the industry", "100% best deal guaranteed"), or excessive buzzwords.

---

## 4. Shape Rules: Avoid Excessive Pill-Shaped UI

- **Avoid Pill Shapes**: Buttons, badges, tabs, inputs, cards, and containers should generally not use `rounded-full` or excessive corner rounding.
- **Use Controlled Radius**: Prefer small, consistent corner radii (e.g. 4px - 6px) that create a structured and professional appearance.
- **Maintain Consistency**: The same component type should use the same radius convention throughout the interface.
- **Exceptions**: Fully circular shapes may ONLY be used for:
  - Avatars / user profile photos.
  - Functional circular icon buttons (e.g. carousel arrow controls, close buttons `✕`).
  - Image slider or stepper pagination dots.
  - *Forbidden*: Do NOT use circular indicator dots beside text, labels, or badges.

---

## 5. Layout Consistency & Horizontal Alignment

- **Consistent Horizontal Tracks**: Page content should maintain consistent left and right gutters throughout the interface.
- **Shared Alignment**: Page titles, filters, tables, metrics, content sections, and footers should align to the same underlying horizontal grid whenever they belong to the same layout context.
- **Avoid Arbitrary Indentation**: Do not allow individual sections to randomly extend beyond or inside the primary content track without a deliberate layout reason.
- **Standardized Content Width**: Use a consistent maximum content width or container system across related modules.
- **Stable Spacing Scale**: Use a predictable spacing system rather than arbitrary pixel values. Prefer a small set of reusable spacing tokens to maintain visual rhythm.
- **Responsive Consistency**: Horizontal alignment and spacing should remain intentional across desktop, tablet, and mobile layouts.

### Vertical Economy & Above-the-Fold Actionability (Anti-Scroll Action Widgets)
- **Problem Statement (Forbidden Vertical Bloat)**: Avoid layouts where massive hero headlines, verbose introductory paragraphs, and excessive vertical padding stack above an action widget or form, pushing essential input fields and the submit CTA below the viewport fold and forcing users to scroll down just to begin interacting.
- **Select at Least One of the Following Three Alternative Strategies** (choose the approach that best fits the page's functional context; **you are NOT obligated to apply all three simultaneously**):
  - **Option 1 — Minimalist Header + Contextual Help Icon**:
    - Strip verbose descriptions above the form, as most users already understand the page's intent.
    - If contextual explanation is necessary, provide a subtle question mark (`?`) or info (`i`) icon button that reveals details in an on-demand popover upon click or hover.
    - By streamlining the header, the form fields and submit button immediately rise above the viewport fold.
  - **Option 2 — Split 2-Column Layout (Side-by-Side)**:
    - Partition the viewport into a 2-column grid: the left column houses the title and informative context, while the right column hosts the interactive action widget/form.
    - *Left Column Content Discipline*: Must be substantial and informative—never a bare title paired with a single generic sentence. However, **marketing overclaims are strictly forbidden** (e.g., *"Best service in the nation"*, *"100% guaranteed zero issues"*). Instead, populate the left column with calm, objective facts: evaluated parameters (specifications, plan tiers, usage metrics, attributes), methodology explanations, workflow requirements, or transparent process stages.
    - This architecture keeps the entire right-hand form and primary CTA 100% visible and operable above the fold.
  - **Option 3 — Dedicated Action Subpage (Deferred Action Widget)**:
    - If the introductory educational context genuinely requires extensive vertical real estate, move the action widget to its own dedicated subpage or modal workflow.
    - Reduce the initial landing page to a clean headline, concise brief, and a single prominent CTA button to launch the widget on the target page.
- **Controlled Vertical Spacing**: Constrain vertical padding and section gaps (`gap: 1.5rem` to `2.5rem`, rather than wasteful `4rem` to `6rem`) across all utility, calculator, and transaction-oriented pages.

---

## 6. UI Component Standards

*(Note: Specific color palettes, brand accent colors, and typography font families should be customized per project using project-specific design tokens. The standards below govern component structure, interaction states, and visual discipline.)*

### Button
- **Primary**: Solid primary brand/accent color or subtle restrained gradient aligned with the project's design tokens; controlled crisp corners (radius 4px - 6px).
- **Secondary / Outline**: Restrained neutral surface with a subtle 1px border and high-contrast readable text.
- **No Pill Buttons**: Never use `rounded-full` for standard action buttons.
- **Consistency**: Maintain identical padding, typography scale, and radius across all button variants in the same hierarchy.

### Badge & Status Tag
- **Treatment**: Compact rectangular shapes (3px - 4px radius) with subtle hairline borders.
- **Strictly No Indicator Dots**: Never place a circular dot (`●`, `span.dot`) beside or inside the badge label. Use pure clean typography inside the rectangular badge.
- **No Eyebrow Kickers**: Badges should not be used as ornamental uppercase kickers directly floating above section titles.
- **Styling**: Restrained neutral tones, subtle semantic tints (e.g. muted green for success, muted amber for pending), or monochrome styling with high text legibility.

### Card & Panel
- **Surfaces**: Solid neutral background surfaces with subtle, crisp borders. Avoid glowing borders or colored box shadows.
- **Separation**: Generous, deliberate padding (20px - 32px), clean typographic hierarchy, and structured spacing.

### Filter & Range Controls
- **Sliders & Range Controls**: Thin neutral background track, refined thumb, and subtle primary accent for the active range.
- **Input Fields**: Controlled inset with subtle hairline border, focused with a clear, restrained focus indicator (avoid neon rings or glowing halos).

### Dropdown & Select Menus
- **No Native OS Selects**: Avoid unstyled default browser `<select>` elements that break theme continuity with jarring OS native popups.
- **Custom Stylized Dropdowns**: Use custom dropdown components with solid surface popovers, subtle borders, controlled corner radii (4px - 6px), high-contrast readable typography, and clean indicators for active selections.

### Navigation, Tabs & Active States (Strictly No Decorative Side Borders)
- **Strict Prohibition of Decorative Side Borders**: Never use decorative colored side borders (such as `border-left: 3px solid ...`, `border-right`, or pseudo-element vertical accent bars) to signify an active or selected state on navigation items, sidebar links, tabs, pills, or list items.
- **Why It Fails**: Side borders introduce asymmetric visual clutter and feel accidental. On elements with rounded corners (`border-radius`), the side border follows the corner radius and forms an unsightly, curved colored sliver on one edge.
- **Prescribed Active State Patterns**:
  - **Surface Contrast**: Shift the background to an elevated, restrained neutral tone relative to the base canvas.
  - **Typographic Contrast**: Use higher font weight (`font-weight: 600` or `700`) and high-contrast text color.
  - **Uniform Perimeter Border**: If a border is needed, apply a subtle 1px border uniformly all around the item (`border: 1px solid ...`), never on one side alone.
  - **Active Icon Accent**: Colorize the accompanying icon or label rather than adding an asymmetric edge border.

---

## 7. Motion & Interaction

- **Purposeful Motion**: Animation should communicate state changes, hierarchy, navigation, or spatial relationships.
- **Keep It Subtle**: Prefer short, controlled transitions over exaggerated animations.
- **Avoid Excessive Effects**: Do not use unnecessary bouncing, glowing, pulsing, parallax, or attention-grabbing motion.
- **Respect Hierarchy**: Motion should support the user's understanding of the interface rather than compete with the content.
- **Consistent Timing**: Related interactions should use consistent transition behavior throughout the product.

---

## 8. Responsive Design

- Maintain consistent content alignment and spacing across viewport sizes.
- Preserve the underlying layout hierarchy when transitioning between desktop and mobile.
- Avoid simply shrinking desktop components; adapt layouts intentionally for smaller screens.
- Ensure tables, forms, navigation, and dense information remain usable on mobile.
- Avoid horizontal overflow unless it is necessary for the content.

---

## 9. Accessibility & Usability

- Maintain sufficient contrast between text, surfaces, borders, and interactive states.
- Do not rely on color alone to communicate important information.
- Interactive elements should have clearly distinguishable states.
- Maintain appropriate touch target sizes on mobile.
- Use semantic HTML and accessible interaction patterns where applicable.
- Visual hierarchy should remain understandable without relying on decorative effects.

---

## 10. Design System Consistency

- Reuse established tokens for spacing, typography, radius, borders, and component dimensions.
- Avoid introducing one-off values when an existing design token can be used.
- Similar components should behave and look consistently across the product.
- New components should follow existing visual conventions rather than introducing an unrelated visual language.
- Prefer a small, coherent design vocabulary over a large collection of unique styles.

---

## 11. Verification Before Completion

Before considering a UI implementation complete:

- Test the component in the project's component development environment or Storybook when available.
- Verify the implementation in an actual browser.
- Test both desktop and mobile viewports.
- Check horizontal alignment and ensure consistent left and right gutters.
- Verify spacing, typography, borders, radius, and interaction states.
- Check hover, focus, active, disabled, loading, empty, and error states where applicable.
- Confirm that visual effects are purposeful and do not introduce unnecessary decoration.
- Ensure no decorative side borders (single-sided border-left / border-right accent stripes) are used on active navigation items, tabs, pills, or cards.
- Ensure the final interface maintains a clean, restrained, professional, and editorial visual language.
