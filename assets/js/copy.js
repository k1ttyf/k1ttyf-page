(function () {
  const toast = document.querySelector('.toast');
  let hideTimer = null;

  const showToast = (text, value) => {
    if (!toast) return;
    toast.textContent = text;
    if (value) {
      const v = document.createElement('span');
      v.className = 'toast-value';
      v.textContent = value;
      toast.append(' ', v);
    }
    toast.classList.add('is-on');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toast.classList.remove('is-on'), 2200);
  };

  const legacyCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.append(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    ta.remove();
    return ok;
  };

  const copy = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {}
    }
    return legacyCopy(text);
  };

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy;
      const label = btn.dataset.copyLabel || 'Текст';
      if (await copy(value)) {
        showToast(label + ' скопирован', value);
      } else {
        showToast('Не удалось скопировать, ник:', value);
      }
    });
  });
})();
