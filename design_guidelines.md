# Design Guidelines for Gamified Biosecurity Quiz Platform

## Design Approach
**Reference-Based Approach** - Drawing inspiration from LeetCode's interface patterns while adapting for agricultural users with a farmer-friendly aesthetic.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light Mode: 120 40% 25% (Forest green for trust/growth)
- Dark Mode: 120 30% 15% (Darker forest green)

**Secondary Colors:**
- Accent: 45 85% 55% (Golden yellow for coins/achievements)
- Success: 140 60% 45% (Bright green for correct answers)
- Error: 0 70% 50% (Red for incorrect answers)
- Background: 40 20% 97% (Warm off-white)

**Earthy Supporting Palette:**
- Browns: 30 25% 35% (Soil brown for secondary elements)
- Sky blue: 210 50% 60% (For level badges)

### B. Typography
- **Primary Font:** Inter (Google Fonts) - Clean, readable
- **Display Font:** Poppins (Google Fonts) - Friendly headers
- **Base Size:** 16px minimum for mobile accessibility
- **Hierarchy:** 
  - Headers: 24px-32px, semi-bold
  - Body: 16px-18px, regular
  - Small text: 14px, medium weight

### C. Layout System
**Tailwind Spacing Units:** Consistent use of 2, 4, 8, 12, 16 units
- Micro spacing: p-2, m-2 (8px)
- Standard spacing: p-4, m-4 (16px) 
- Section spacing: p-8, m-8 (32px)
- Large gaps: gap-12, gap-16 for major sections

### D. Component Library

**Navigation:**
- Bottom tab navigation (mobile-first)
- Tabs: Dashboard, Quizzes, Profile, Leaderboard
- Farm-themed icons (barn, quiz clipboard, profile, trophy)

**Cards & Containers:**
- Rounded corners: rounded-lg (8px)
- Subtle shadows: shadow-md
- Daily challenge card: Prominent hero positioning
- Quiz cards: Clean, touch-friendly with large tap targets

**Interactive Elements:**
- Buttons: Full-width on mobile, minimum 44px height
- Answer options: Large, clearly differentiated buttons
- Progress indicators: Circular progress rings for streaks
- Calendar heat map: Green intensity scale for solved days

**Data Visualization:**
- Chart.js integration with earthy color schemes
- Touch-friendly tooltips and legends
- Progress charts: Line (accuracy), Bar (coins), Pie (topics)

**Gamification Elements:**
- Coin icons: Golden circular badges
- Level badges: Star-based progression (1-3 stars)
- Streak counters: Fire emoji with number display
- Achievement notifications: Slide-in cards with confetti

### E. Mobile-First Responsive Design

**Breakpoints:**
- Mobile: Default (< 768px)
- Tablet: md: (768px+)
- Desktop: lg: (1024px+)

**Layout Patterns:**
- Single column on mobile
- Side-by-side cards on tablet+
- Dashboard: Stacked on mobile, grid on desktop
- Quiz interface: One question per screen
- Calendar: Responsive grid scaling

### F. Farmer-Friendly UX Patterns

**Visual Hierarchy:**
- High contrast ratios (WCAG AA compliant)
- Clear section separation with whitespace
- Icon-heavy interface reducing text dependency
- Status indicators using color + icons (not color alone)

**Interaction Design:**
- Large touch targets (minimum 44px)
- Immediate feedback for all interactions
- Loading states with farm-themed animations
- Error states with helpful, contextual messages

**Content Strategy:**
- Minimal text, maximum visual communication
- Farm animal icons for question categories
- Local language support consideration
- Explanations in simple, practical terms

## Images & Visual Assets

**Farm Animal Icons:**
- Pig, chicken, cow silhouettes for farm type indicators
- Disease prevention symbols (shield, medicine, hygiene)
- Achievement badges with agricultural themes

**No Large Hero Image:** Focus on functional dashboard layout rather than decorative imagery. The daily challenge card serves as the primary visual focal point.

**Background Treatments:**
- Subtle texture overlays suggesting natural materials
- Gradient accents sparingly used for level progression
- Clean, uncluttered backgrounds prioritizing readability

This design system balances LeetCode's proven UX patterns with agricultural user needs, ensuring accessibility while maintaining engaging gamification elements.