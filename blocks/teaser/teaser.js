export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length > 0) {
    // Row 1: Background Image
    const bgRow = rows[0];
    bgRow.classList.add('teaser-bg');

    // Create a content container for all remaining rows (Text, Subtitle, Button)
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('teaser-content');

    // Append all rows after Row 1 into contentContainer
    const contentRows = rows.slice(1);
    contentRows.forEach((row) => {
      contentContainer.appendChild(row);
    });

    block.appendChild(contentContainer);
  }
}
