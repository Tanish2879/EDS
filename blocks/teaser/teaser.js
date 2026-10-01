export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length > 0) {
    // Row 1: Background Image
    const bgRow = rows[0];
    bgRow.classList.add('teaser-bg');

    // Create a content container for all remaining rows
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('teaser-content');

    // Define base class names for the specific rows
    const classNames = ['teaser-title', 'teaser-subtitle', 'teaser-cta'];

    // Append all rows after Row 1 into contentContainer and assign structural classes
    const contentRows = rows.slice(1);
    contentRows.forEach((row, index) => {
      const baseName = classNames[index];
      
      if (baseName) {
        // 1. Add class to the outer row div
        row.classList.add(baseName);
        
        // 2. Add class to the inner div
        const innerDiv = row.children[0];
        if (innerDiv) {
          innerDiv.classList.add(`${baseName}-inner`);
          
          // 3. Add class to the paragraph tag
          const p = innerDiv.querySelector('p');
          if (p) {
            p.classList.add(`${baseName}-text`);
          }
        }
      }
      
      contentContainer.appendChild(row);
    });

    block.appendChild(contentContainer);
  }
}