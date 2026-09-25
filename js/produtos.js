/* =========================================================
   Volmaster Ferramentas — CATÁLOGO
   Edite aqui preços, nomes, categorias e fotos. O site se atualiza sozinho.

   Os NOMES abaixo foram escritos a partir das fotos. Confira e ajuste
   para o nome/aplicação correta de cada ferramenta (motor, modelo etc.).

   ref          código do produto (aparece no card e na mensagem do WhatsApp)
   preco        preço à vista no cartão/boleto
                null = "Sob consulta" (botão de orçamento pelo WhatsApp)
   precoAntigo  opcional — preço riscado (o produto aparece em "Ofertas")
   selo         opcional — etiqueta no card (ex.: 'Mais vendido')
   categoria    id de uma categoria em VOLMASTER_CATEGORIAS
   tarefas      ids de VOLMASTER_TAREFAS em que a ferramenta ajuda
   estoque      opcional — quantidade disponível (0 = esgotado)
   foto         nome do arquivo em images/produtos/ (sem .webp)
   aplicacao    opcional — motores/veículos em que a ferramenta é usada
   resumo       opcional — texto da página do produto
   destaques    opcional — lista de pontos fortes
   specs        opcional — lista de [característica, valor]
   ========================================================= */

window.VOLMASTER_CONFIG = {
  // Número que recebe os pedidos, só dígitos com DDI + DDD
  whatsapp: '5562984930079',
  freteGratisAcima: 0,     // frete grátis a partir deste valor (0 = desligado)
  freteFixo: 0,            // 0 = frete combinado no WhatsApp após o pedido
  descontoPix: 5,          // % de desconto no Pix
  parcelasSemJuros: 10,    // máximo de parcelas sem juros no cartão
  parcelaMinima: 50,       // valor mínimo de cada parcela
};

window.VOLMASTER_CATEGORIAS = [
  { id: 'extratores',   nome: 'Extratores e sacadores' },
  { id: 'instaladores', nome: 'Instaladores de retentor e buchas' },
  { id: 'chaves',       nome: 'Chaves e soquetes especiais' },
  { id: 'suportes',     nome: 'Suportes, travas e gabaritos' },
  { id: 'hidraulica',   nome: 'Hidráulica e diversos' },
];

// "O que você precisa resolver?" — atalhos que filtram o catálogo pela tarefa
window.VOLMASTER_TAREFAS = [
  { id: 'sacar',    titulo: 'Sacar peça que não quer sair', texto: 'Rolamento, bucha, cubo, engrenagem. Sem marreta e sem estragar o conjunto.', icone: 'extrator' },
  { id: 'retentor', titulo: 'Montar retentor e bucha',      texto: 'Entra no esquadro, na medida, do jeito que o fabricante pede.', icone: 'anel' },
  { id: 'porca',    titulo: 'Soltar porca especial',        texto: 'Aquela porca que chave comum não pega.', icone: 'chave' },
  { id: 'travar',   titulo: 'Travar ou apoiar componente',  texto: 'Pra trabalhar com a peça firme e a mão longe do perigo.', icone: 'suporte' },
  { id: 'icar',     titulo: 'Tirar motor ou câmbio',        texto: 'Olhal e travessa pra levantar peso com segurança.', icone: 'olhal' },
  { id: 'prensar',  titulo: 'Prensar e testar',             texto: 'Força hidráulica e linha de teste pra bancada.', icone: 'bomba' },
];

const FOTO = (n) => `vm-${String(n).padStart(2, '0')}`;

