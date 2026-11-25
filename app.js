// ===== State Management =====
const state = {
    data: [],
    expandedIds: new Set(),
    selectedId: null,
    focusedId: null,
    multiSelectedIds: new Set(),
    searchQuery: '',
    searchResults: new Set(),
    autoExpandedIds: new Set()
};

// ===== File Type Icons =====
const FILE_ICONS = {
    'pdf': '📄',
    'docx': '📝',
    'doc': '📝',
    'xlsx': '📊',
    'xls': '📊',
    'txt': '📃',
    'png': '🖼️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'gif': '🖼️',
    'svg': '🖼️',
    'yaml': '⚙️',
    'yml': '⚙️',
    'json': '{ }',
    'js': '🔧',
    'ts': '🔧',
    'ttf': '🔤'
};

// ===== Fallback Data (if fetch fails) =====
const FALLBACK_DATA = [
    {
        "id": "root_1",
        "name": "01_Legal_Department",
        "type": "folder",
        "children": [
            {
                "id": "leg_1",
                "name": "Active_Cases",
                "type": "folder",
                "children": [
                    {
                        "id": "case_a",
                        "name": "Doe_vs_MegaCorp_Inc",
                        "type": "folder",
                        "children": [
                            {
                                "id": "disc_1",
                                "name": "Discovery_Phase",
                                "type": "folder",
                                "children": [
                                    { "id": "email_1", "name": "Email_Thread_Jan2024.pdf", "type": "file", "size": "4.2MB" },
                                    { "id": "email_2", "name": "Leak_Evidence.png", "type": "file", "size": "8.1MB" }
                                ]
                            },
                            { "id": "file_summ", "name": "Case_Summary_Draft_v3.docx", "type": "file", "size": "45KB" }
                        ]
                    },
                    {
                        "id": "case_b",
                        "name": "Smith_Estate_Dispute",
                        "type": "folder",
                        "children": [
                            { "id": "will_1", "name": "Last_Will_Testament.pdf", "type": "file", "size": "890KB" }
                        ]
                    }
                ]
            },
            {
                "id": "leg_2",
                "name": "Archived_2020",
                "type": "folder",
                "children": []
            }
        ]
    },
    {
        "id": "root_2",
        "name": "02_Finance_Team",
        "type": "folder",
        "children": [
            {
                "id": "fin_1",
                "name": "Payroll",
                "type": "folder",
                "children": [
                    { "id": "pay_feb", "name": "February_2025.xlsx", "type": "file", "size": "2.1MB" },
                    { "id": "pay_mar", "name": "March_2025_Projection.xlsx", "type": "file", "size": "1.8MB" }
                ]
            },
            { "id": "tax_doc", "name": "Tax_Compliance_Checklist.pdf", "type": "file", "size": "340KB" }
        ]
    },
    {
        "id": "root_3",
        "name": "03_IT_Security",
        "type": "folder",
        "children": [
            {
                "id": "sec_logs",
                "name": "Server_Logs",
                "type": "folder",
                "children": [
                    { "id": "log_err", "name": "error_log_x86.txt", "type": "file", "size": "12MB" },
                    { "id": "log_acc", "name": "access_log_main.txt", "type": "file", "size": "45MB" }
                ]
            },
            { "id": "config_yaml", "name": "docker-compose.yaml", "type": "file", "size": "4KB" }
        ]
    },
    {
        "id": "root_4",
        "name": "Shared_Resources",
        "type": "folder",
        "children": [
            {
                "id": "brand_kit",
                "name": "Brand_Assets",
                "type": "folder",
                "children": [
                    { "id": "logo_svg", "name": "SecureVault_Logo.svg", "type": "file", "size": "15KB" },
                    { "id": "font_main", "name": "Roboto-Bold.ttf", "type": "file", "size": "1.2MB" }
                ]
            }
        ]
    },
    { "id": "root_file_1", "name": "README_First.txt", "type": "file", "size": "1KB" },
    { "id": "root_file_2", "name": ".gitignore", "type": "file", "size": "1KB" }
];

