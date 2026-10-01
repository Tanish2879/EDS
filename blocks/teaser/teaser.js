export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // 1. Identify the background image row
  const bgRow = rows.find((row) => row.querySelector('picture, img')) || rows[0];
  bgRow.classList.add('teaser-bg');
  const img = bgRow.querySelector('img');
  if (img) {
    img.setAttribute('loading', 'eager');
  }

  // 2. Content container
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('teaser-content');

  // Filter out the background row to get all content rows
  const contentRows = rows.filter((row) => row !== bgRow);

  if (contentRows.length === 1) {
    // If all text is authored in a single table row/cell
    const cell = contentRows[0].firstElementChild || contentRows[0];
    const elements = [...cell.children];

    if (elements.length > 0) {
      // Find heading or first element -> Title
      const titleEl = elements.find((el) => /^H[1-6]$/.test(el.tagName)) || elements[0];
      const titleWrapper = document.createElement('div');
      titleWrapper.className = 'teaser-title';
      titleEl.classList.add('teaser-title-text');
      titleWrapper.append(titleEl);
      contentContainer.append(titleWrapper);

      // Find link or last element -> CTA
      const ctaEl = elements.find((el) => el.querySelector('a') || el.tagName === 'A' || el.classList.contains('button-wrapper'))
        || (elements.length > 2 ? elements[elements.length - 1] : null);

      // Any intermediate elements -> Subtitle
      const subtitleEls = elements.filter((el) => el !== titleEl && el !== ctaEl);
      if (subtitleEls.length > 0) {
        const subtitleWrapper = document.createElement('div');
        subtitleWrapper.className = 'teaser-subtitle';
        subtitleEls.forEach((el) => {
          el.classList.add('teaser-subtitle-text');
          subtitleWrapper.append(el);
        });
        contentContainer.append(subtitleWrapper);
      }

      if (ctaEl && ctaEl !== titleEl) {
        const ctaWrapper = document.createElement('div');
        ctaWrapper.className = 'teaser-cta';
        ctaEl.classList.add('teaser-cta-text');
        ctaWrapper.append(ctaEl);
        contentContainer.append(ctaWrapper);
      }
    } else {
      contentContainer.append(contentRows[0]);
    }
  } else {
    // If author used separate rows for Title, Subtitle, and CTA
    const classNames = ['teaser-title', 'teaser-subtitle', 'teaser-cta'];
    contentRows.forEach((row, index) => {
      const baseName = classNames[index] || `teaser-row-${index + 1}`;
      row.className = baseName;

      // 3. Add inner class to the first child div
      const innerDiv = row.firstElementChild;
      if (innerDiv) {
        innerDiv.classList.add(`${baseName}-inner`);

        // 4. Add text class to the paragraph tag
        const p = innerDiv.querySelector('p');
        if (p) {
          p.classList.add(`${baseName}-text`);
        }
      }

      contentContainer.append(row);
    });
  }

  // Re-assemble the block
  block.replaceChildren(bgRow, contentContainer);
}


// forcing webhook sync