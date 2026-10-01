export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length > 0) {
    // Row 1: Background Image
    const bgRow = rows[0];
    bgRow.classList.add('teaser-bg');

    // Create a content container for all remaining rows
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('teaser-content');

    // Append all rows after Row 1 into contentContainer and assign classes
    const contentRows = rows.slice(1);
    contentRows.forEach((row, index) => {
      // Assign specific classes to each row based on its position
      if (index === 0) row.classList.add('teaser-title');
      if (index === 1) row.classList.add('teaser-subtitle');
      if (index === 2) row.classList.add('teaser-cta');
      
      contentContainer.appendChild(row);
    });

    block.appendChild(contentContainer);
  }
}