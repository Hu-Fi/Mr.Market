# UI Design Patterns

Complete design system documentation for the Mr.Market interface.

---

## Table of Contents
1. [Colors](#colors)
2. [Typography](#typography)
3. [Spacing & Sizing](#spacing--sizing)
4. [Component Patterns](#component-patterns)
5. [Layout Patterns](#layout-patterns)
6. [State Patterns](#state-patterns)
7. [Icons](#icons)
8. [Theme System](#theme-system)
9. [Animation](#animation)
10. [i18n Patterns](#i18n-patterns)
11. [Accessibility](#accessibility)
12. [Utility Classes](#utility-classes)

---

## Colors

### CSS Custom Properties
```css
:root {
  --color-theme-1: #ff3e00;      /* Orange - primary actions */
  --color-theme-2: #4075a6;      /* Blue - secondary accent */
  --color-bg-0: rgb(202, 216, 228);   /* Lightest background */
  --color-bg-1: hsl(209, 36%, 86%);    /* Medium background */
  --color-bg-2: hsl(224, 44%, 95%);    /* Light background */
  --color-text: rgb(51 65 85);   /* Primary text */
}
```

### DaisyUI Semantic Colors

| Color | Text Classes | Background Classes | Border Classes |
|-------|-------------|-------------------|----------------|
| Primary | `text-primary` | `bg-primary` | `border-primary` |
| Secondary | `text-secondary` | `bg-secondary` | `border-secondary` |
| Accent | `text-accent` | `bg-accent` | `border-accent` |
| Neutral | `text-neutral` | `bg-neutral` | `border-neutral` |
| Success | `text-success`, `text-green-500` | `bg-success`, `bg-green-500` | `border-success` |
| Error | `text-error`, `text-red-500` | `bg-error`, `bg-red-500` | `border-error` |
| Warning | `text-warning` | `bg-warning` | `border-warning` |
| Info | `text-info` | `bg-info` | `border-info` |

### Base Colors
| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | `bg-base-100` | `bg-base-100` (theme-controlled) |
| Content | `bg-base-content` | `bg-base-content` (theme-controlled) |
| Borders | `border-base-200`, `border-base-300` | `border-base-300/70` |

### Opacity System
```
text-base-content/60   /* 60% opacity */
text-base-content/70   /* 70% opacity */
text-base-content/80   /* 80% opacity */
border-base-300/70     /* 70% opacity for borders */
```

### Dark Mode Colors
- Backgrounds: `bg-slate-800`, `bg-slate-900`
- Surface: `bg-slate-700`
- Borders: `border-slate-800`, `border-base-300/70`

---

## Typography

### Font Families
```css
--font-body: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
--font-mono: 'Fira Mono', monospace;
```

### Special Display Font
```css
.balance-font {
  font-family: 'Bebas Neue', sans-serif;
}
```

### Font Sizes

| Tailwind Class | Size | Usage |
|----------------|------|-------|
| `text-[10px]` | 10px | Tiny labels, badges |
| `text-xs` | 12px | Small text, captions |
| `text-sm` | 14px | Secondary text |
| `text-base` | 16px | Body text |
| `text-lg` | 18px | Emphasized text |
| `text-xl` | 20px | Subheadings |
| `text-2xl` | 24px | Headings |
| `text-4xl` | 36px | Display text, balances |

### Font Weights
| Class | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text, headings |
| `font-medium` | 500 | Labels, buttons |
| `font-semibold` | 600 | Emphasized text |
| `font-bold` | 700 | Titles, important text |

### Line Heights
- Paragraphs: `leading-normal` (1.5)
- Headings: Default (1.2)

### Text Alignment
- `text-left` - Default
- `text-center` - Centered headings
- `text-right` - Right-aligned values
- `text-nowrap` - Prevent text wrapping

---

## Spacing & Sizing

### Layout Constraints
```css
--column-width: 42rem;       /* Max content width */
--column-margin-top: 4rem;   /* Top margin for columns */
```

### Padding Scale
| Class | Value | Usage |
|-------|-------|-------|
| `p-1` | 0.25rem | Tight spacing |
| `p-2` | 0.5rem | Small padding |
| `p-3` | 0.75rem | Medium padding |
| `p-4` | 1rem | Standard padding |
| `p-6` | 1.5rem | Large padding |
| `p-8` | 2rem | Extra large padding |
| `px-4` | 1rem horizontal | Horizontal padding |
| `py-2` | 0.5rem vertical | Vertical padding |
| `px-10` | 2.5rem horizontal | Wide horizontal padding |

### Gap System
| Class | Value | Usage |
|-------|-------|-------|
| `gap-1` | 0.25rem | Tiny gap |
| `gap-2` | 0.5rem | Small gap |
| `gap-4` | 1rem | Standard gap |
| `gap-6` | 1.5rem | Large gap |

### Space-Y (Vertical Spacing)
| Class | Value | Usage |
|-------|-------|-------|
| `space-y-1` | 0.25rem | Tight vertical stack |
| `space-y-2` | 0.5rem | Small vertical stack |
| `space-y-4` | 1rem | Standard vertical stack |
| `space-y-6` | 1.5rem | Large vertical stack |

### Space-X (Horizontal Spacing)
| Class | Value | Usage |
|-------|-------|-------|
| `space-x-1` | 0.25rem | Tight horizontal |
| `space-x-2` | 0.5rem | Small horizontal |
| `space-x-4` | 1rem | Standard horizontal |

### Border Radius
| Class | Radius | Usage |
|-------|--------|-------|
| `rounded-md` | 0.375rem | Small badges, inputs |
| `rounded-lg` | 0.5rem | Cards |
| `rounded-xl` | 0.75rem | Buttons, containers |
| `rounded-2xl` | 1rem | Large containers |
| `rounded-3xl` | 1.5rem | Extra large |
| `rounded-full` | 9999px | Circular, pills |
| `rounded-box` | DaisyUI default | Standard corners |

---

## Component Patterns

### Buttons

#### Primary Button
```svelte
<button class="btn bg-base-content text-base-100 no-animation rounded-full">
  Label
</button>
```

#### Secondary Button
```svelte
<button class="btn bg-base-100 text-base-content no-animation rounded-full">
  Label
</button>
```

#### Small Button
```svelte
<button class="btn btn-sm bg-base-100 rounded-xl border-base-300">
  Label
</button>
```

#### Button with Loading State
```svelte
<button class="btn btn-sm bg-base-content text-base-100 no-animation rounded-full"
        disabled={loading}>
  {#if loading}
    <span class="loading loading-spinner loading-xs"></span>
  {/if}
  Label
</button>
```

#### Ghost Button
```svelte
<button class="btn btn-ghost btn-xs">Action</button>
```

#### Icon Button
```svelte
<button class="btn btn-circle btn-ghost">
  <svg class="w-5 h-5"><!-- icon --></svg>
</button>
```

---

### Cards

#### Basic Card
```svelte
<div class="flex flex-col rounded-xl border border-base-200 shadow-sm">
  <div class="p-4 space-y-4">
    <!-- content -->
  </div>
</div>
```

#### Clickable Card
```svelte
<div class="flex flex-col rounded-xl border border-base-200 relative shadow-sm">
  <button
    class="flex flex-col bg-base-100 rounded-xl p-4 space-y-4"
    on:click={handleClick}
  >
    <!-- content -->
  </button>
</div>
```

#### Card with Header
```svelte
<div class="rounded-xl border border-base-200 bg-base-100">
  <div class="px-4 py-3 border-b border-base-200">
    <h3 class="font-semibold">Title</h3>
  </div>
  <div class="p-4 space-y-4">
    <!-- content -->
  </div>
</div>
```

---

### Inputs

#### Standard Input
```svelte
<input
  type="text"
  class="input input-bordered rounded-xl w-full"
  placeholder="Enter text..."
/>
```

#### Search Input
```svelte
<div class="join w-full">
  <input class="input input-sm input-bordered join-item rounded-full flex-grow" />
  <button class="btn btn-sm join-item rounded-full bg-base-content text-base-100">
    <svg class="w-4 h-4"><!-- search icon --></svg>
  </button>
</div>
```

#### Number Input (No Arrows)
```svelte
<input
  type="number"
  class="input input-sm bg-slate-100 border-0 rounded-full"
  <!-- arrows removed via global CSS -->
/>
```

#### Amount Input with Label
```svelte
<div class="flex flex-col space-y-1">
  <span class="text-xs text-base-content/70">Label</span>
  <div class="flex items-center space-x-2">
    <span class="text-sm">$</span>
    <input class="input input-ghost text-base font-medium" />
  </div>
</div>
```

---

### Badges

#### Status Badge
```svelte
<span class="badge badge-success text-success-content">Active</span>
<span class="badge badge-error text-error-content">Failed</span>
<span class="badge badge-warning text-warning-content">Pending</span>
```

#### Outline Badge
```svelte
<span class="badge badge-outline badge-neutral">Label</span>
```

#### Custom Badge
```svelte
<span class="text-xs text-green-600 border-green-600 px-2.5 bg-base-100 border rounded-md">
  Custom Badge
</span>
```

#### Ghost Badge (Monospace)
```svelte
<span class="badge badge-ghost font-mono text-xs">BTC-USDT</span>
```

---

### Dropdowns

#### Basic Dropdown
```svelte
<details class="dropdown dropdown-bottom dropdown-end">
  <summary class="btn btn-sm bg-base-100 rounded-xl">
    Trigger
  </summary>
  <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-sm border border-base-200">
    <li><a>Option 1</a></li>
    <li><a>Option 2</a></li>
  </ul>
</details>
```

#### Dropdown with Icon
```svelte
<details class="dropdown dropdown-end">
  <summary class="btn btn-circle btn-ghost">
    <svg class="w-5 h-5"><!-- icon --></svg>
  </summary>
  <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2">
    <!-- options -->
  </ul>
</details>
```

---

### Tooltips
```svelte
<div class="tooltip tooltip-bottom" data-tip="Tooltip text">
  <svg class="w-4 h-4"><!-- info icon --></svg>
</div>
```

---

## Layout Patterns

### Page Layout

#### Standard Page
```svelte
<div class="flex flex-col h-screen">
  <slot />
  <!-- BottomNav included automatically -->
</div>
```

#### Full Height Layout
```svelte
<div class="flex flex-col h-full bg-base-100">
  <!-- header -->
  <main class="flex-1 overflow-y-auto">
    <!-- content -->
  </main>
</div>
```

#### Max Width Container
```svelte
<div class="max-w-7xl mx-auto px-4">
  <!-- content -->
</div>
```

---

### Flexbox Patterns

#### Horizontal Row
```svelte
<div class="flex items-center space-x-2">
  <!-- items -->
</div>
```

#### Space Between
```svelte
<div class="flex justify-between items-center w-full">
  <div>Left</div>
  <div>Right</div>
</div>
```

#### Vertical Column
```svelte
<div class="flex flex-col space-y-4">
  <!-- items -->
</div>
```

#### Center Content
```svelte
<div class="flex items-center justify-center h-full">
  <!-- centered content -->
</div>
```

---

### Grid Patterns

#### Two Column Grid
```svelte
<div class="grid grid-cols-2 gap-2">
  <!-- items -->
</div>
```

#### Four Column Grid
```svelte
<div class="grid grid-cols-4 gap-4">
  <!-- items -->
</div>
```

#### Responsive Grid
```svelte
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- responsive columns -->
</div>
```

---

## State Patterns

### Loading States

#### Spinner
```svelte
<span class="loading loading-spinner loading-xs"></span>
<span class="loading loading-spinner loading-sm"></span>
<span class="loading loading-spinner loading-md"></span>
```

#### Loading Button
```svelte
<button class="btn" disabled>
  <span class="loading loading-spinner"></span>
  Loading...
</button>
```

#### Skeleton Loading
```svelte
<div class="skeleton h-4 w-full"></div>
<div class="skeleton h-32 w-full"></div>
```

---

### Empty States

#### No Result Component
```svelte
<script>
  import NoResult from "$lib/components/common/NoResult.svelte";
</script>

<NoResult message="No items found" />
```

#### Custom Empty State
```svelte
<div class="flex flex-col items-center justify-center mt-40 space-y-4">
  <svg class="w-32 h-32 text-base-content/30"><!-- illustration --></svg>
  <p class="text-base-content/60">No data available</p>
</div>
```

---

### Error States

#### Error Message
```svelte
<div class="text-error text-sm flex items-center space-x-1">
  <svg class="w-4 h-4"><!-- error icon --></svg>
  <span>Error message</span>
</div>
```

#### Error Badge
```svelte
<span class="badge badge-error">Error</span>
```

---

### Validation States

#### Valid Input
```svelte
<div class="text-success text-sm flex items-center space-x-1">
  <svg class="w-4 h-4"><!-- check icon --></svg>
  <span>Valid</span>
</div>
```

#### Invalid Input
```svelte
<div class="text-error text-sm">Invalid input</div>
```

#### Validating
```svelte
<div class="text-success text-sm flex items-center space-x-2">
  <span class="loading loading-spinner loading-xs"></span>
  <span>Validating...</span>
</div>
```

---

## Icons

### Size Standards
| Class | Dimensions | Usage |
|-------|-----------|-------|
| `w-3 h-3` | 12x12px | Tiny inline icons with text |
| `w-4 h-4` | 16x16px | Small icons, badges |
| `w-5 h-5` | 20x20px | Regular icons |
| `w-6 h-6` | 24x24px | Navigation icons |
| `w-8 h-8` | 32x32px | Large icons |
| `w-10 h-10` | 40x40px | Extra large icons |

### Icon Pattern (Heroicons Style)
```svelte
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  class="w-5 h-5"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M12 4.5v15m7.5-7.5h-15"
  />
</svg>
```

### Common Icons

#### Search
```svelte
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>
```

#### Chevron Left (Back)
```svelte
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
</svg>
```

#### Chevron Right
```svelte
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
</svg>
```

#### Check (Success)
```svelte
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
  <path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
</svg>
```

#### X (Close)
```svelte
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
```

#### Information
```svelte
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>
```

#### Clock (Time)
```svelte
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
```

#### Arrow Left/Right (Swap)
```svelte
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
</svg>
```

---

## Theme System

### Theme Store
**Location:** `src/lib/stores/theme.ts`

```typescript
import { writable, derived } from "svelte/store"

export const theme = writable('light')  // 'light' | 'dark'
export const darkTheme = derived(theme, ($theme) => $theme != 'light')
export const showSettingShortcut = writable(false)

export const toggleTheme = () => {
  switch (get(theme)) {
    case 'light': theme.set('dark'); break
    case 'dark': theme.set('light'); break
  }
}
```

### Auto-Detection
```typescript
export const detectSystemDark = () => {
  // System preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.set('dark')
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    theme.set(e.matches ? "dark" : "light")
  })
  // Mixin context
  const mixinContext = getMixinContext()
  if (mixinContext?.appearance === 'dark') {
    theme.set('dark')
  }
}
```

### Usage in Components
```svelte
<script>
  import { theme, darkTheme } from "$lib/stores/theme"
</script>

<svelte:head>
  <body class={$theme} data-theme={$theme} />
</svelte:head>

<div class={$darkTheme ? "bg-slate-800" : "bg-slate-100"}>
  <!-- themed content -->
</div>
```

### Data Attribute
```svelte
<div class="app text-base-content select-none" data-theme={$theme}>
```

---

## Animation

### Loading Animations
```svelte
<span class="loading loading-spinner loading-xs"></span>
<span class="loading loading-spinner loading-sm"></span>
<span class="loading loading-spinner loading-md"></span>
<span class="loading loading-dots loading-lg"></span>
```

### Disable Animation
```svelte
<button class="btn no-animation">No Animation</button>
```

### Custom Transitions
```svelte
<!-- Fade transition -->
<div transition:fade>
<!-- Fly transition -->
<div transition:fly={{ y: -20 }}
<!-- Slide transition -->
<div transition:slide>
```

### Icon Rotation
```svelte
<!-- Rotate -90deg when active -->
<style>
  .rotate-minus-90 {
    transform: rotate(-90deg);
  }
</style>
```

---

## i18n Patterns

### Import
```typescript
import { _ } from "svelte-i18n"
```

### Basic Translation
```svelte
<h1>{$_('title')}</h1>
```

### With Parameters
```svelte
<p>{$_('welcome_message', { values: { name: user.name } })}</p>
```

### Common Keys
```svelte
{$_('spot_trading')}
{$_('market_making')}
{$_('arbitrage')}
{$_('simply_grow')}
{$_('cancel')}
{$_('confirm')}
{$_('loading')}
```

---

## Accessibility

### Semantic HTML
```svelte
<button>        <!-- Actions, not <div> -->
<input>         <!-- Form inputs -->
<label>         <!-- Input labels -->
<nav>           <!-- Navigation sections -->
<main>          <!-- Main content -->
<section>       <!-- Content sections -->
```

### ARIA Attributes
```svelte
<button aria-current="page">Active</button>
<div role="status" aria-live="polite">Status message</div>
<input aria-label="Amount" />
```

### Visually Hidden
```svelte
<span class="visually-hidden">Screen reader only text</span>
```

**CSS:**
```css
.visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: auto;
  margin: 0;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
}
```

### Focus Management
```svelte
<button class="btn focus:outline-none focus:ring-2">
```

---

## Utility Classes

### Hide Scrollbar
```svelte
<div class="no-scrollbar">
  <!-- content -->
</div>
```

### Remove Arrow from Number Input
```css
/* Applied globally in styles.css */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
```

### Text Column (Content Width)
```svelte
<div class="text-column">
  <!-- Constrained to 48rem max width -->
</div>
```

### Select None (Prevent Text Selection)
```svelte
<div class="select-none">
  <!-- not selectable -->
</div>
```

### Cursor Pointer
```svelte
<div class="cursor-pointer">
  <!-- clickable -->
</div>
```

---

## File Locations

| File | Purpose |
|------|---------|
| `src/app.css` | Tailwind + DaisyUI imports |
| `src/routes/styles.css` | CSS variables, global styles |
| `src/lib/stores/theme.ts` | Theme state management |
| `tailwind.config.cjs` | Tailwind configuration |
| `postcss.config.cjs` | PostCSS configuration |

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Svelte | Latest | Component framework |
| SvelteKit | Latest | Full-stack framework |
| Tailwind CSS | v4 | Utility-first CSS |
| DaisyUI | v5 | Component library |
| svelte-i18n | Latest | Internationalization |
| clsx | Latest | Conditional classes |
| Fontsource | - | Font delivery |

---

## Component Examples by Category

### Common Components
- `src/lib/components/common/loading.svelte`
- `src/lib/components/common/NoResult.svelte`
- `src/lib/components/common/TBD.svelte`
- `src/lib/components/common/MixinMenu.svelte`
- `src/lib/components/common/assetIcon.svelte`
- `src/lib/components/common/tradingPairIcon.svelte`
- `src/lib/components/common/exchangeIcon.svelte`
- `src/lib/components/common/web3Address.svelte`

### Navigation
- `src/lib/components/bottomNav/` - Bottom navigation items
- `src/lib/components/topBar/homeBar.svelte`
- `src/lib/components/topBar/marketBar.svelte`

### Growth Components
- `src/lib/components/grow/marketMaking/card.svelte`
- `src/lib/components/grow/marketMaking/hufi/CampaignSmallCard.svelte`
- `src/lib/components/grow/simplyGrow/card.svelte`
- `src/lib/components/grow/autoInvest/card.svelte`

### Dialog Components
- `src/lib/components/dialogs/swap/swapConfirm.svelte`
- `src/lib/components/dialogs/manageOrder/modifyOrder.svelte`
- `src/lib/components/dialogs/orderTypeSelector.svelte`
