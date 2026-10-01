/* =========================================================
   Volmaster Ferramentas — checkout
   Coleta dados, entrega e forma de pagamento, calcula o total e envia
   o pedido para o WhatsApp da loja (CONFIG.whatsapp em js/produtos.js).
   Produtos com atendimento: 'suporte' vão para o CONFIG.whatsappSuporte;
   se o carrinho misturar os dois, o pedido é dividido em duas mensagens.
   Para cobrar online (Pix automático, cartão), troque enviaPedido()
   pela chamada ao gateway de pagamento (Mercado Pago, Pagar.me etc.).
   ========================================================= */
(() => {
  const { whatsapp, whatsappSuporte, descontoPix = 0 } = window.VOLMASTER_CONFIG;
  const loja = window.VolmasterLoja;
  const { moeda, esc } = loja;
  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];
  const conteudo = $('#checkout-conteudo');
  const CHAVE_DADOS = 'volmaster-ferramentas:cliente';

  const digitos = (t) => String(t).replace(/\D/g, '');
  const MASCARAS = {
    telefone: (v) => { const d = digitos(v).slice(0, 11); return d.length <= 10 ? d.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (_, a, b, c) => [a && `(${a}`, a.length === 2 && ') ', b, c && `-${c}`].filter(Boolean).join('')) : d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3'); },
    // CPF até 11 números, CNPJ de 12 a 14
    cpf: (v) => {
      const d = digitos(v).slice(0, 14);
      return d.length <= 11
        ? d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        : d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
    },
    cep: (v) => digitos(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2'),
  };

  function cpfValido(v) {
    const d = digitos(v);
    if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
    const dv = (n) => { const s = [...d.slice(0, n)].reduce((acc, c, i) => acc + Number(c) * (n + 1 - i), 0); return ((s * 10) % 11) % 10; };
    return dv(9) === Number(d[9]) && dv(10) === Number(d[10]);
  }

  function cnpjValido(v) {
    const d = digitos(v);
    if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
    const dv = (n) => { const s = [...d.slice(0, n)].reduce((acc, c, i) => acc + Number(c) * ((n - 1 - i) % 8 + 2), 0); const r = s % 11; return r < 2 ? 0 : 11 - r; };
    return dv(12) === Number(d[12]) && dv(13) === Number(d[13]);
  }

  const documentoValido = (v) => cpfValido(v) || cnpjValido(v);

  let dadosSalvos = {};
  try { dadosSalvos = JSON.parse(localStorage.getItem(CHAVE_DADOS)) || {}; } catch { dadosSalvos = {}; }
  const valor = (nome) => esc(dadosSalvos[nome] || '');

  const campo = (nome, rotulo, attrs = '', classe = '') => `
    <label class="campo ${classe}">
      <span>${rotulo}</span>
      <input name="${nome}" value="${valor(nome)}" ${attrs}>
      <small class="campo__erro" aria-live="polite"></small>
    </label>`;

  const UFS = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ');

  function totais(pagamento, itens = loja.itens()) {
    const sub = itens.reduce((s, { produto: p, qtd }) => s + p.preco * qtd, 0);
    const frete = loja.frete(sub);
    const desconto = pagamento === 'pix' ? sub * descontoPix / 100 : 0;
    return { sub, frete, desconto, total: sub + (frete || 0) - desconto };
  }

  function resumo(pagamento) {
    const { sub, frete, desconto, total } = totais(pagamento);
    return `
      <ul class="resumo__itens">
        ${loja.itens().map(({ produto: p, qtd }) => `
          <li>
            <span class="resumo__midia">${loja.midia(p, false)}<span class="resumo__qtd">${qtd}</span></span>
            <span class="resumo__nome">${esc(p.nome)}</span>
            <span class="resumo__valor">${moeda(p.preco * qtd)}</span>
          </li>`).join('')}
      </ul>
      <div class="carrinho__linha"><span>Subtotal</span><span>${moeda(sub)}</span></div>
      <div class="carrinho__linha"><span>Frete</span><span>${loja.textoFrete(frete)}</span></div>
      ${desconto ? `<div class="carrinho__linha carrinho__linha--desconto"><span>Desconto Pix (${descontoPix}%)</span><span>− ${moeda(desconto)}</span></div>` : ''}
      <div class="carrinho__total"><span>Total${frete === null ? ' <small>+ frete</small>' : ''}</span><strong>${moeda(total)}</strong></div>
      ${frete === null ? '<p class="checkout__nota">O frete é calculado pelo CEP e confirmado no WhatsApp antes do pagamento.</p>' : ''}`;
  }

  function formulario() {
    const pag = dadosSalvos.pagamento || 'pix';
    return `
      <form class="checkout__form" id="checkout-form" novalidate>
        <div class="checkout__campos">
          <fieldset class="etapa">
            <legend><span class="etapa__num">1</span> Seus dados</legend>
            <div class="grade-campos">
              ${campo('nome', 'Nome completo', 'required autocomplete="name" minlength="5"', 'campo--inteiro')}
              ${campo('telefone', 'WhatsApp', 'required type="tel" inputmode="tel" autocomplete="tel-national" data-mascara="telefone" placeholder="(00) 00000-0000"')}
              ${campo('cpf', 'CPF ou CNPJ', 'required inputmode="numeric" data-mascara="cpf" placeholder="CPF ou CNPJ"')}
              ${campo('email', 'E-mail', 'required type="email" autocomplete="email"', 'campo--inteiro')}
            </div>
          </fieldset>

          <fieldset class="etapa">
            <legend><span class="etapa__num">2</span> Entrega</legend>
            <div class="grade-campos">
              ${campo('cep', 'CEP', 'required inputmode="numeric" autocomplete="postal-code" data-mascara="cep" placeholder="00000-000"')}
              <p class="campo__ajuda" id="cep-status" aria-live="polite"></p>
              ${campo('rua', 'Rua / avenida / rodovia', 'required autocomplete="address-line1"', 'campo--inteiro')}
              ${campo('numero', 'Número', 'required inputmode="numeric" placeholder="ou s/n"')}
              ${campo('complemento', 'Complemento (opcional)', 'placeholder="Posto, galpão, aos cuidados de…"')}
              ${campo('bairro', 'Bairro', 'required')}
              ${campo('cidade', 'Cidade', 'required autocomplete="address-level2"')}
              <label class="campo">
                <span>Estado</span>
                <select name="uf" required autocomplete="address-level1">
                  <option value="">UF</option>
                  ${UFS.map((uf) => `<option${dadosSalvos.uf === uf ? ' selected' : ''}>${uf}</option>`).join('')}
                </select>
                <small class="campo__erro" aria-live="polite"></small>
              </label>
            </div>
          </fieldset>

          <fieldset class="etapa">
            <legend><span class="etapa__num">3</span> Pagamento</legend>
            <div class="pagamentos">
              <label class="pagamento">
                <input type="radio" name="pagamento" value="pix"${pag === 'pix' ? ' checked' : ''}>
                <span class="pagamento__titulo">Pix${descontoPix ? ` <em>${descontoPix}% off</em>` : ''}</span>
                <span class="pagamento__texto">Aprovação na hora. Enviamos o código Pix no seu WhatsApp.</span>
              </label>
              <label class="pagamento">
                <input type="radio" name="pagamento" value="cartao"${pag === 'cartao' ? ' checked' : ''}>
                <span class="pagamento__titulo">Cartão de crédito</span>
                <span class="pagamento__texto">Parcelado. As condições a gente passa no WhatsApp junto com o link de pagamento.</span>
              </label>
            </div>
          </fieldset>
        </div>

        <aside class="checkout__resumo" aria-labelledby="resumo-titulo">
          <h3 id="resumo-titulo">Resumo do pedido</h3>
          <div id="checkout-resumo"></div>
          <button class="btn btn--primario checkout__confirmar" type="submit">Confirmar pedido</button>
          <p class="checkout__seguro">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
            Seus dados são usados só para entregar o pedido.
          </p>
        </aside>
      </form>`;
  }

  /* ---------- Comportamento do formulário ---------- */

  function atualizaPagamento(form) {
    const pag = form.pagamento.value;
    $('#checkout-resumo', form).innerHTML = resumo(pag);
  }

  let ultimoCep = '';
  async function buscaCep(form) {
    const cep = digitos(form.cep.value);
    const status = $('#cep-status', form);
    if (cep.length !== 8 || cep === ultimoCep) return;
    ultimoCep = cep;
    status.textContent = 'Buscando endereço…';
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await resp.json();
      if (dados.erro) throw new Error('CEP não encontrado');
      if (digitos(form.cep.value) !== cep) return;
      form.rua.value = dados.logradouro || form.rua.value;
      form.bairro.value = dados.bairro || form.bairro.value;
      form.cidade.value = dados.localidade || '';
      form.uf.value = dados.uf || '';
      status.textContent = `${dados.localidade}/${dados.uf}`;
      (dados.logradouro ? form.numero : form.rua).focus();
    } catch {
      status.textContent = 'Não achamos esse CEP. Preencha o endereço manualmente.';
    }
  }

  const MENSAGENS = {
    nome: 'Informe seu nome completo.',
    telefone: 'Informe um WhatsApp com DDD.',
    cpf: 'CPF ou CNPJ inválido.',
    email: 'Informe um e-mail válido.',
    cep: 'CEP deve ter 8 números.',
  };

  function validaCampo(el) {
    let erro = '';
    if (el.name === 'telefone' && digitos(el.value).length < 10) erro = MENSAGENS.telefone;
    else if (el.name === 'cpf' && !documentoValido(el.value)) erro = MENSAGENS.cpf;
    else if (el.name === 'cep' && digitos(el.value).length !== 8) erro = MENSAGENS.cep;
    else if (!el.checkValidity()) erro = MENSAGENS[el.name] || 'Preencha este campo.';
    el.setCustomValidity(erro);
    el.setAttribute('aria-invalid', String(Boolean(erro)));
    const aviso = el.closest('.campo')?.querySelector('.campo__erro');
    if (aviso) aviso.textContent = erro;
    return !erro;
  }

  function prepara(form) {
    atualizaPagamento(form);
    form.addEventListener('input', (e) => {
      const tipo = e.target.dataset.mascara;
      if (tipo) e.target.value = MASCARAS[tipo](e.target.value);
      if (e.target.name === 'cep') buscaCep(form);
      if (e.target.getAttribute('aria-invalid') === 'true') validaCampo(e.target);
    });
    form.addEventListener('focusout', (e) => { if (e.target.matches('input:not([type=radio]), select') && e.target.value) validaCampo(e.target); });
    form.addEventListener('change', (e) => { if (e.target.name === 'pagamento') atualizaPagamento(form); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const campos = $$('input:not([type=radio]), select', form).filter((el) => el.name);
      const invalidos = campos.filter((el) => !validaCampo(el));
      if (invalidos.length) { invalidos[0].focus(); return; }
      enviaPedido(form);
    });
  }

  /* ---------- Envio do pedido ---------- */

  const NOMES_PAGAMENTO = { pix: 'Pix', cartao: 'Cartão de crédito' };

  // cada produto vai para o WhatsApp do seu atendimento (loja ou Volmaster Suporte)
  const DESTINOS = {
    loja: { numero: whatsapp, nome: 'Volmaster Ferramentas' },
    suporte: { numero: whatsappSuporte || whatsapp, nome: 'Volmaster Suporte' },
  };
  const destinoDe = (p) => (p.atendimento === 'suporte' ? 'suporte' : 'loja');
  const linkPedido = (numero, mensagem) => `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  function enviaPedido(form) {
    const dados = Object.fromEntries(new FormData(form));
    const pagamento = dados.pagamento === 'cartao'
      ? `${NOMES_PAGAMENTO.cartao} (parcelado — combinar as condições)`
      : NOMES_PAGAMENTO[dados.pagamento];

    // o WhatsApp só recebe texto: vai o link da página de prévia do produto
    // (produto/<id>.html, gerada por ferramentas/gerar-previas.py), que ele mostra com foto e nome
    const previa = (p) => (/^https?:/.test(location.protocol) ? new URL(`produto/${p.id}.html`, location.href).href : null);
    const endereco = `${dados.rua}, ${dados.numero}${dados.complemento ? ` (${dados.complemento})` : ''} — ${dados.bairro}, ${dados.cidade}/${dados.uf} — CEP ${dados.cep}`;

    function mensagemDe(itens) {
      const { sub, frete, desconto, total } = totais(dados.pagamento, itens);
      const linhas = itens.flatMap(({ produto: p, qtd }) => [`• ${qtd}x ${p.nome} — ${moeda(p.preco * qtd)}`, previa(p) && `  Ver a peça: ${previa(p)}`]).filter(Boolean);
      const titulo = itens.length === 1 ? itens[0].produto.nome : `${itens.length} ferramentas`;
      const mensagem = [
        `*Novo pedido — ${titulo}*`,
        '',
        ...linhas,
        '',
        `Subtotal: ${moeda(sub)}`,
        `Frete: ${loja.textoFrete(frete)}`,
        desconto ? `Desconto Pix: − ${moeda(desconto)}` : null,
        `*Total: ${moeda(total)}${frete === null ? ' + frete' : ''}*`,
        `Pagamento: ${pagamento}`,
        '',
        `Cliente: ${dados.nome}`,
        `${digitos(dados.cpf).length === 14 ? 'CNPJ' : 'CPF'}: ${dados.cpf}`,
        `WhatsApp: ${dados.telefone}`,
        `E-mail: ${dados.email}`,
        `Entrega: ${endereco}`,
      ].filter((l) => l !== null).join('\n');
      return { mensagem, total, frete };
    }

    const grupos = {};
    for (const item of loja.itens()) (grupos[destinoDe(item.produto)] ||= []).push(item);
    const envios = Object.entries(grupos).map(([destino, itens]) => ({ ...DESTINOS[destino], itens, ...mensagemDe(itens) }));

    if (!whatsapp) {
      console.warn('Volmaster Ferramentas: defina VOLMASTER_CONFIG.whatsapp em js/produtos.js para receber os pedidos.\n\n' + envios.map((e) => e.mensagem).join('\n\n'));
      loja.mostraToast('O recebimento de pedidos ainda está sendo configurado.');
      return;
    }

    const { pagamento: _p, ...cliente } = dados;
    try { localStorage.setItem(CHAVE_DADOS, JSON.stringify({ ...cliente, pagamento: dados.pagamento })); } catch { /* sem armazenamento */ }
    // o navegador só deixa abrir uma janela por clique: a primeira mensagem abre sozinha, as outras ficam nos botões abaixo
    window.open(linkPedido(envios[0].numero, envios[0].mensagem), '_blank', 'noopener');

    const total = envios.reduce((s, e) => s + e.total, 0);
    const semFrete = envios.some((e) => e.frete === null);
    const dividido = envios.length > 1;
    const botoes = dividido
      ? envios.map((e, i) => `<a class="btn ${i ? 'btn--primario' : 'btn--secundario'}" href="${linkPedido(e.numero, e.mensagem)}" target="_blank" rel="noopener">${i ? 'Enviar' : 'Abrir de novo'} o pedido para ${esc(e.nome)}</a>`).join('')
      : `<a class="btn btn--primario" href="${linkPedido(envios[0].numero, envios[0].mensagem)}" target="_blank" rel="noopener">Abrir o WhatsApp de novo</a>`;
    const explicacao = dividido
      ? `<p>Seu pedido foi dividido: ${envios.map((e) => `<strong>${e.itens.length} ${e.itens.length === 1 ? 'produto' : 'produtos'}</strong> com o ${esc(e.nome)}`).join(' e ')}. Abrimos a primeira mensagem; <strong>toque no botão abaixo para enviar a outra</strong>.</p>`
      : `<p>Abrimos o WhatsApp${envios[0].numero !== whatsapp ? ` do ${esc(envios[0].nome)}` : ''} com o seu pedido. <strong>Envie a mensagem</strong> para confirmarmos o estoque e mandarmos ${dados.pagamento === 'pix' ? 'o código Pix' : 'o link de pagamento'}.</p>`;

    conteudo.innerHTML = `
      <div class="confirmacao">
        <span class="confirmacao__icone" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
        <h3 tabindex="-1" id="confirmacao-titulo">Pedido enviado!</h3>
        ${explicacao}
        <p class="confirmacao__total">Total: <strong>${moeda(total)}${semFrete ? ' + frete' : ''}</strong> · ${esc(pagamento)}</p>
        <div class="confirmacao__acoes">
          ${botoes}
          <button class="btn btn--secundario" type="button" data-fecha-checkout>Continuar comprando</button>
        </div>
      </div>`;
    $('[data-fecha-checkout]', conteudo).addEventListener('click', () => window.VolmasterPaineis.fechar());
    $('#confirmacao-titulo', conteudo).focus();
    loja.limpar();
  }

  window.VolmasterCheckout = {
    abrir() {
      if (!loja.itens().length) return;
      ultimoCep = '';
      conteudo.innerHTML = formulario();
      prepara($('#checkout-form', conteudo));
      window.VolmasterPaineis.abrir('checkout', $('.topo__carrinho'));
    },
  };
})();
