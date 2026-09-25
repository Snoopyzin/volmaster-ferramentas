/* =========================================================
   Volmaster Ferramentas — interações
   ========================================================= */
(() => {
  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cabeçalho ganha sombra ao rolar ---------- */
  const topo = $('#topo');
  const aoRolar = () => topo.classList.toggle('topo--rolado', window.scrollY > 8);
  aoRolar();
  window.addEventListener('scroll', aoRolar, { passive: true });

  /* ---------- Painéis: menu, busca, carrinho, checkout e detalhes ---------- */
  let painelAberto = null;
  let gatilhoAtual = null;

  function abrePainel(painel, gatilho) {
    if (painelAberto) fechaPainel(painelAberto, false);
    painelAberto = painel;
    gatilhoAtual = gatilho;
    painel.hidden = false;
    document.body.classList.add('travado');
    $$(`[aria-controls="${painel.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'true'));
    requestAnimationFrame(() => {
      painel.classList.add('aberto');
      const foco = $('[data-foco]', painel) || $('input', painel) || $('button, a', painel);
      foco?.focus({ preventScroll: true });
    });
  }

  function fechaPainel(painel = painelAberto, devolveFoco = true) {
    if (!painel) return;
    painel.classList.remove('aberto');
    $$(`[aria-controls="${painel.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    document.body.classList.remove('travado');
    setTimeout(() => { if (!painel.classList.contains('aberto')) painel.hidden = true; }, reduzMovimento ? 0 : 350);
    if (devolveFoco) gatilhoAtual?.focus();
    painelAberto = null;
    painel.dispatchEvent(new CustomEvent('painelfechado'));
  }

  // usado por js/loja.js e js/checkout.js
  window.VolmasterPaineis = {
    abrir: (id, gatilho) => abrePainel(document.getElementById(id), gatilho || document.activeElement),
    fechar: (devolveFoco = true) => fechaPainel(painelAberto, devolveFoco),
  };

  $$('[data-abre]').forEach((botao) => {
    const painel = document.getElementById(botao.dataset.abre);
    botao.addEventListener('click', () => abrePainel(painel, botao));
  });

  $$('.painel').forEach((painel) => {
    $$('[data-fecha]', painel).forEach((el) => el.addEventListener('click', () => fechaPainel(painel)));
    // links internos fecham o painel ao navegar
    painel.addEventListener('click', (e) => {
      if (e.target.closest('a[href^="#"]:not([data-ver])')) fechaPainel(painel, false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (!painelAberto) return;
    if (e.key === 'Escape') { fechaPainel(); return; }
    // mantém o foco dentro do painel
    if (e.key === 'Tab') {
      const focaveis = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="-1"]:focus', painelAberto)
        .filter((el) => el.offsetParent !== null);
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    }
  });

  window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => {
    if (e.matches && painelAberto?.id === 'menu-mobile') fechaPainel(painelAberto, false);
  });

  /* ---------- Busca (cabeçalho e painel mobile) ---------- */
  $$('form[data-busca]').forEach((form) => {
    const campo = $('input[type=search]', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const termo = campo.value.trim();
      if (!termo) return;
      if (form.closest('.painel')) fechaPainel(painelAberto, false);
      window.VolmasterLoja?.buscar(termo);
    });
  });
  $$('.busca__sugestoes button').forEach((b) => {
    b.addEventListener('click', () => {
      const form = $('#busca form');
      $('input', form).value = b.textContent;
      form.requestSubmit();
    });
  });

  /* ---------- Ano no rodapé ---------- */
  $('#ano').textContent = new Date().getFullYear();
})();