window.VOLMASTER_PRODUTOS = [
  // ---------- Extratores e sacadores ----------
  { ref: 'VM-05', categoria: 'extratores', tarefas: ['sacar'], nome: 'Extrator de fuso central com dois braços', tipo: 'Sacador de rolamento e engrenagem', preco: null, foto: FOTO(5) },
  { ref: 'VM-06', categoria: 'extratores', tarefas: ['sacar'], nome: 'Extrator de garras tipo garfo', tipo: 'Garras longas com gancho', preco: null, foto: FOTO(6) },
  { ref: 'VM-15', categoria: 'extratores', tarefas: ['sacar'], nome: 'Kit extrator com fuso roscado e buchas', tipo: 'Fuso, porca e buchas de apoio', preco: null, foto: FOTO(15) },
  { ref: 'VM-16', categoria: 'extratores', tarefas: ['sacar'], nome: 'Sacador de fuso horizontal com base', tipo: 'Base com furos de fixação', preco: null, foto: FOTO(16) },
  { ref: 'VM-25', categoria: 'extratores', tarefas: ['sacar'], nome: 'Sacador de ponte com fuso vertical', tipo: 'Ponte de apoio e fuso longo', preco: null, foto: FOTO(25) },
  { ref: 'VM-26', categoria: 'extratores', tarefas: ['sacar'], nome: 'Placa extratora com fuso e furos múltiplos', tipo: 'Placa com 6 furos de fixação', preco: null, foto: FOTO(26) },
  { ref: 'VM-27', categoria: 'extratores', tarefas: ['sacar'], nome: 'Placa extratora com fuso — modelo largo', tipo: 'Placa com rasgos de ajuste', preco: null, foto: FOTO(27) },
  { ref: 'VM-34', categoria: 'extratores', tarefas: ['sacar'], nome: 'Extrator de fuso longo com garras internas', tipo: 'Para peças em alojamento fundo', preco: null, foto: FOTO(34) },

  // ---------- Instaladores ----------
  { ref: 'VM-11', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Instalador de retentor com flange e pinos-guia', tipo: 'Montagem centralizada', preco: null, foto: FOTO(11) },
  { ref: 'VM-13', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Jogo de buchas de montagem bipartidas', tipo: 'Buchas e anel de encosto', preco: null, foto: FOTO(13) },
  { ref: 'VM-18', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Bucha instaladora escalonada', tipo: 'Encosto em dois diâmetros', preco: null, foto: FOTO(18) },
  { ref: 'VM-20', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Jogo de tubos instaladores — 4 medidas', tipo: 'Para buchas e rolamentos', preco: null, foto: FOTO(20) },
  { ref: 'VM-22', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Jogo de anéis instaladores — 3 peças', tipo: 'Anéis de encosto usinados', preco: null, foto: FOTO(22) },
  { ref: 'VM-28', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Anel instalador escalonado de grande diâmetro', tipo: 'Usinado em aço', preco: null, foto: FOTO(28) },
  { ref: 'VM-35', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Instalador de retentor com manípulo borboleta', tipo: 'Fuso de avanço manual', preco: null, foto: FOTO(35) },
  { ref: 'VM-36', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Instalador de retentor com anel guia', tipo: 'Corpo, tampa e anel', preco: null, foto: FOTO(36) },
  { ref: 'VM-37', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Instalador de retentor com manípulo — modelo alto', tipo: 'Fuso de avanço manual', preco: null, foto: FOTO(37) },
  { ref: 'VM-38', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Instalador de retentor com pinos de fixação', tipo: 'Fixa no flange da peça', preco: null, foto: FOTO(38) },
  { ref: 'VM-39', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Instalador de retentor com cabo lateral', tipo: 'Corpo usinado com furos', preco: null, foto: FOTO(39) },

  // ---------- Chaves e soquetes ----------
  { ref: 'VM-01', categoria: 'chaves', tarefas: ['porca', 'travar'], nome: 'Chave de travamento com flange de 4 furos', tipo: 'Cabo tubular longo', preco: null, foto: FOTO(1) },
  { ref: 'VM-07', categoria: 'chaves', tarefas: ['porca'], nome: 'Soquete especial estriado com flange', tipo: 'Perfil de 12 pontas', preco: null, foto: FOTO(7) },
  { ref: 'VM-10', categoria: 'chaves', tarefas: ['porca'], nome: 'Chave sextavada tipo pé de galinha', tipo: 'Encaixe quadrado para catraca', preco: null, foto: FOTO(10) },
  { ref: 'VM-19', categoria: 'chaves', tarefas: ['porca'], nome: 'Chave de porca sextavada com encaixe quadrado', tipo: 'Corpo de anel reforçado', preco: null, foto: FOTO(19) },

  // ---------- Suportes, travas e gabaritos ----------
  { ref: 'VM-03', categoria: 'suportes', tarefas: ['icar'], nome: 'Travessa de içamento com olhais', tipo: 'Para motor e câmbio', preco: null, foto: FOTO(3) },
  { ref: 'VM-04', categoria: 'suportes', tarefas: ['icar'], nome: 'Olhal de içamento com base roscada', tipo: 'Base usinada', preco: null, foto: FOTO(4) },
  { ref: 'VM-02', categoria: 'suportes', tarefas: ['travar'], nome: 'Haste com olhal e fuso roscado', tipo: 'Haste longa com porca', preco: null, foto: FOTO(2) },
  { ref: 'VM-08', categoria: 'suportes', tarefas: ['travar'], nome: 'Gabarito de chapa com recortes', tipo: 'Posicionamento e trava', preco: null, foto: FOTO(8) },
  { ref: 'VM-09', categoria: 'suportes', tarefas: ['travar'], nome: 'Anel de fixação bipartido com parafusos', tipo: 'Abraçadeira de aço', preco: null, foto: FOTO(9) },
  { ref: 'VM-12', categoria: 'suportes', tarefas: ['travar'], nome: 'Barra de travamento com furos passantes', tipo: 'Par de barras usinadas', preco: null, foto: FOTO(12) },
  { ref: 'VM-14', categoria: 'suportes', tarefas: ['travar'], nome: 'Placa guia com pino central', tipo: 'Placa com 7 furos', preco: null, foto: FOTO(14) },
  { ref: 'VM-29', categoria: 'suportes', tarefas: ['travar'], nome: 'Placa de montagem com braços de apoio', tipo: 'Braços ajustáveis', preco: null, foto: FOTO(29) },
  { ref: 'VM-30', categoria: 'suportes', tarefas: ['travar'], nome: 'Suporte de apoio com prato elevado', tipo: 'Base recortada e colunas', preco: null, foto: FOTO(30) },
  { ref: 'VM-31', categoria: 'suportes', tarefas: ['travar'], nome: 'Suporte de apoio com prato — modelo baixo', tipo: 'Base recortada e colunas curtas', preco: null, foto: FOTO(31) },
  { ref: 'VM-32', categoria: 'suportes', tarefas: ['travar', 'sacar'], nome: 'Bloco de fixação com dois fusos', tipo: 'Furo central passante', preco: null, foto: FOTO(32) },
  { ref: 'VM-33', categoria: 'suportes', tarefas: ['travar'], nome: 'Chapa de apoio com recorte meia-lua', tipo: 'Chapa grossa de aço', preco: null, foto: FOTO(33) },

  // ---------- Hidráulica e diversos ----------
  { ref: 'VM-23', categoria: 'hidraulica', tarefas: ['prensar', 'sacar'], nome: 'Bomba hidráulica manual com cilindro e manômetro', tipo: 'Conjunto completo com mangueira', preco: null, foto: FOTO(23) },
  { ref: 'VM-21', categoria: 'hidraulica', tarefas: ['prensar'], nome: 'Mangueira de teste com engates rápidos', tipo: 'Linha transparente reforçada', preco: null, foto: FOTO(21) },
  { ref: 'VM-17', categoria: 'hidraulica', tarefas: ['travar'], nome: 'Alça curvada de aço', tipo: 'Acabamento preto', preco: null, foto: FOTO(17) },
  { ref: 'VM-24', categoria: 'hidraulica', tarefas: ['travar'], nome: 'Alça curvada de aço — modelo alto', tipo: 'Acabamento oxidado', preco: null, foto: FOTO(24) },
].map((p) => ({ ...p, id: p.ref.toLowerCase() }));
