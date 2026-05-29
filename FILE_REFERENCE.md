# SlideStudio File Reference

## Quick File Guide

### 📄 Root Configuration Files

| File | Purpose | Key Contents |
|------|---------|--------------|
| `package.json` | NPM dependencies & scripts | React, Vite, Tailwind, PostCSS |
| `vite.config.js` | Vite build configuration | React plugin, dev server port |
| `tailwind.config.js` | Tailwind CSS settings | Color tokens, font families, custom theme |
| `postcss.config.js` | PostCSS plugins | Tailwind, Autoprefixer |
| `index.html` | HTML entry point | Minimal template with root div |
| `.gitignore` | Git exclusions | node_modules, dist, .vscode |

### 📝 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Original project README | Everyone |
| `REFACTOR_SUMMARY.md` | Quick refactor overview | Quick reference |
| `REFACTOR_NOTES.md` | Detailed migration guide | Technical deep-dive |
| `ARCHITECTURE.md` | System design & structure | Developers/Maintainers |
| `FILE_REFERENCE.md` | This file | Navigation |

---

## Source Files (`src/`)

### 🎯 Main Application

```
src/
├── index.jsx          React entry point - mounts App to DOM
├── App.jsx            Main component - state, logic, layout
└── styles.css         Consolidated styles (Tailwind + custom)
```

#### `src/index.jsx` (10 lines)
**Purpose:** React application entry point  
**Imports:** React, ReactDOM, App, styles.css  
**Exports:** Mounts App to #root element  
**Key:** This is where React takes over from HTML

#### `src/App.jsx` (519 lines)
**Purpose:** Main application component  
**State Variables:** 18 useState hooks + 4 useRef hooks  
**Key Functions:**
- `handleUpload()` - Process file uploads
- `handleShuffle()` - Randomize photo order
- `handleDelete(index)` - Remove photo
- `handleMove(index, direction)` - Reorder photos
- `handleDragStart/Over/End()` - Drag & drop logic
- `handleExport()` - Export canvas to PNG
- Layout: Workspace (left) + Sidebar (right)

**Refs Used:**
- `gridRef` - Masonry grid container
- `masonryInstance` - Masonry.js instance
- `captureAreaRef` - Canvas area to export
- `workspaceRef` - Workspace for responsive scaling

**Effects:**
1. Initialize external libraries (useLibraries hook)
2. Update Masonry grid on photos/gaps change
3. Handle canvas dragging (pan)
4. Responsive preview scaling

**Exports:** Default App component

---

### 🎨 Components (`src/components/`)

```
src/components/
├── Icons.jsx   SVG icon definitions
└── UI.jsx      Reusable UI components
```

#### `src/components/Icons.jsx` (123 lines)
**Purpose:** Icon SVG components  
**Exports (7 icons):**
1. `UploadIcon` - Upload/cloud symbol
2. `RefreshCwIcon` - Refresh/reload symbol
3. `ChevronRightIcon` - Right arrow
4. `ShuffleIcon` - Shuffle/random symbol
5. `TrashIcon` - Delete symbol
6. `ArrowLeftIcon` - Left arrow
7. `ArrowRightIcon` - Right arrow

**Features:**
- Accepts `size` prop (default: 24px)
- Uses `currentColor` for color inheritance
- SVG viewBox: 24x24

**Usage:**
```jsx
<UploadIcon size={16} />
<RefreshCwIcon size={14} />
```

#### `src/components/UI.jsx` (101 lines)
**Purpose:** Reusable form & layout components  
**Exports (6 components):**

1. **`Label`** - Form label
   - Props: `children`, `className`
   - Styling: Bold, uppercase, design font

2. **`Hint`** - Helper text
   - Props: `children`
   - Styling: Muted color, smaller text

3. **`Input`** - Text input field
   - Props: All standard input props
   - Class: `input-element`
   - Features: Focus state styling via CSS

4. **`Select`** - Dropdown select
   - Props: `children` (options), all select props
   - Class: `select-element`
   - Features: Custom arrow icon, focus states

5. **`Btn`** - Button component
   - Props: `children`, `variant` (primary|secondary), `className`, rest
   - Classes: `btn-primary` or `btn-secondary`
   - Features: Hover/active states via CSS, icon support

6. **`Slider`** - Range input with label
   - Props: `label`, `value`, `min`, `max`, `onChange`, `className`
   - Features: Styled range thumb, value display

7. **`Section`** - Panel wrapper
   - Props: `title`, `subtitle`, `children`, `hasDivider`, `className`
   - Features: Optional divider, layout structure

**Design Principles:**
- All styling via CSS classes/Tailwind
- No inline `style` objects
- Event handlers for state only, not styling

---

### 🪝 Hooks (`src/hooks/`)

```
src/hooks/
└── useLibraries.js   External library loader
```

#### `src/hooks/useLibraries.js` (25 lines)
**Purpose:** Load external libraries on component mount  
**Exports:** `useLibraries()` hook  
**Libraries Loaded (via CDN):**
1. Masonry.js (grid layout)
2. ImagesLoaded (image detection)
3. html2canvas (canvas export)

**Returns:** `libsLoaded` boolean  

**Usage in App:**
```jsx
const libsLoaded = useLibraries()
// Wait for libsLoaded before using window.Masonry, etc.
```

**Why Separate Hook?**
- Keeps App.jsx cleaner
- Reusable in other components
- Easy to add more libraries
- Centralized CDN management