// ===== Utility Functions =====

function getFileIcon(fileName, type) {
    if (type === 'folder') {
        return '📁';
    }
    const ext = fileName.split('.').pop().toLowerCase();
    return FILE_ICONS[ext] || '📄';
}

function getFileExtension(fileName) {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop().toUpperCase() : 'FILE';
}

function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ===== Data Search & Retrieval =====

function findNodeById(nodes, id) {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return null;
}

function getNodePath(nodes, targetId, currentPath = []) {
    for (const node of nodes) {
        const newPath = [...currentPath, node.name];
        if (node.id === targetId) {
            return newPath.join(' / ');
        }
        if (node.children) {
            const found = getNodePath(node.children, targetId, newPath);
            if (found) return found;
        }
    }
    return null;
}

function countAllItems(nodes) {
    let count = 0;
    for (const node of nodes) {
        count++;
        if (node.children) {
            count += countAllItems(node.children);
        }
    }
    return count;
}

// ===== Tree Rendering =====

function buildTree(nodes, depth = 0) {
    const fragment = document.createDocumentFragment();
    
    for (const node of nodes) {
        const li = document.createElement('li');
        
        const item = document.createElement('div');
        item.className = 'tree-item';
        item.setAttribute('data-id', node.id);
        item.setAttribute('data-type', node.type);
        item.setAttribute('data-depth', depth);
        item.setAttribute('role', 'treeitem');
        item.style.paddingLeft = `${depth * 20 + 12}px`;
        
        // Apply state classes
        if (state.focusedId === node.id) {
            item.classList.add('focused');
        }
        if (state.selectedId === node.id) {
            item.classList.add('selected');
        }
        if (state.multiSelectedIds.has(node.id)) {
            item.classList.add('multi-selected');
        }
        
        // Check if item matches search
        const isSearching = state.searchQuery.length > 0;
        const matchesSearch = state.searchResults.has(node.id);
        
        if (node.type === 'folder') {
            // Chevron
            const chevron = document.createElement('span');
            chevron.className = 'chevron';
            const isExpanded = state.expandedIds.has(node.id) || state.autoExpandedIds.has(node.id);
            chevron.textContent = '▶';
            if (isExpanded) {
                chevron.classList.add('expanded');
            }
            item.appendChild(chevron);
            
            // Folder icon
            const icon = document.createElement('span');
            icon.className = 'icon';
            icon.textContent = isExpanded ? '📂' : '📁';
            item.appendChild(icon);
            
            // Folder name
            const name = document.createElement('span');
            name.className = 'item-name';
            name.innerHTML = highlightText(node.name, state.searchQuery);
            item.appendChild(name);
            
            item.setAttribute('aria-expanded', isExpanded);
            
            li.appendChild(item);
            
            // Children
            if (node.children && node.children.length > 0) {
                const childrenUl = document.createElement('ul');
                childrenUl.className = 'tree-children';
                
                if (!isExpanded) {
                    childrenUl.style.display = 'none';
                }
                
                const childrenFragment = buildTree(node.children, depth + 1);
                childrenUl.appendChild(childrenFragment);
                li.appendChild(childrenUl);
            }
        } else {
            // File icon
            const icon = document.createElement('span');
            icon.className = 'icon';
            icon.textContent = getFileIcon(node.name, node.type);
            item.appendChild(icon);
            
            // File name
            const name = document.createElement('span');
            name.className = 'item-name';
            name.innerHTML = highlightText(node.name, state.searchQuery);
            item.appendChild(name);
            
            // File size
            if (node.size) {
                const size = document.createElement('span');
                size.className = 'item-size';
                size.textContent = node.size;
                item.appendChild(size);
            }
            
            item.setAttribute('aria-selected', state.selectedId === node.id || state.multiSelectedIds.has(node.id));
            
            li.appendChild(item);
        }
        
        // Hide non-matching items during search
        if (isSearching && !matchesSearch) {
            li.style.display = 'none';
        }
        
        fragment.appendChild(li);
    }
    
    return fragment;
}

