# SlideStudio Architecture

## Component Hierarchy

```
App (src/App.jsx)
├── Workspace (main canvas area)
│   └── Canvas Preview
│       ├── Masonry Grid (gridRef)
│       ├── Photo Items
│       │   └── Image + Border/Styling
│       └── Viewport Guide (bleed-mask)
└── Sidebar
    ├── Title & Description
    ├── Section: Add Files
    │   ├── Button (Upload)
    │   ├── Button (Shuffle)
    │   └── Thumbnail Manager
    │       └── ThumbnailItem[] (with drag/drop)
    ├── Section: Grid Layout
    │   ├── Input (Columns)
    │   ├── Input (Gap)
    │   ├── Input (Border radius)
    │   └── Input (Border weight)
    ├── Section: Adjust Viewport
    │   ├── Select (Format)
    │   ├── Slider (Zoom %)
    │   └── Slider (Rotation °)
    ├── Section: Appearance
    │   ├── ColorPicker (Border color)
    │   └── ColorPicker (Canvas background)
    └── Action Area
        ├── Button (Export Image)
        └── Button (Clear settings)
```

## Data Flow

```
User Input
    ↓
State Update (useState)
    ↓
Effect Hook (useEffect)
    ↓
DOM Update (React rendering)
    ↓
CSS Styling (Tailwind + custom)
    ↓
Visual Output
```

### Example: Upload Photos
```
handleUpload()
    ↓
setPhotos([...prev, ...newPhotos])
    ↓
useEffect([libsLoaded, photos, gap, cols])
    ↓
window.imagesLoaded(gridRef.current, ...)
    ↓
masonryInstance.current.reloadItems()
    ↓
Grid updates in DOM
```

## File Responsibilities

### Entry Points
```
index.html                  → DOM root
src/index.jsx              → React mount point, CSS import
```

### Application
```
src/App.jsx                → Main component, state management, logic
```

### Components (Reusable)
```
src/components/Icons.jsx   → 7 SVG icon components
src/components/UI.jsx      → 6 form/layout components
```

### Hooks (Logic)
```
src/hooks/useLibraries.js  → External library loading
```

### Utilities (Helpers)
```
src/utils/scriptLoader.js  → loadScript() helper
```

### Styling
```
src/styles.css             → All CSS (Tailwind + custom)
tailwind.config.js         → Tailwind configuration
postcss.config.js          → PostCSS plugins
```

### Configuration
```
vite.config.js             → Vite build configuration
package.json               → Dependencies & scripts
```

## State Management

### App-level State (all in `App.jsx`)

**Photo Management:**
- `photos` - Array of uploaded photos with id & src
- `draggedIndex` - Currently dragged photo index

**Grid Properties:**
- `cols` - Number of columns (default: 4)
- `gap` - Space between items in px (default: 12)
- `radius` - Border radius in px (default: 6)
- `borderWeight` - Border thickness in px (default: 1)

**Canvas Controls:**
- `zoom` - Zoom percentage (default: 130)
- `rotation` - Rotation in degrees (default: 20)
- `aspectRatio` - Canvas ratio (16:9 or 9:16)

