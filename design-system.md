# SecureVault Design System

## Color Palette

### CSS Custom Properties
```css
--bg-primary: #0a0e1a       /* deepest background */
--bg-secondary: #0d1321     /* panel background */
--bg-tertiary: #111827      /* sidebar/tree background */
--bg-hover: #1a2235         /* hover state */
--bg-selected: #1e3a5f      /* selected item */
--bg-focused: #162032       /* keyboard-focused item */
--accent-primary: #00d4ff   /* cyber blue */
--accent-secondary: #0088cc /* darker blue */
--accent-green: #00ff88     /* success/file green */
--accent-warning: #ffaa00   /* warning amber */
--text-primary: #e2e8f0     /* main text */
--text-secondary: #94a3b8   /* subdued text */
--text-muted: #475569       /* very subdued */
--border-color: #1e293b     /* subtle borders */
--border-accent: #00d4ff33  /* accent border with opacity */
--multi-select-bg: #1a3a1a  /* multi-selected item background */
--multi-select-border: #00ff88 /* multi-select border */
```

### Theme
Dark cyber-secure aesthetic with high contrast and electric accent colors.

## Typography

### Font Stack
```css
font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

## Spacing

Base unit: **4px (0.25rem)**

Common spacing values:
- 4px (0.25rem)
- 8px (0.5rem)
- 12px (0.75rem)
- 16px (1rem)
- 24px (1.5rem)
- 32px (2rem)

## Component States

### Interactive States
- **Normal**: default appearance
- **Hover**: `--bg-hover` background
- **Focused**: 1px solid `--accent-primary` focus ring (keyboard navigation)
- **Selected**: `--bg-selected` background
- **Multi-selected**: `--multi-select-bg` background + left border `--multi-select-border`
- **Expanded**: folder open icon
- **Collapsed**: folder closed icon

## Layout

### Grid Structure
Two-column layout:
- **Left column (~60%)**: Header + Search + File Tree
- **Right column (~40%)**: File Details Panel + Status Bar

### Tree Indentation
- **20px per depth level**
- Uses `padding-left` calculated as `depth × 20px`

## Icons

### File Type Mapping (Text-based)
- **PDF**: 📄
- **DOCX/DOC**: 📝
- **XLSX/XLS**: 📊
- **TXT**: 📃
- **PNG/JPG/GIF/SVG**: 🖼️
- **YAML/YML**: ⚙️
- **JSON**: { }
- **JS/TS**: 🔧
- **Folder (collapsed)**: 📁
- **Folder (open)**: 📂
- **Default file**: 📄

### UI Icons
- **Chevron collapsed**: ▶
- **Chevron expanded**: ▼
- **Search**: 🔍
- **Close/Clear**: ×

## Transitions

Smooth transitions for state changes:
```css
transition: all 0.2s ease-in-out;
```

Applied to:
- Background color changes
- Border changes
- Transform (chevron rotation)
- Opacity changes

## Accessibility

### Focus Indicators
All interactive elements must have visible focus indicators for keyboard navigation.

### ARIA Attributes
- `role="tree"` on tree container
- `role="treeitem"` on each item
- `aria-expanded` on folders
- `aria-selected` on selected files
- `aria-label` on interactive elements

### Color Contrast
Text colors meet WCAG AA standards:
- Primary text on primary background: ratio > 7:1
- Secondary text on primary background: ratio > 4.5:1

## Responsive Behavior

### Desktop (> 768px)
Two-column layout with file tree and details panel side-by-side

### Mobile (≤ 768px)
Single column layout with collapsible panels (not implemented in v1.0.0)

## Component Guidelines

### File Tree
- Recursive rendering with depth-based indentation
- Click to expand/collapse folders
- Click to select files
- Keyboard navigation support
- Multi-select with Ctrl+Click and Shift+Click

### Search Bar
- Debounced input (150ms)
- Auto-expand ancestor folders of matches
- Highlight matching text with `<mark>` element
- Clear button when query is active

### Details Panel
- Shows selected file properties
- Multi-select summary when multiple items selected
- Empty state when no selection

### Status Bar
- Item counts
- Selected count
- Search results count
