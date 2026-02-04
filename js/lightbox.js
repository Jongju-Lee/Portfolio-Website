/* ############### Custom Lightbox - UIkit 대체 구현 ############### */

const CustomLightbox = (function () {
  // DOM Elements
  let overlay = null;
  let contentContainer = null;
  let closeBtn = null;
  let prevBtn = null;
  let nextBtn = null;
  let captionEl = null;

  // State
  let items = [];
  let currentIndex = 0;
  let isOpen = false;

  // Create Lightbox DOM Structure
  function createLightbox() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = `
      <div class="lightbox__backdrop"></div>
      <div class="lightbox__content">
        <div class="lightbox__media"></div>
      </div>
      <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="이전">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="다음">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 6 15 12 9 18"></polyline>
        </svg>
      </button>
      <div class="lightbox__caption"></div>
      <button class="lightbox__close" type="button">뒤로 가기</button>
    `;

    document.body.appendChild(overlay);

    // Cache elements
    contentContainer = overlay.querySelector('.lightbox__media');
    closeBtn = overlay.querySelector('.lightbox__close');
    prevBtn = overlay.querySelector('.lightbox__nav--prev');
    nextBtn = overlay.querySelector('.lightbox__nav--next');
    captionEl = overlay.querySelector('.lightbox__caption');

    // Event Listeners
    overlay.querySelector('.lightbox__backdrop').addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Keyboard Navigation
    document.addEventListener('keydown', handleKeydown);
  }

  // Handle Keyboard Events
  function handleKeydown(e) {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowLeft':
        if (items.length > 1) showPrev();
        break;
      case 'ArrowRight':
        if (items.length > 1) showNext();
        break;
    }
  }

  // Open Lightbox
  function open(triggerElement) {
    createLightbox();

    // Find parent container with data-lightbox
    const container = triggerElement.closest('[data-lightbox]');
    if (!container) return;

    // Collect all items in this container
    items = Array.from(container.querySelectorAll('a[href]'));
    currentIndex = items.indexOf(triggerElement);
    if (currentIndex === -1) currentIndex = 0;

    // Show/Hide navigation based on item count
    const isMultiple = items.length > 1;
    prevBtn.style.display = isMultiple ? '' : 'none';
    nextBtn.style.display = isMultiple ? '' : 'none';
    captionEl.style.display = isMultiple ? '' : 'none';

    // Load content
    loadContent(currentIndex);

    // Show overlay
    isOpen = true;
    overlay.classList.add('lightbox--visible');
    document.body.style.overflow = 'hidden';

    // Close button animation
    closeBtn.classList.add('lightbox__close--attention');
    setTimeout(() => {
      closeBtn.classList.remove('lightbox__close--attention');
    }, 2300);
  }

  // Close Lightbox
  function close() {
    if (!overlay || !isOpen) return;

    isOpen = false;
    overlay.classList.remove('lightbox--visible');
    document.body.style.overflow = '';

    // Clear content after animation
    setTimeout(() => {
      contentContainer.innerHTML = '';
      items = [];
      currentIndex = 0;
    }, 300);
  }

  // Load Content
  function loadContent(index) {
    const item = items[index];
    if (!item) return;

    const href = item.getAttribute('href');
    const type = item.getAttribute('data-type') || 'image';
    const caption = item.getAttribute('data-caption') || '';

    // Fade out animation
    contentContainer.classList.add('lightbox__media--loading');

    setTimeout(() => {
      // Clear previous content
      contentContainer.innerHTML = '';

      if (type === 'iframe') {
        const iframe = document.createElement('iframe');
        iframe.src = href;
        iframe.className = 'lightbox__iframe';
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('loading', 'lazy');
        contentContainer.appendChild(iframe);
      } else {
        const img = document.createElement('img');
        img.src = href;
        img.className = 'lightbox__image';
        img.alt = item.querySelector('img')?.alt || '';
        contentContainer.appendChild(img);
      }

      // Update caption
      captionEl.textContent = caption;

      currentIndex = index;

      // Fade in animation
      setTimeout(() => {
        contentContainer.classList.remove('lightbox__media--loading');
      }, 50);
    }, 300);
  }

  // Show Previous
  function showPrev() {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    loadContent(newIndex);
  }

  // Show Next
  function showNext() {
    const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    loadContent(newIndex);
  }

  // Initialize - Attach click handlers to all lightbox triggers
  function init() {
    document.querySelectorAll('[data-lightbox]').forEach(container => {
      container.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          open(this);
        });
      });
    });
  }

  // Public API
  return {
    init: init,
    open: open,
    close: close
  };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
  CustomLightbox.init();
});
