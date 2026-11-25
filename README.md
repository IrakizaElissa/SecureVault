# SecureVault - Enterprise File Explorer

A dark-themed, cyber-secure file explorer built with vanilla JavaScript. Features recursive tree rendering, advanced keyboard navigation, multi-select capabilities, and intelligent search with auto-expand.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Core Functionality
- **Recursive Tree Rendering**: Depth-first search algorithm renders nested folder structures with dynamic indentation
- **Expand/Collapse Folders**: Click folders to toggle visibility of their contents
- **File Selection**: Click files to view detailed properties in the details panel
- **File Details Panel**: Displays name, type, size, and full path for selected files

### Advanced Navigation
- **Full Keyboard Navigation**:
  - `↑` / `↓` - Navigate through visible items
  - `←` / `→` - Collapse/expand folders or navigate to parent/child
  - `Enter` - Select focused item or toggle folder
  - `Ctrl+F` - Focus search bar
  - `Esc` - Clear selection or search

### Wildcard Feature: Multi-Select
Power users can select multiple files for bulk operations:
- **Ctrl+Click** - Toggle individual files in multi-selection
- **Shift+Click** - Select range from last selected file to clicked file
- **Ctrl+A** - Select all currently visible files
- Multi-selection summary displays count and list of selected items

### Search & Filter
- **Intelligent Search**: Type to filter files and folders (debounced 150ms)
- **Auto-Expand**: Automatically expands ancestor folders of search matches
- **Text Highlighting**: Matching text is highlighted in yellow
- **Result Count**: Shows number of matches in real-time
- **Clear Button**: One-click to restore full tree view

### Design System
- **Cyber-Secure Dark Theme**: High-contrast color palette with electric accents
- **Smooth Transitions**: All interactions feature fluid animations
- **Focus Indicators**: Clear keyboard focus rings for accessibility
- **Status Bar**: Real-time display of item count, selection count, and search results

## Tech Stack

- **Vanilla JavaScript** (ES6+) - No frameworks, no build tools
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **HTML5** - Semantic markup with ARIA attributes

## Setup Instructions

No build step required! Simply open the application:

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. The app will load `data.json` automatically (falls back to embedded data if fetch fails)

```bash
# Option 1: Double-click index.html

# Option 2: Use a local server (optional)
# Python 3
python -m http.server 8000

# Node.js
npx serve

# Then navigate to http://localhost:8000
```

## Recursive Strategy

### Tree Rendering Algorithm
The `buildTree(nodes, depth)` function implements depth-first traversal:
1. Iterates through each node at the current level
2. Creates DOM elements with depth-based indentation (`depth × 20px`)
3. For folders, recursively calls `buildTree()` for children
4. Returns a DocumentFragment for efficient DOM insertion

### State Management
Plain JavaScript object tracks application state:
```javascript
{
  data: [],                    // Loaded JSON data
  expandedIds: Set,            // Currently expanded folders
  selectedId: string|null,     // Single selected file
  focusedId: string|null,      // Keyboard-focused item
  multiSelectedIds: Set,       // Multi-selected files
  searchQuery: string,         // Current search text
  searchResults: Set,          // IDs matching search
  autoExpandedIds: Set         // Folders auto-expanded by search
}
```

All UI updates are triggered by state mutations followed by `renderTree()`, which performs a full re-render of the visible tree structure.

### Search Implementation
1. **DFS through all nodes** to find matches by name
2. **Walk up ancestor chain** for each match to build `searchResults` Set
3. **Auto-expand ancestors** to make matches visible
4. **Re-render tree** with non-matching items hidden

## File Structure

```
secure-vault/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and design system
├── app.js              # All JavaScript logic
├── data.json           # File tree data structure
├── design-system.md    # Design system documentation
├── README.md           # Project documentation
└── LICENSE             # MIT License
```

## Design System

See [design-system.md](design-system.md) for complete documentation of:
- Color palette (CSS custom properties)
- Typography scale
- Spacing system
- Component states
- Icon mapping
- Accessibility standards

## Browser Compatibility

Tested and working in:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires ES6+ support (Arrow functions, template literals, Set, spread operator).

## Wildcard Feature Rationale

Multi-select improves productivity for power users managing large file systems:
- **Bulk Operations**: Select multiple files for download, move, or delete
- **Quick Comparison**: View properties of several files simultaneously
- **Range Selection**: Shift+Click enables fast selection of file sequences
- **Visual Feedback**: Clear indicators show multi-selected state

This feature mimics familiar file explorer behavior (Windows Explorer, macOS Finder) to reduce learning curve.

## Performance Considerations

- **Full Re-render on State Change**: Simple approach, no virtual DOM overhead
- **DocumentFragment**: Batch DOM operations for efficient insertion
- **Debounced Search**: 150ms delay prevents excessive filtering on rapid typing
- **CSS Transitions**: Hardware-accelerated transforms for smooth animations

For extremely large file trees (>10,000 items), consider implementing:
- Virtual scrolling
- Incremental rendering
- Memoized node lookups

## License

MIT License - See [LICENSE](LICENSE) file for details

## Credits

Built as part of the AmaliTech DEG Project-based challenges.

---

**Version**: 1.0.0  
**Last Updated**: 2025
