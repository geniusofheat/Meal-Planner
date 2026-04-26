// § PREVIEW MODAL

function openPreview(imgSrc) {
  const modal = document.getElementById('preview-modal');
  const img = document.getElementById('preview-img');
  img.src = imgSrc;
  img.alt = 'Tool preview';
  modal.classList.add('open');
}

function closePreview() {
  const modal = document.getElementById('preview-modal');
  modal.classList.remove('open');
  document.getElementById('preview-img').src = '';
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('preview-close-btn').addEventListener('click', closePreview);

  // Close when clicking outside the box
  document.getElementById('preview-modal').addEventListener('click', function (e) {
    if (e.target === this) closePreview();
  });

  // Wire up all tool title links
  document.querySelectorAll('[data-preview]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openPreview(this.dataset.preview);
    });
  });
});

// END § PREVIEW MODAL
