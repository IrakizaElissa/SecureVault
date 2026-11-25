# Implementation Plan: SecureVault File Explorer

## Technology Decision

**Choice: Vanilla JavaScript**

**Rationale:** The existing `index.html` is a bare-bones file with no build tooling or framework references. Vanilla JS allows immediate development without setup overhead, keeps the bundle size minimal for performance, and demonstrates core DOM manipulation and algorithmic skills that the challenge explicitly tests. The recursive tree rendering, keyboard navigation, and state management are all achievable with plain JS, and the dark cyber-secure aesthetic can be achieved with custom CSS.

---

## Implementation Steps

- [ ] 1. **Initialize Git repository and create design system documentation**
      
      Create `.gitignore` (node_modules, .DS_Store, .vscode, .idea), initialize git repo, create `design-system.md` documenting the dark-mode cyber-secure aesthetic: typography scale (16px base, 1.25 ratio), color palette (background: #0a0e27, surface: #1a1f3a, accent: #00d9ff, text: #e0e6ed, muted: #6b7a99), spacing grid (4px base unit), and component states (hover, focus, active, selected). Document folder/file icon strategy (SVG inline or Unicode symbols).
      
      **Files:**
      - `.gitignore` (create)
      - `design-system.md` (create)
      - `.git/` (initialize)
      
      **Verify:** `git log` shows initial commit "docs: add design system and gitignore"

- [ ] 2. **Build the base HTML structure and CSS foundation**
      
      Replace `index.html` with semantic structure: header with app title and search bar, main layout with two-column grid (file tree on left, details panel on right). Create `styles.css` with CSS reset, design system variables (CSS custom properties for colors, spacing, typography), base typography, and layout grid. Apply dark-mode color scheme. Ensure responsive layout (single column on mobile, two columns on desktop).
      
      **Files:**
      - `index.html` (replace)
      - `styles.css` (create)
      
      **Verify:** Open `index.html` in browser, confirm dark background renders, layout grid is visible, no console errors.

- [ ] 3. **Implement data loading and recursive tree rendering algorithm**
      
      Create `app.js`. Fetch and parse `data.json` on load. Implement `renderTree(nodes, parentElement, depth)` recursive function: for each node, create a `<li>` with appropriate indent (`depth × 20px`), folder/file icon, and name. For folders, create a nested `<ul>` and recursively call `renderTree` for children. Apply `data-id`, `data-type`, and `data-depth` attributes for DOM querying. Initially render all folders collapsed (children hidden with `display: none`). Mount tree into `#file-tree` container.
      
      **Files:**
      - `app.js` (create)
      - `index.html` (modify: add `<script src="app.js">`)
      
      **Verify:** Open `index.html` in browser, confirm all top-level folders and files render, nested folders are collapsed, tree structure matches `data.json`.

- [ ] 4. **Implement expand/collapse folder interaction**
      
      Add state management: create `state` object tracking `expandedFolders` (Set of folder IDs), `selectedFileId` (string or null), `focusedItemId` (string or null), and `selectedItems` (Set of file IDs for multi-select). Add click event listener to tree container (event delegation). On folder click, toggle its ID in `expandedFolders` Set, then call `updateTreeVisibility()` to show/hide children `<ul>` elements based on expanded state. Add visual indicator (chevron icon or +/- symbol) that rotates/changes on expand/collapse.
      
      **Files:**
      - `app.js` (modify)
      - `styles.css` (modify: add folder icon rotation transition)
      
      **Verify:** Click folders, confirm they expand/collapse, chevron rotates, nested children appear/disappear, state persists across multiple clicks.

- [ ] 5. **Implement file selection and details panel**
      
      On file click, set `state.selectedFileId` to clicked file's ID, update visual state (add `.selected` class to file item, remove from previous selection). Query `data.json` structure to retrieve file object by ID (implement `findFileById(nodes, id)` recursive search). Populate details panel with file Name, Type (extract extension or use type field), and Size. Clear selection when clicking empty space or folders.
      
      **Files:**
      - `app.js` (modify)
      - `styles.css` (modify: add `.selected` state styles, details panel layout)
      
      **Verify:** Click files, confirm details panel updates with correct Name/Type/Size, selected file highlights, clicking another file updates panel, clicking folders clears selection.

- [ ] 6. **Implement keyboard navigation (Up/Down/Left/Right/Enter)**
      
      Add global `keydown` listener. Maintain `visibleItems` array (flattened list of currently visible folders and files in DOM order, rebuilt on expand/collapse). On `ArrowDown`: move `state.focusedItemId` to next visible item. On `ArrowUp`: move to previous. On `ArrowRight`: if focused item is collapsed folder, expand it. On `ArrowLeft`: if focused item is expanded folder, collapse it; if file or collapsed folder, move focus to parent folder. On `Enter`: if focused item is file, select it; if folder, toggle expand/collapse. Apply `.focused` class for visual focus indicator (distinct from `.selected`). Implement focus wrap-around at list boundaries.
      
      **Files:**
      - `app.js` (modify)
      - `styles.css` (modify: add `.focused` state with focus ring)
      
      **Verify:** Use keyboard only: arrow keys navigate tree, right/left expand/collapse folders, Enter selects files, focus indicator is always visible, navigation respects visibility (skips hidden children).

- [ ] 7. **Implement wildcard feature: multi-select with Ctrl+Click and Shift+Click**
      
      On file click, check if Ctrl (or Cmd on Mac) is held: add/remove file ID from `state.selectedItems` Set without clearing other selections. On Shift+Click: select range from last selected file to clicked file (all files in `visibleItems` between indices). Update visual state to show all selected files with `.multi-selected` class. Update details panel to show multi-selection summary: "X files selected, Total size: Y MB". Add "Clear Selection" button to details panel.
      
      **Files:**
      - `app.js` (modify)
      - `styles.css` (modify: add `.multi-selected` state, multi-select summary styles)
      
      **Verify:** Ctrl+Click multiple files, confirm all highlight and details panel shows count/total. Shift+Click to select range. Clear selection button works. Single click (without Ctrl) clears multi-selection.

- [ ] 8. **Implement bonus feature: search/filter with auto-expand**
      
      Add search input field in header. On input (debounced 300ms), filter tree: perform DFS through `data.json` to find all matching files/folders (case-insensitive name match). Build `matchingPaths` Set containing IDs of matches and all ancestor folder IDs. Update tree visibility: hide non-matching items, auto-expand ancestor folders of matches, highlight matching text in names. Clear search restores original tree state. Add "No results" message when search yields nothing.
      
      **Files:**
      - `app.js` (modify)
      - `styles.css` (modify: add search input styles, highlighted match text, empty state)
      
      **Verify:** Type "pdf" in search, confirm only PDF files and their ancestor folders show, ancestors auto-expand, matching text highlights. Clear search restores full tree. Search for nonsense string shows "No results".

- [ ] 9. **Accessibility and polish pass**
      
      Add ARIA attributes: `role="tree"` on container, `role="treeitem"` on items, `aria-expanded` on folders, `aria-selected` on selected files, `aria-label` on search input and details panel. Ensure focus trap works (Tab key navigation follows logical order). Add skip-to-content link. Test keyboard-only navigation flow. Add loading state for data fetch. Add error handling for fetch failures. Optimize re-renders (only update changed DOM nodes instead of full re-render). Add smooth transitions for expand/collapse and selection state changes.
      
      **Files:**
      - `app.js` (modify)
      - `styles.css` (modify: add transitions, loading spinner, error state)
      - `index.html` (modify: add skip link)
      
      **Verify:** Screen reader announces tree structure correctly. All interactive elements are keyboard accessible. Loading state appears briefly on page load. Artificially break data.json path, confirm error message displays.

- [ ] 10. **Update README with project documentation**
      
      Delete all challenge instructions from `README.md`. Replace with professional project documentation: project title and description, design system link (reference `design-system.md`), features list (recursive tree, expand/collapse, file details, keyboard nav, multi-select, search/filter), tech stack (Vanilla JS, CSS3, no frameworks), setup instructions ("Open index.html in browser, no build step required"), recursive strategy explanation (DFS rendering, state-driven visibility toggling), wildcard feature explanation (multi-select improves bulk operations for power users managing many files), screenshot placeholder, and license reference.
      
      **Files:**
      - `README.md` (replace)
      
      **Verify:** Read README.md, confirm all challenge text is removed, documentation is clear and professional, setup instructions are accurate.

---

## Git Commit Strategy

Each step above represents one logical commit. Use conventional commit format:

1. `docs: add design system and gitignore`
2. `feat: add base HTML structure and CSS foundation`
3. `feat: implement data loading and recursive tree rendering`
4. `feat: implement expand/collapse folder interaction`
5. `feat: implement file selection and details panel`
6. `feat: implement keyboard navigation`
7. `feat: implement multi-select with Ctrl+Click and Shift+Click`
8. `feat: implement search/filter with auto-expand`
9. `chore: accessibility and polish pass`
10. `docs: update README with project documentation`

Each commit should leave the codebase in a working, demonstrable state. Commits should be made immediately after verification passes for each step.

---

## State Management Approach

**Plain JavaScript object:**
```javascript
const state = {
  expandedFolders: new Set(),      // folder IDs currently expanded
  selectedFileId: null,             // single selected file ID (or null)
  focusedItemId: null,              // keyboard focus target ID
  selectedItems: new Set(),         // multi-selected file IDs
  searchQuery: '',                  // current search text
  data: []                          // loaded JSON data
};
```

All UI updates are triggered by state mutations followed by targeted DOM updates. No virtual DOM or reactivity framework - direct DOM manipulation for maximum control and performance.

---

## Recursive Strategy

**Tree Rendering:**
- `renderTree(nodes, parentElement, depth)` performs DFS traversal of data structure
- Each call creates DOM nodes for current level, recursively descends into folder children
- Depth parameter controls indentation styling (`padding-left: ${depth * 20}px`)
- Node attributes (`data-id`, `data-type`, `data-depth`) enable efficient querying

**Search/Filter:**
- `findMatchingNodes(nodes, query)` performs DFS to build Set of matching node IDs
- `collectAncestors(nodeId)` walks up tree to collect all parent folder IDs
- Combined Set becomes `matchingPaths` used to filter tree visibility

**File Lookup:**
- `findNodeById(nodes, id)` performs DFS to retrieve node object by ID
- Memoization optional for performance (cache lookups in Map)

---

## Verification Commands

Since this is a Vanilla JS project with no build tooling:

- **Visual verification:** Open `index.html` in browser (Chrome, Firefox, or Edge)
- **Console verification:** No errors in browser DevTools console
- **Manual testing:** Follow verification steps for each feature
- **Cross-browser testing:** Test in at least 2 modern browsers

No automated tests are planned initially (Vanilla JS with no test framework setup), but each step includes specific manual verification criteria to ensure functionality.

---

## Notes

- The existing `index.html` references `/src/main.js` which doesn't exist - this will be replaced with direct `<script src="app.js">` reference
- `data.json` structure is well-formed with consistent `id`, `name`, `type`, `children`/`size` fields
- Maximum nesting depth in provided data is 4 levels (root → Legal → Active_Cases → Doe_vs_MegaCorp → Discovery_Phase)
- Git repository must be initialized in `c:\Users\user\Desktop\AmaliTech\AmaliTech-DEG-Project-based-challenges-main\fullstack\secure-vault` before first commit
- Challenge explicitly forbids Bootstrap, Material UI, Chakra UI - Vanilla CSS only
- Design file (Figma/Penpot) is not included in this plan - `design-system.md` serves as written design documentation instead (acceptable alternative if visual design file is not strictly required for implementation)