function renderTree() {
    const treeContainer = document.getElementById('file-tree');
    treeContainer.innerHTML = '';
    const fragment = buildTree(state.data);
    treeContainer.appendChild(fragment);
    updateStatusBar();
}

// ===== Status Bar Update =====

function updateStatusBar() {
    const totalItems = countAllItems(state.data);
    document.getElementById('status-items').textContent = `Items: ${totalItems}`;
    
    const selectedCount = state.multiSelectedIds.size || (state.selectedId ? 1 : 0);
    document.getElementById('status-selected').textContent = `Selected: ${selectedCount}`;
    
    if (state.searchQuery) {
        document.getElementById('status-search').textContent = `Search: ${state.searchResults.size} results`;
    } else {
        document.getElementById('status-search').textContent = '';
    }
}

// ===== Data Loading =====

async function loadData() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error('Failed to fetch data.json');
        state.data = await response.json();
    } catch (error) {
        console.warn('Failed to load data.json, using fallback data:', error);
        state.data = FALLBACK_DATA;
    }
    renderTree();
}

// ===== Details Panel =====

function updateDetailsPanel() {
    const title = document.getElementById('details-title');
    const content = document.getElementById('details-content');
    
    if (state.multiSelectedIds.size > 0) {
        // Multi-select summary
        title.textContent = 'Multi-Selection';
        
        const summary = document.createElement('div');
        summary.className = 'multi-select-summary';
        
        const summaryTitle = document.createElement('div');
        summaryTitle.className = 'multi-select-title';
        summaryTitle.textContent = `${state.multiSelectedIds.size} items selected`;
        summary.appendChild(summaryTitle);
        
        const list = document.createElement('ul');
        list.className = 'multi-select-list';
        
        for (const id of state.multiSelectedIds) {
            const node = findNodeById(state.data, id);
            if (node) {
                const li = document.createElement('li');
                li.className = 'multi-select-item';
                li.textContent = `${getFileIcon(node.name, node.type)} ${node.name}`;
                list.appendChild(li);
            }
        }
        
        summary.appendChild(list);
        content.innerHTML = '';
        content.appendChild(summary);
    } else if (state.selectedId) {
        // Single file selected
        const node = findNodeById(state.data, state.selectedId);
        if (node) {
            title.textContent = 'File Properties';
            
            content.innerHTML = `
                <div class="detail-item">
                    <div class="detail-label">Name</div>
                    <div class="detail-value">${node.name}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Type</div>
                    <div class="detail-value">${getFileExtension(node.name)}</div>
                </div>
                ${node.size ? `
                <div class="detail-item">
                    <div class="detail-label">Size</div>
                    <div class="detail-value">${node.size}</div>
                </div>
                ` : ''}
                <div class="detail-item">
                    <div class="detail-label">Path</div>
                    <div class="detail-value">${getNodePath(state.data, state.selectedId)}</div>
                </div>
            `;
        }
    } else {
        // No selection
        title.textContent = 'Select a file';
        content.innerHTML = '<p class="details-placeholder">Click on a file to view its properties</p>';
    }
}

// ===== Event Handlers =====

function handleTreeClick(event) {
    const item = event.target.closest('.tree-item');
    if (!item) return;
    
    const id = item.getAttribute('data-id');
    const type = item.getAttribute('data-type');
    
    if (type === 'folder') {
        // Toggle expand/collapse
        if (state.expandedIds.has(id)) {
            state.expandedIds.delete(id);
        } else {
            state.expandedIds.add(id);
        }
        renderTree();
    } else {
        // File selection
        state.selectedId = id;
        state.multiSelectedIds.clear();
        renderTree();
        updateDetailsPanel();
    }
}

// ===== Initialize App =====

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Tree click handler
    const treeContainer = document.getElementById('file-tree');
    treeContainer.addEventListener('click', handleTreeClick);
});
