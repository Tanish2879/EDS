import { loadScript } from './aem.js';

// Load Universal Editor communication library
async function loadUniversalEditor() {
  if (window.location.hostname.includes('adobeaemcloud.com') || window.location.search.includes('ueditor')) {
    await loadScript('https://universal-editor-service.adobe.io/cors.js');
  }
}

// Handle real-time updates sent from Universal Editor properties rail
function handleEditorUpdates() {
  document.addEventListener('aue:ui-select', () => {
    // Optional: hook for when author clicks an element
    // e.detail contains selected component information
  });

  document.addEventListener('aue:content-patch', (e) => {
    // Fired when an author types into an input field or replaces an image
    const { patch } = e.detail;
    if (!patch) return;

    // Apply patch updates directly to the targeted DOM element
    const target = document.querySelector(`[data-aue-resource="${patch.resource}"] [data-aue-prop="${patch.prop}"]`);
    if (target) {
      if (target.tagName.toLowerCase() === 'img') {
        target.src = patch.value;
      } else {
        target.innerHTML = patch.value;
      }
    }
  });

  document.addEventListener('aue:ui-preview', () => {
    // Fired when switching between edit mode and preview mode
  });
}

// Automatically instrument blocks if they lack instrumentation attributes
// eslint-disable-next-line import/prefer-default-export
export function initEditorSupport() {
  loadUniversalEditor();
  handleEditorUpdates();
}

initEditorSupport();
