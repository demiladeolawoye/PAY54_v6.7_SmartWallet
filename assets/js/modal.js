// modal.js – universal modal controller

(function () {
  const layer = document.getElementById("modalLayer");
  const titleEl = document.getElementById("modalTitle");
  const bodyEl = document.getElementById("modalBody");

  function openModal(title, bodyHtml) {
    if (!layer) return;
    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    layer.classList.remove("hidden");
    layer.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!layer) return;
    layer.classList.add("hidden");
    layer.setAttribute("aria-hidden", "true");
    bodyEl.innerHTML = "";
  }

  layer?.addEventListener("click", (e) => {
    if (e.target === layer || e.target.dataset.close !== undefined) {
      closeModal();
    }
  });

  window.pay54Modal = { openModal, closeModal };
})();