**Colors:**
- `borderColor` - Photo border color (default: #4442e3)
- `bgColor` - Canvas background color (default: #ededed)

**Pan/Drag:**
- `pan` - Current pan position {x, y}
- `isDragging` - Is canvas being dragged?
- `dragStart` - Initial drag position (useRef)

**UI State:**
- `isExporting` - Is export in progress?
- `previewScale` - Canvas preview scale factor
- `libsLoaded` - External libraries loaded?

## Styling Strategy

### CSS Layers (Tailwind)

**@layer base**
- CSS variables (design tokens)
- Global body styling
- HTML element defaults

**@layer components**
- `.brutalist-slider` - Custom range input
- `.input-element` - Text inputs (+ :focus state)
- `.select-element` - Dropdowns (+ :focus state)
- `.btn-primary` / `.btn-secondary` - Buttons (+ :hover, :active)
- `.canvas-area` - Canvas container
- `.bleed-mask` - Viewport guide overlay
- `.sidebar` - Sidebar container
- `.thumbnail-manager` - Thumbnail grid
- `.thumbnail-item` - Individual thumbnail
- `.thumbnail-overlay` - Hover overlay
- `.thumbnail-btn` - Thumbnail control buttons
- `.color-control` - Color picker container
- `.action-area` - Bottom action buttons
- `.reset-btn` - Reset button

**@layer utilities**
- Tailwind default utilities
- `font-display` - Custom font utility

### CSS Variables

**Colors (9 total)**
```css
--bg: #ede9dd;        /* Main background */
--bg-2: #e5e0d2;      /* Secondary background */
--bg-3: #dad3c1;      /* Tertiary background */
--paper: #f5f1e5;     /* Paper/card background */
--line: #cfc8b5;      /* Border/divider color */
--ink: #14110b;       /* Primary text/dark color */
--ink-2: #2c261a;     /* Secondary text color */
--ink-mute: #6b6354;  /* Muted text color */
--ink-faint: #9a927f; /* Very light text color */
```

**Usage in Tailwind:**
- Extended color palette: `bg-bg`, `text-ink`, `border-line`, etc.
- Font stacks: `font-display`, `font-sans`

## Event Handling

### User Interactions

**Photo Upload**
```
File Input Change → handleUpload() → setPhotos()
```

**Photo Management**
```
Delete → handleDelete() → setPhotos()
Move → handleMove() → setPhotos()
Drag/Drop → handleDragStart/Over/End() → setPhotos()
Shuffle → handleShuffle() → setPhotos()
```

**Canvas Interaction**
```
Mouse Down → setIsDragging(true)
Mouse Move (while dragging) → setPan({x, y})
Mouse Up → setIsDragging(false)
```

**Control Changes**
```
Input/Slider Change → setState(newValue)
useEffect triggers → Updates grid/canvas
```

**Export**
```
Export Button → handleExport() → html2canvas() → Download PNG
```

## Library Dependencies

### Runtime (CDN loaded via `useLibraries` hook)
- **Masonry.js** - Masonry grid layout algorithm
- **ImagesLoaded** - Image loading detection
- **html2canvas** - DOM to canvas conversion for export
- **Google Fonts** - Bricolage Grotesque, Instrument Serif, Inter

### Build Time (npm packages)
- **React 18.2.0** - UI library
- **React DOM 18.2.0** - DOM rendering
- **Vite 5.0.7** - Build tool
- **Tailwind CSS 3.3.6** - Utility CSS framework
- **PostCSS 8.4.31** - CSS transformation
- **Autoprefixer 10.4.16** - Vendor prefixes

## Performance Considerations

### Optimizations in Place
1. **Lazy Library Loading** - External libraries load on mount, not bundled
2. **CSS Purging** - Unused Tailwind classes removed in production
3. **Image Optimization** - User-uploaded images handled by browser
4. **Responsive Scaling** - Canvas preview scales efficiently
5. **Event Delegation** - Minimal event listeners

### Potential Improvements
1. Code splitting with React.lazy()
2. Memoization with useMemo/useCallback
3. Virtual scrolling for many photos
4. Web Workers for heavy canvas operations
5. Service Worker for offline support

## Deployment

### Development
```bash
npm install
npm run dev
# → http://localhost:3000 with HMR
```

### Production
```bash
npm install
npm run build
npm run preview
# → dist/ folder ready for deployment
```

### Hosting Options
- **Vercel** - Automatic from GitHub
- **Netlify** - Automatic from GitHub
- **AWS S3 + CloudFront** - Static hosting
- **GitHub Pages** - Free static hosting
- **Any static host** - Just serve dist/ folder

## Browser Support

✅ Modern browsers (ES2020+)
- Chrome/Edge 91+
- Firefox 89+
- Safari 14+

Vite automatically handles transpilation for your target browsers via PostCSS.

## Testing Strategy (Recommended)

### Unit Tests
- Individual component props/outputs
- Helper functions (shuffling, reordering)

### Integration Tests
- Photo upload flow
- Grid layout updates
- Canvas interaction

### E2E Tests
- Full user workflows
- Export functionality
- Settings persistence (if added)

### Tools
- Vitest - Fast unit testing
- React Testing Library - Component testing
- Cypress/Playwright - E2E testing

---

**Architecture designed for clarity, maintainability, and scalability.**