---

### 🛠️ Utilities (`src/utils/`)

```
src/utils/
└── scriptLoader.js   Dynamic script loader
```

#### `src/utils/scriptLoader.js` (12 lines)
**Purpose:** Load external scripts dynamically  
**Exports:** `loadScript(src)` function  
**Returns:** Promise (resolves when script loads)  

**Implementation:**
```javascript
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}
```

**Usage:**
```javascript
await loadScript('https://...masonry.js')
// window.Masonry now available
```

**Why Useful?**
- Avoids CDN `<script>` tags in HTML
- Handles async loading
- Error handling built-in
- Parallel loading with Promise.all()

---

### 🎨 Styles (`src/`)

#### `src/styles.css` (261 lines)
**Purpose:** All application styles  
**Organization:** Tailwind @layer structure

**@layer base (20 lines)**
- `:root` CSS variables (9 colors)
- Body defaults
- HTML base styles

**@layer components (230 lines)**
- `.brutalist-slider` - Range input (custom thumbs, :active states)
- `.input-element` - Text input (background, border, :focus)
- `.select-element` - Select dropdown (custom styling, dropdown arrow)
- `.btn-primary` / `.btn-secondary` - Buttons (:hover, :active states)
- `.canvas-area` - Canvas container (position, shadows)
- `.bleed-mask` - Viewport guide (vignette effect)
- `.sidebar` - Sidebar container (layout, colors)
- `.thumbnail-manager` - Thumbnail grid wrapper
- `.thumbnail-item` - Individual thumbnail (hover, drag states)
- `.thumbnail-overlay` - Hover controls (absolute position)
- `.thumbnail-btn` - Thumbnail buttons (hover, disabled)
- `.color-control` - Color picker wrapper
- `.action-area` - Bottom action section
- `.reset-btn` - Reset button (:hover)
- Scrollbar styling

**@layer utilities (1 line)**
- `.font-display` - Display font utility

**Key Design:**
- All colors use CSS variables
- State styling in CSS (no inline event handlers)
- Brutalist aesthetic (no-radius, solid borders)
- Custom scrollbar styling

---

## How Files Work Together

### Development Flow
```
index.html (entry)
  ↓
src/index.jsx (mount React)
  ↓
src/App.jsx (main component)
  ↓
src/components/*.jsx (render UI)
  ↓
src/hooks/*.js (logic)
  ↓
src/utils/*.js (helpers)
  ↓
src/styles.css (styling)
```

### Build Flow (npm run build)
```
Vite reads vite.config.js
  ↓
Processes src/index.jsx
  ↓
Bundles all imports (JS, CSS)
  ↓
Tailwind CSS purges unused classes
  ↓
PostCSS adds vendor prefixes
  ↓
Minifies & optimizes
  ↓
Outputs to dist/
```

### CSS Processing Flow
```
src/styles.css
  ↓
@import Tailwind directives
  ↓
Tailwind generates utilities
  ↓
PostCSS processes @layer
  ↓
Autoprefixer adds -webkit-, -moz-, etc
  ↓
Final CSS bundled with JS
```

---

## File Sizes (Approximate)

| File | Lines | Purpose |
|------|-------|---------|
| `src/App.jsx` | 519 | Main component (largest) |
| `src/styles.css` | 261 | All styles |
| `src/components/Icons.jsx` | 123 | Icon definitions |
| `src/components/UI.jsx` | 101 | UI components |
| `REFACTOR_NOTES.md` | 248 | Documentation |
| `ARCHITECTURE.md` | 314 | Architecture guide |
| `src/hooks/useLibraries.js` | 25 | Library loading |
| `src/index.jsx` | 10 | Entry point |
| `src/utils/scriptLoader.js` | 12 | Script loader |

**Total Source Code:** ~1,300 lines (more modular than original 1,225-line single file)

---

## Common Tasks & Files to Modify

### Add a New Icon
**Edit:** `src/components/Icons.jsx`  
**Steps:**
1. Add SVG component function
2. Export it
3. Import in App.jsx
4. Use `<YourIcon size={16} />`

### Modify UI Styling
**Edit:** `src/styles.css`  
**Approach:**
1. Add/modify CSS classes in @layer components
2. Use CSS variables for colors
3. Use Tailwind utilities in components

### Add New Control
**Edit:** `src/App.jsx`  
**Steps:**
1. Add `useState` for new state
2. Add handler function
3. Add control in JSX
4. Update useEffect dependencies if needed

### Change Color Palette
**Edit:** `src/styles.css` (`:root`)  
**Then:** `tailwind.config.js` (color mapping)  
**Result:** Updates everywhere

### Adjust Tailwind Theme
**Edit:** `tailwind.config.js`  
**Sections:**
- `fontFamily` - Font stacks
- `colors` - Color definitions
- `extend` - Additional customizations

---

## File Checklist for First-Time Setup

- [ ] `npm install` - Install dependencies
- [ ] Review `package.json` - Understand dependencies
- [ ] Read `REFACTOR_SUMMARY.md` - Quick overview
- [ ] Skim `ARCHITECTURE.md` - Understand structure
- [ ] Review `src/App.jsx` - See main logic
- [ ] Review `src/styles.css` - Understand styling
- [ ] Run `npm run dev` - Start development
- [ ] Test features in app
- [ ] Run `npm run build` - Create production build

---

**Navigate between files using this reference for quick lookups! 🗺️**
