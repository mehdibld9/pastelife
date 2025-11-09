# Design Guidelines for paste-life.site

## Design Approach: Minimal Developer Tool

**Selected Approach:** Design System (Developer-focused minimalism)  
**Primary References:** GitHub Gist, Linear, VS Code  
**Key Principle:** Clean, distraction-free code presentation with efficient workflows

---

## Typography System

**Font Stack:**
- **Primary:** JetBrains Mono (monospace) via Google Fonts for code display
- **UI Text:** Inter or System UI stack for interface elements
- **Hierarchy:**
  - Page titles: text-2xl font-semibold
  - Section headings: text-lg font-medium
  - Body text: text-sm font-normal
  - Code content: text-sm font-mono
  - Metadata/labels: text-xs font-medium uppercase tracking-wide

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, and 16 exclusively
- Tight spacing: p-2, gap-2 (form labels, inline elements)
- Standard spacing: p-4, gap-4 (cards, sections)
- Generous spacing: p-8, py-12, py-16 (page containers, major sections)

**Container Strategy:**
- Full-width code blocks with max-w-7xl center constraint
- Forms and creation interface: max-w-3xl centered
- Single-column layout throughout (no multi-column grids)

---

## Core Page Layouts

### Create Paste Page
**Layout:** Centered single-column form (max-w-3xl)
- Header: Logo + minimal nav (h-16, border-b)
- Form container: bg-surface with border, rounded-lg, p-6
- Textarea: Large, prominent (min-h-96), monospace font
- Metadata row: Grid of 4 compact inputs (title, language, expiration, privacy)
- Action buttons: Full-width primary "Create Paste", secondary "Clear"
- Post-creation: Success card with slug, URLs, secret token in copyable code blocks

### View Paste Page
**Layout:** Full-width code presentation
- Minimal header: Logo, paste title (if exists), action buttons (Edit, Delete, Raw, Embed)
- Metadata bar: Created date, expires in, view count, language tag (h-12, border-b, flex items-center justify-between)
- Code display: Full-width, line numbers in gutter, syntax highlighted content
- Footer: Share buttons, embed snippet (collapsible)

### Raw Endpoint
**Layout:** Plain text, no UI chrome - direct code display only

---

## Component Library

### Navigation Bar
- Height: h-16
- Logo/brand: text-xl font-bold
- Right actions: "New Paste" button + optional GitHub link icon
- Sticky positioning for view pages

### Code Display Block
- Border: 1px solid subtle
- Line numbers: w-12 text-right pr-4, non-selectable
- Content area: p-4, horizontal scroll for long lines
- Copy button: Absolute top-right position, appears on hover

### Form Inputs
- Text input: h-10, px-3, border, rounded-md
- Textarea: p-3, rounded-md, font-mono
- Select dropdown: h-10, custom styled arrow icon
- All inputs: Focus ring with 2px offset

### Buttons
**Primary:** Solid fill, px-6, h-10, rounded-md, font-medium  
**Secondary:** Border outline, same dimensions  
**Icon buttons:** w-9 h-9 square, rounded-md, center icon  
**Copy buttons:** Small, text-xs, px-3, h-8

### Cards & Containers
- Standard card: border, rounded-lg, overflow-hidden
- Surface elevation via subtle border only (no shadows)
- Padding: p-6 for cards, p-4 for compact

### Metadata Tags
- Inline badges: px-2, h-6, rounded-full, text-xs, uppercase
- Status indicators: Dot + text pattern (expires in 2h, 142 views)

### Success/Error States
- Success card: border-2, rounded-lg, p-6, contains copyable URLs
- Error messages: Inline, text-sm, appears above relevant field
- 410 expired message: Centered card with clear messaging

### Copy-to-Clipboard Pattern
- Code blocks with copy icon in top-right corner
- Click feedback: Icon changes check mark briefly
- Copyable fields: Secret token, URLs, embed snippet

---

## Interaction Patterns

**Paste Creation Flow:**
1. Large textarea dominates viewport
2. Compact metadata inputs below in horizontal row
3. Instant validation feedback (content required)
4. Success state reveals URLs + token in prominent copyable blocks

**View Paste Flow:**
1. Code immediately visible, full-width
2. Minimal UI chrome (metadata bar only)
3. Action buttons top-right (Edit requires token modal)
4. View count increments silently

**Edit/Delete Flow:**
1. Modal prompt for secret token entry
2. Verify server-side before showing edit interface
3. Edit reuses create form layout with pre-populated data

---

## Accessibility Standards

- All interactive elements: min 44px touch target
- Form inputs: Associated labels with proper for/id
- Code blocks: Proper ARIA labels for screen readers
- Keyboard navigation: Tab order through form, Esc to close modals
- Skip to content link for view pages
- Focus indicators: 2px offset ring on all focusable elements

---

## Special Features UI

**Embed Snippet Display:**
- Collapsible section below code
- Shows `<iframe>` code in copyable block
- Preview thumbnail of embedded view

**Expiration Countdown:**
- Live countdown timer in metadata bar
- Warning state when <1 hour remaining
- Expired state: 410 page with "This paste has expired" message

**Privacy Indicator:**
- Badge in metadata bar (Public/Unlisted/Private)
- Private pastes show lock icon consistently

---

## Images

**No hero images required** - This is a utility tool focused on code presentation. The interface should be immediately functional without marketing imagery.

**Optional branding:** Small logo/wordmark in navigation (SVG, ~32px height)

---

## Animations

**Minimal motion only:**
- Copy button state change (instant icon swap)
- Form validation (subtle shake on error)
- No page transitions, no scroll animations
- Loading states: Simple spinner for server operations