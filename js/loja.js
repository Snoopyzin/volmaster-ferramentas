/* =========================================================
   Volmaster Ferramentas — catálogo, detalhes, filtros, busca e carrinho
   Os dados ficam em js/produtos.js · o checkout fica em js/checkout.js
   ========================================================= */
(() => {
  const { freteGratisAcima = 0, freteFixo = 0, descontoPix = 0, whatsapp } = window.VOLMASTER_CONFIG;
  const CATEGORIAS = window.VOLMASTER_CATEGORIAS;
  const TAREFAS = window.VOLMASTER_TAREFAS;
  const PRODUTOS = window.VOLMASTER_PRODUTOS;
  const categoriaPorId = Object.fromEntries(CATEGORIAS.map((c) => [c.id, c]));
  const tarefaPorId = Object.fromEntries(TAREFAS.map((t) => [t.id, t]));
  const produtoPorId = Object.fromEntries(PRODUTOS.map((p) => [p.id, p]));

  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const moeda = (v) => brl.format(v);
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const normaliza = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const temPreco = (p) => typeof p.preco === 'number';
  const estoque = (p) => p.estoque ?? 999;
  const disponivel = (p) => temPreco(p) && estoque(p) > 0;
  const itensTexto = (n) => `${n} ${n === 1 ? 'item' : 'itens'}`;
  const linkWhats = (texto) => (whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}` : '#');

  // regras comerciais nos textos da página
  $$('[data-frete-texto]').forEach((el) => {
    el.textContent = freteGratisAcima ? `Frete grátis acima de ${moeda(freteGratisAcima).replace(',00', '')}` : 'Enviamos para todo o Brasil';
  });
  $$('[data-whatsapp]').forEach((el) => {
    if (!whatsapp) { el.hidden = true; return; }
    el.href = linkWhats(el.dataset.whatsapp || 'Olá! Vim pelo site da Volmaster Ferramentas.');
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* ---------- Ícones das tarefas ---------- */

  const ICONES = {
    extrator: '<path d="M32 6v40M24 10h16"/><path d="M14 22h36M18 22v18l6 8M46 22v18l-6 8"/><rect x="26" y="46" width="12" height="10" rx="2"/>',
    anel: '<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="12"/><path d="M32 10v6M32 48v6M10 32h6M48 32h6"/>',
    chave: '<path d="M44 10a12 12 0 0 0-15 15L10 44a5 5 0 0 0 7 7l19-19a12 12 0 0 0 15-15l-7 7-6-1-1-6z"/>',
    suporte: '<path d="M8 54h48M16 54V30h32v24M24 30V18h16v12"/><circle cx="32" cy="12" r="5"/>',
    olhal: '<circle cx="32" cy="18" r="10"/><path d="M26 28h12v8H26zM28 36v18M36 36v18M22 54h20"/>',
    bomba: '<rect x="10" y="30" width="22" height="24" rx="3"/><path d="M21 30V18h26M47 18l8-8"/><circle cx="46" cy="42" r="8"/><path d="M46 42l4-4M32 44h6"/>',
  };
  const svgIcone = (nome) => `<svg class="icone" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${ICONES[nome] || ICONES.chave}</svg>`;

  function midia(p, comAlt = true, grande = false) {
    const alt = comAlt ? esc(p.nome) : '';
    if (!p.foto) return `<span class="arte">${svgIcone(tarefaPorId[p.tarefas?.[0]]?.icone)}</span>`;
    const base = `images/produtos/${esc(p.foto)}`;
    return grande
      ? `<img src="${base}.webp" srcset="${base}-p.webp 600w, ${base}.webp 1200w" sizes="(min-width: 900px) 55vw, 100vw" alt="${alt}" decoding="async">`
      : `<img src="${base}-p.webp" alt="${alt}" loading="lazy" decoding="async" width="600" height="273">`;
  }

  function selo(p) {
    if (temPreco(p) && !(estoque(p) > 0)) return '<span class="produto__selo produto__selo--esgotado">Esgotado</span>';
    const desconto = temPreco(p) && p.precoAntigo ? Math.round((1 - p.preco / p.precoAntigo) * 100) : 0;
    if (desconto > 0) return `<span class="produto__selo">-${desconto}%</span>`;
    if (p.selo) return `<span class="produto__selo produto__selo--info">${esc(p.selo)}</span>`;
    return '';
  }

  function preco(p) {
    if (!temPreco(p)) return '<div class="produto__precos"><p class="produto__preco produto__preco--consulta">Preço sob consulta</p><p class="produto__parcela">A gente passa o valor no WhatsApp</p></div>';
    return `<div class="produto__precos">
        ${p.precoAntigo ? `<s><span class="sr-only">de </span>${moeda(p.precoAntigo)}</s>` : ''}
        <p class="produto__preco"><strong>${moeda(p.preco)}</strong></p>
        <p class="produto__parcela">Parcelamos no cartão</p>
      </div>`;
  }

  /* ---------- Carrinho ---------- */

  const CHAVE = 'volmaster-ferramentas:carrinho';
  let carrinho = {};
  try { carrinho = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch { carrinho = {}; }
  for (const id of Object.keys(carrinho)) {
    const p = produtoPorId[id];
    if (!p || !disponivel(p) || !(carrinho[id] > 0)) delete carrinho[id];
    else carrinho[id] = Math.min(carrinho[id], estoque(p));
  }
  const salva = () => { try { localStorage.setItem(CHAVE, JSON.stringify(carrinho)); } catch { /* sem armazenamento: segue só na sessão */ } };

  const unidades = () => Object.values(carrinho).reduce((s, q) => s + q, 0);
  const subtotal = () => Object.entries(carrinho).reduce((s, [id, q]) => s + produtoPorId[id].preco * q, 0);
  // null = frete a combinar
  const frete = (sub = subtotal()) => (!sub ? 0 : freteGratisAcima && sub >= freteGratisAcima ? 0 : freteFixo || null);
  const textoFrete = (f) => (f === null ? 'A combinar' : f ? moeda(f) : 'Grátis');

  function seletorQtd(p, q, extra = '') {
    return `<div class="qtd ${extra}">
        <button type="button" data-f="menos" aria-label="Diminuir quantidade de ${esc(p.nome)}">−</button>
        <input type="number" inputmode="numeric" min="0" max="${estoque(p)}" value="${q}" data-f="qtd" aria-label="Quantidade de ${esc(p.nome)}">
        <button type="button" data-f="mais" aria-label="Aumentar quantidade de ${esc(p.nome)}"${q >= estoque(p) ? ' disabled' : ''}>+</button>
      </div>`;
  }

  function acao(p) {
    if (!temPreco(p)) {
      return `<a class="btn-add btn-add--whats" href="${linkWhats(`Olá! Quero um orçamento da ferramenta ${p.nome}.`)}" target="_blank" rel="noopener">Pedir orçamento<span class="sr-only"> de ${esc(p.nome)} pelo WhatsApp</span></a>`;
    }
    if (!(estoque(p) > 0)) return '<button class="btn-add" type="button" disabled>Esgotado</button>';
    if (carrinho[p.id]) return seletorQtd(p, carrinho[p.id]);
    return `<button class="btn-add" type="button" data-f="add">Adicionar ao carrinho<span class="sr-only">: ${esc(p.nome)}</span></button>`;
  }

  function cartao(p) {
    const link = `href="#produto=${p.id}" data-ver="${p.id}"`;
    return `<article class="produto" data-id="${p.id}">
      <a class="produto__midia" ${link} tabindex="-1" aria-hidden="true">${midia(p, false)}${selo(p)}</a>
      <div class="produto__info">
        <p class="produto__ref">${esc(categoriaPorId[p.categoria]?.nome || '')}</p>
        <h3 class="produto__nome"><a ${link}>${esc(p.nome)}</a></h3>
        ${p.tipo ? `<p class="produto__tipo">${esc(p.tipo)}</p>` : ''}
        ${preco(p)}
        <div class="produto__acao" data-id="${p.id}">${acao(p)}</div>
      </div>
    </article>`;
  }

  // recoloca o foco no controle equivalente depois de redesenhar
  const FOCO_ALTERNATIVO = { add: 'mais', mais: 'menos', menos: 'add', qtd: 'add', remover: null };
  function comFoco(raiz, desenha) {
    const ativo = document.activeElement;
    const papel = ativo && raiz.contains(ativo) ? ativo.dataset.f : null;
    const id = papel ? ativo.closest('[data-id]')?.dataset.id : null;
    desenha();
    if (!papel || !id) return;
    const alvo = $(`[data-id="${id}"] [data-f="${papel}"]:not([disabled])`, raiz) || $(`[data-id="${id}"] [data-f="${FOCO_ALTERNATIVO[papel]}"]`, raiz);
    (alvo || $('[data-foco]', raiz.closest('.painel') || document) || raiz).focus?.();
  }

  function atualizaAcoes(id) {
    const p = produtoPorId[id];
    $$(`.produto__acao[data-id="${id}"]`).forEach((el) => comFoco(el, () => { el.innerHTML = acao(p); }));
  }

  const toast = $('#toast');
  let toastTempo;
  function mostraToast(msg) {
    toast.textContent = msg;
    toast.classList.add('visivel');
    clearTimeout(toastTempo);
    toastTempo = setTimeout(() => toast.classList.remove('visivel'), 3200);
  }

  function defineQtd(id, qtd) {
    const p = produtoPorId[id];
    if (!disponivel(p)) return;
    const antes = carrinho[id] || 0;
    const gratisAntes = freteGratisAcima && subtotal() >= freteGratisAcima;
    qtd = Math.max(0, Math.min(estoque(p), Math.floor(Number(qtd)) || 0));
    if (qtd === antes) { atualizaAcoes(id); atualizaCarrinho(); return; }
    if (qtd) carrinho[id] = qtd; else delete carrinho[id];
    salva();
    atualizaAcoes(id);
    atualizaCarrinho();

    const sub = subtotal();
    const gratis = freteGratisAcima && sub >= freteGratisAcima;
    if (freteGratisAcima && !gratisAntes && gratis) mostraToast('Frete grátis liberado!');
    else if (!antes && qtd) {
      mostraToast(freteGratisAcima && !gratis
        ? `Adicionado! Faltam ${moeda(freteGratisAcima - sub)} para o frete grátis.`
        : 'Adicionado ao carrinho.');
    } else if (qtd === estoque(p) && qtd > antes) mostraToast(`Temos só ${estoque(p)} em estoque.`);
  }

  /* ---------- Painel do carrinho ---------- */

  const botaoCarrinho = $('.topo__carrinho');
  const contador = $('.topo__contador');
  const lista = $('#carrinho-lista');
  const vazio = $('#carrinho-vazio');
  const caixaFrete = $('#carrinho-frete-box');
  const barra = $('#carrinho-barra');
  const textoProgresso = $('#carrinho-progresso');
  const campoSubtotal = $('#carrinho-subtotal');
  const campoFrete = $('#carrinho-frete');
  const campoTotal = $('#carrinho-total');
  const campoPix = $('#carrinho-pix');
  const finalizar = $('#carrinho-finalizar');
  const esvaziar = $('#carrinho-esvaziar');

  function itemCarrinho(id, q) {
    const p = produtoPorId[id];
    return `<li class="item" data-id="${id}">
      <div class="item__midia">${midia(p, false)}</div>
      <div class="item__info">
        <p class="item__nome">${esc(p.nome)}</p>
        <p class="item__un">${moeda(p.preco)} / un.</p>
        <div class="item__linha">${seletorQtd(p, q, 'qtd--mini')}<strong>${moeda(p.preco * q)}</strong></div>
      </div>
      <button class="item__remover" type="button" data-f="remover" aria-label="Remover ${esc(p.nome)} do carrinho">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
    </li>`;
  }

  function atualizaCarrinho() {
    const itens = Object.entries(carrinho);
    const un = unidades();
    const sub = subtotal();
    const f = frete(sub);
    const t = sub + (f || 0);

    contador.hidden = !un;
    contador.textContent = un > 99 ? '99+' : un;
    botaoCarrinho.setAttribute('aria-label', un ? `Abrir carrinho (${itensTexto(un)})` : 'Abrir carrinho');

    caixaFrete.hidden = !freteGratisAcima || !itens.length;
    if (freteGratisAcima) {
      barra.style.width = `${Math.min(100, (sub / freteGratisAcima) * 100)}%`;
      barra.parentElement.classList.toggle('completa', sub >= freteGratisAcima);
      textoProgresso.innerHTML = sub >= freteGratisAcima
        ? '<strong>Frete grátis garantido!</strong>'
        : `Faltam <strong>${moeda(freteGratisAcima - sub)}</strong> para o frete grátis.`;
    }

    comFoco(lista, () => { lista.innerHTML = itens.map(([id, q]) => itemCarrinho(id, q)).join(''); });
    vazio.hidden = itens.length > 0;
    campoSubtotal.textContent = moeda(sub);
    campoFrete.textContent = itens.length ? textoFrete(f) : '—';
    campoTotal.textContent = moeda(t);
    campoPix.textContent = itens.length && descontoPix ? `ou ${moeda(t - sub * descontoPix / 100)} no Pix (${descontoPix}% off)` : '';
    finalizar.disabled = !itens.length;
    esvaziar.hidden = !itens.length;
  }

  finalizar.addEventListener('click', () => {
    if (Object.keys(carrinho).length) window.VolmasterCheckout?.abrir();
  });

  esvaziar.addEventListener('click', () => {
    if (!window.confirm('Remover todos os produtos do carrinho?')) return;
    const ids = Object.keys(carrinho);
    carrinho = {};
    salva();
    ids.forEach(atualizaAcoes);
    atualizaCarrinho();
    $('[data-foco]', $('#carrinho'))?.focus();
  });

  // cliques e digitação em qualquer seletor de quantidade (cards, detalhes e carrinho)
  document.addEventListener('click', (e) => {
    const alvo = e.target.closest('[data-f]');
    const id = alvo?.closest('[data-id]')?.dataset.id;
    if (!id || !produtoPorId[id]) return;
    const q = carrinho[id] || 0;
    switch (alvo.dataset.f) {
      case 'add': defineQtd(id, 1); break;
      case 'mais': defineQtd(id, q + 1); break;
      case 'menos': defineQtd(id, q - 1); break;
      case 'remover': defineQtd(id, 0); break;
      default:
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target.dataset?.f !== 'qtd') return;
    const id = e.target.closest('[data-id]')?.dataset.id;
    if (id) defineQtd(id, e.target.value);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.dataset?.f === 'qtd') e.target.blur();
  });

  /* ---------- Detalhes do produto ---------- */

  const detalhe = $('#detalhe');
  const conteudoDetalhe = $('#detalhe-conteudo');

  function textoDetalhe(p) {
    const secao = (titulo, corpo) => `<section class="detalhe__secao"><h3>${esc(titulo)}</h3>${corpo}</section>`;
    const tarefas = (p.tarefas || []).map((id) => tarefaPorId[id]).filter(Boolean);
    const duvida = whatsapp
      ? `<a class="detalhe__duvida" href="${linkWhats(`Olá! Tenho uma dúvida sobre a ferramenta ${p.nome}.`)}" target="_blank" rel="noopener">Ficou na dúvida se serve no seu motor? Manda uma mensagem que a gente confere <span aria-hidden="true">→</span></a>`
      : '';
    return [
      p.resumo && `<p class="detalhe__resumo">${esc(p.resumo)}</p>`,
      tarefas.length && `<div class="detalhe__tarefas"><span>Ajuda a:</span> ${tarefas.map((t) => `<button type="button" class="chip chip--mini" data-tarefa="${t.id}">${esc(t.titulo)}</button>`).join(' ')}</div>`,
      p.aplicacao && secao('Aplicação', `<p>${esc(p.aplicacao)}</p>`),
      p.destaques?.length && secao('Destaques', `<ul class="detalhe__lista">${p.destaques.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`),
      secao('Especificações', `<dl class="detalhe__specs">${[['Categoria', categoriaPorId[p.categoria]?.nome], ...(p.specs || [])].filter(([, v]) => v).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`),
      duvida,
    ].filter(Boolean).join('');
  }

  function abreDetalhe(id, gatilho) {
    const p = produtoPorId[id];
    if (!p) return;
    const restam = temPreco(p) && p.estoque > 0 && p.estoque <= 5 ? `<p class="detalhe__estoque">Restam só ${p.estoque} unidades</p>` : '';
    conteudoDetalhe.innerHTML = `
      <div class="detalhe__midia">${midia(p, true, true)}${selo(p)}</div>
      <div class="detalhe__info">
        <h2 class="detalhe__nome" id="detalhe-nome">${esc(p.nome)}</h2>
        ${p.tipo ? `<p class="detalhe__tipo">${esc(p.tipo)}</p>` : ''}
        <div class="detalhe__compra">
          ${preco(p)}
          ${restam}
          <div class="produto__acao" data-id="${p.id}">${acao(p)}</div>
        </div>
        <div class="detalhe__texto">${textoDetalhe(p)}</div>
      </div>`;
    conteudoDetalhe.scrollTop = 0;
    window.VolmasterPaineis.abrir('detalhe', gatilho);
    history.replaceState(null, '', `#produto=${id}`);
  }

  detalhe.addEventListener('painelfechado', () => {
    if (location.hash.startsWith('#produto=')) history.replaceState(null, '', location.pathname + location.search);
  });

  // link direto para um produto (ex.: index.html#produto=vm-23)
  document.addEventListener('DOMContentLoaded', () => {
    const achado = location.hash.match(/^#produto=([\w-]+)$/);
    if (achado && produtoPorId[achado[1]]) abreDetalhe(achado[1]);
  });

  /* ---------- Tarefas, ofertas e catálogo ---------- */

  const estado = { categoria: 'todos', tarefa: null, busca: '', ordem: 'relevancia' };
  const catalogo = $('#catalogo');
  const grade = $('#grade-catalogo');
  const contagem = $('#catalogo-contagem');
  const ativos = $('#filtros-ativos');
  const ordem = $('#catalogo-ordem');

  // "ordem de serviço": cada linha filtra o catálogo pela tarefa
  $('#lista-tarefas').innerHTML = TAREFAS.map((t, i) => {
    const qtd = PRODUTOS.filter((p) => p.tarefas?.includes(t.id)).length;
    return `<li>
      <button class="tarefa" type="button" data-tarefa="${t.id}" aria-pressed="false">
        <span class="tarefa__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span class="tarefa__check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span>
        <span class="tarefa__texto"><strong>${esc(t.titulo)}</strong><span>${esc(t.texto)}</span></span>
        <span class="tarefa__qtd">${qtd} ${qtd === 1 ? 'ferramenta' : 'ferramentas'} <span aria-hidden="true">→</span></span>
      </button>
    </li>`;
  }).join('');

  $('#filtros-categorias').innerHTML = [{ id: 'todos', nome: 'Todas' }, ...CATEGORIAS]
    .map((c) => `<button class="chip" type="button" data-categoria="${c.id}" aria-pressed="${c.id === 'todos'}">${esc(c.nome)}</button>`).join('');

  const ofertas = PRODUTOS.filter((p) => disponivel(p) && p.precoAntigo);
  $('#grade-ofertas').innerHTML = ofertas.map(cartao).join('');
  $('#ofertas-faixa').hidden = !ofertas.length;

  const indice = Object.fromEntries(PRODUTOS.map((p) => [p.id, {
    principal: normaliza([p.nome, p.tipo, categoriaPorId[p.categoria]?.nome, ...(p.tarefas || []).map((t) => tarefaPorId[t]?.titulo)].filter(Boolean).join(' ')),
    extra: normaliza([p.resumo, p.aplicacao, ...(p.destaques || [])].filter(Boolean).join(' ')),
  }]));

  function filtrados() {
    const termos = normaliza(estado.busca).split(/\s+/).filter(Boolean);
    const lista = PRODUTOS
      .filter((p) => (estado.categoria === 'todos' || p.categoria === estado.categoria)
        && (!estado.tarefa || p.tarefas?.includes(estado.tarefa)))
      .map((p, i) => {
        if (!termos.length) return { p, i, nota: 1 };
        const { principal, extra } = indice[p.id];
        if (termos.every((t) => principal.includes(t))) return { p, i, nota: 2 };
        if (termos.every((t) => principal.includes(t) || extra.includes(t))) return { p, i, nota: 1 };
        return { p, i, nota: 0 };
      })
      .filter((r) => r.nota > 0);

    const semPreco = (p) => (disponivel(p) ? 0 : 1);
    const criterios = {
      relevancia: (a, b) => b.nota - a.nota || a.i - b.i,
      menor: (a, b) => semPreco(a.p) - semPreco(b.p) || (a.p.preco ?? 0) - (b.p.preco ?? 0) || a.i - b.i,
      maior: (a, b) => semPreco(a.p) - semPreco(b.p) || (b.p.preco ?? 0) - (a.p.preco ?? 0) || a.i - b.i,
    };
    return lista.sort(criterios[estado.ordem]).map((r) => r.p);
  }

  function desenhaCatalogo() {
    const itens = filtrados();
    grade.innerHTML = itens.length
      ? itens.map(cartao).join('')
      : `<div class="vazio">
          <p>Nenhuma ferramenta encontrada${estado.busca ? ` para “${esc(estado.busca)}”` : ' com esses filtros'}.</p>
          <p>Não achou o que precisa? Fabricamos sob medida.</p>
          <div class="vazio__acoes">
            <button class="chip" type="button" data-limpar>Ver todas as ferramentas</button>
            ${whatsapp ? `<a class="chip chip--whats" href="${linkWhats(`Olá! Procuro uma ferramenta${estado.busca ? ` para: ${estado.busca}` : ''}.`)}" target="_blank" rel="noopener">Perguntar no WhatsApp</a>` : ''}
          </div>
        </div>`;
    contagem.textContent = `${itens.length} ${itens.length === 1 ? 'ferramenta' : 'ferramentas'}`;

    $$('[data-categoria]', catalogo).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.categoria === estado.categoria)));
    $$('.tarefa').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tarefa === estado.tarefa)));

    const chips = [];
    if (estado.tarefa) chips.push(`<button class="chip chip--ativo" type="button" data-tirar="tarefa">${esc(tarefaPorId[estado.tarefa].titulo)}<span aria-hidden="true">×</span><span class="sr-only"> — remover filtro</span></button>`);
    if (estado.busca) chips.push(`<button class="chip chip--ativo" type="button" data-tirar="busca">“${esc(estado.busca)}”<span aria-hidden="true">×</span><span class="sr-only"> — limpar busca</span></button>`);
    ativos.innerHTML = chips.join('');
  }

  const irParaCatalogo = () => catalogo.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  ordem.addEventListener('change', () => { estado.ordem = ordem.value; desenhaCatalogo(); });

  document.addEventListener('click', (e) => {
    const ver = e.target.closest('[data-ver]');
    const categoria = e.target.closest('[data-categoria]');
    const tarefa = e.target.closest('[data-tarefa]');
    const tirar = e.target.closest('[data-tirar]');
    if (ver) {
      e.preventDefault();
      abreDetalhe(ver.dataset.ver, ver.closest('.produto')?.querySelector('.produto__nome a') || ver);
    } else if (categoria) {
      estado.categoria = categoria.dataset.categoria;
      // links do menu começam uma navegação limpa
      if (!catalogo.contains(categoria)) { estado.tarefa = null; estado.busca = ''; }
      desenhaCatalogo();
    } else if (tarefa) {
      const id = tarefa.dataset.tarefa;
      estado.tarefa = estado.tarefa === id && tarefa.classList.contains('tarefa') ? null : id;
      estado.categoria = 'todos';
      estado.busca = '';
      desenhaCatalogo();
      if (detalhe.classList.contains('aberto')) window.VolmasterPaineis.fechar(false);
      irParaCatalogo();
    } else if (tirar) {
      estado[tirar.dataset.tirar] = tirar.dataset.tirar === 'tarefa' ? null : '';
      desenhaCatalogo();
      $('[data-categoria="todos"]', catalogo).focus();
    } else if (e.target.closest('[data-limpar]')) {
      Object.assign(estado, { categoria: 'todos', tarefa: null, busca: '' });
      desenhaCatalogo();
      $('[data-categoria="todos"]', catalogo).focus();
    }
  });

  // usado pela busca (js/script.js) e pelo checkout (js/checkout.js)
  window.VolmasterLoja = {
    buscar(termo) {
      Object.assign(estado, { categoria: 'todos', tarefa: null, busca: termo.trim() });
      desenhaCatalogo();
      irParaCatalogo();
    },
    itens: () => Object.entries(carrinho).map(([id, qtd]) => ({ produto: produtoPorId[id], qtd })),
    subtotal,
    frete,
    textoFrete,
    midia,
    moeda,
    esc,
    mostraToast,
    limpar() {
      const ids = Object.keys(carrinho);
      carrinho = {};
      salva();
      ids.forEach(atualizaAcoes);
      atualizaCarrinho();
    },
  };

  desenhaCatalogo();
  atualizaCarrinho();
})();
