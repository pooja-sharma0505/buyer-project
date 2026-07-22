const fs = require('fs');
const content = fs.readFileSync('pages/index.vue', 'utf8');

const old = `        <p v-if="!paginatedProducts.length" class="status-text">\n          No products match{{ selectedCategory === 'All' ? '' : \` in "${selectedCategory}"\` }}{{ search ? ' for your search' : '' }}.\n        </p>`;

const replacement = `        <div v-if="!paginatedProducts.length" class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <h2 class="empty-title">No products found</h2>
          <p class="empty-text">No products match{{ selectedCategory === 'All' ? '' : \` in "${selectedCategory}"\` }}{{ search ? ' for your search' : '' }}.</p>
          <button class="empty-cta" @click="selectedCategory = 'All'; search = ''">Clear Filters</button>
        </div>`;

if (!content.includes(old)) {
  console.log('Pattern not found, trying alternate...');
  // Try with escaped quotes
  const old2 = `        <p v-if="!paginatedProducts.length" class="status-text">\n          No products match{{ selectedCategory === 'All' ? '' : \` in \u201c${selectedCategory}\u201d\` }}{{ search ? ' for your search' : '' }}.\n        </p>`;
  if (!content.includes(old2)) {
    console.log('Pattern not found');
    process.exit(1);
  }
  const newContent = content.replace(old2, replacement);
  fs.writeFileSync('pages/index.vue', newContent);
  console.log('Done (alt)');
  process.exit(0);
}

const newContent = content.replace(old, replacement);
fs.writeFileSync('pages/index.vue', newContent);
console.log('Done');