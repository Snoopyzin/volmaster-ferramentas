/* =========================================================
   Volmaster Ferramentas — CATÁLOGO
   Edite aqui preços, nomes, categorias e fotos. O site se atualiza sozinho.

   Os NOMES abaixo foram escritos a partir das fotos. Confira e ajuste
   para o nome/aplicação correta de cada ferramenta (motor, modelo etc.).

   ref          código interno do produto (não aparece no site)
   preco        preço à vista no cartão/boleto
                null = "Sob consulta" (botão de orçamento pelo WhatsApp)
   precoAntigo  opcional — preço riscado (o produto aparece em "Ofertas")
   selo         opcional — etiqueta no card (ex.: 'Mais vendido')
   categoria    id de uma categoria em VOLMASTER_CATEGORIAS
   tarefas      ids de VOLMASTER_TAREFAS em que a ferramenta ajuda
   estoque      opcional — quantidade disponível (0 = esgotado)
   tipo         opcional — linha cinza embaixo do nome
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
  descontoPix: 0,          // % de desconto no Pix (0 = sem desconto)
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
  { ref: 'VM-05', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial para remoção do rolamento do eixo principal, desenvolvida para aplicações em transmissões Volvo I-Shift e VT.', preco: 2110, foto: FOTO(5) },
  { ref: 'VM-06', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida para a remoção das engrenagens do eixo principal das transmissões Volvo I-Shift e VT.', preco: 3199, foto: FOTO(6) },
  { ref: 'VM-15', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial para a remoção do pino da marcha-ré e, em conjunto com o dispositivo específico, para a instalação do anel de acoplamento do grupo redutor alto da transmissão Volvo I-Shift.', preco: 1100, foto: FOTO(15) },
  { ref: 'VM-16', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida para facilitar a instalação do trocador de calor nos motores Volvo D13A e D13C.', preco: 598, foto: FOTO(16) },
  { ref: 'VM-25', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida para facilitar a remoção do filtro de partículas (DPF) dos veículos Volvo Euro 6.', preco: 1110, foto: FOTO(25) },
  { ref: 'VM-26', categoria: 'extratores', tarefas: ['sacar', 'retentor'], nome: 'Ferramenta especial desenvolvida para facilitar a substituição dos retentores de válvulas do cabeçote dos motores Volvo D13.', preco: 792, foto: 'vm-26-14' },
  { ref: 'VM-27', categoria: 'extratores', tarefas: ['sacar', 'retentor'], nome: 'Ferramenta pra trocar retentor de válvulas do cabeçote D8K', tipo: 'Placa extratora com fuso — modelo largo', preco: 699, foto: FOTO(27) },
  { ref: 'VM-34', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida para a remoção da camisa de cilindro dos motores Volvo D13.', preco: 2364, foto: FOTO(34) },

  // ---------- Instaladores ----------
  { ref: 'VM-11', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Ferramenta especial desenvolvida para facilitar a instalação do retentor traseiro do motor DC13 Scania Super.', selo: 'Retentor traseiro', preco: 3199, foto: FOTO(11) },
  { ref: 'VM-40', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Ferramenta especial desenvolvida para facilitar a instalação do retentor dianteiro do motor DC13 Scania Super.', selo: 'Retentor dianteiro', preco: 2780, foto: FOTO(11) },
  { ref: 'VM-18', categoria: 'instaladores', tarefas: ['sacar'], nome: 'Ferramenta de sacar eixo extensão Crawler', tipo: 'Bucha instaladora escalonada', preco: 532, foto: FOTO(18) },
  { ref: 'VM-20', categoria: 'instaladores', tarefas: ['retentor', 'prensar'], nome: 'Kit copos de prensagem — 7 unidades', tipo: 'Jogo de tubos e anéis instaladores', preco: 3198, foto: 'vm-20-22' },
  { ref: 'VM-28', categoria: 'instaladores', tarefas: ['sacar'], nome: 'Ferramenta pra sacar o prato', tipo: 'Anel escalonado de grande diâmetro', preco: 3299, foto: FOTO(28) },
  { ref: 'VM-35', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Ferramenta de instalar retentor traseiro D13', tipo: 'Instalador de retentor com manípulo borboleta', preco: 4564, foto: 'vm-35-36' },
  { ref: 'VM-37', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Ferramenta de instalar retentor dianteiro D13', tipo: 'Instalador de retentor com manípulo', preco: 3568, foto: 'vm-37-38' },
  { ref: 'VM-39', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Ferramenta de instalar retentor traseiro VM D8K', tipo: 'Instalador de retentor com cabo lateral', preco: 3209, foto: FOTO(39) },

  // ---------- Chaves e soquetes ----------
  { ref: 'VM-01', categoria: 'chaves', tarefas: ['sacar', 'travar'], nome: 'Ferramenta de sacar o flange', tipo: 'Chave de travamento com flange de 4 furos', preco: 809, foto: FOTO(1) },
  { ref: 'VM-07', categoria: 'chaves', tarefas: ['travar'], nome: 'Ferramenta de fixar camisa de cilindro pra fazer as medições', tipo: 'Soquete especial estriado com flange', preco: 199, foto: FOTO(7) },
  { ref: 'VM-10', categoria: 'chaves', tarefas: ['porca', 'sacar'], nome: 'Ferramenta de sacar tubo de lubrificação da caixa', tipo: 'Chave sextavada tipo pé de galinha', preco: 199, foto: FOTO(10) },
  { ref: 'VM-19', categoria: 'chaves', tarefas: ['porca', 'sacar'], nome: 'Ferramenta de sacar tubo de lubrificação da caixa', tipo: 'Chave de porca sextavada com encaixe quadrado', preco: 360, foto: FOTO(19) },

  // ---------- Suportes, travas e gabaritos ----------
  { ref: 'VM-03', categoria: 'suportes', tarefas: ['icar'], nome: 'Ferramenta de tirar o balanceiro', tipo: 'Travessa de içamento com olhais', preco: 871.90, foto: FOTO(3) },
  { ref: 'VM-04', categoria: 'suportes', tarefas: ['icar'], nome: 'Ferramenta pra erguer o grupo redutor', tipo: 'Olhal de içamento com base roscada', preco: 565, foto: FOTO(4) },
  { ref: 'VM-02', categoria: 'suportes', tarefas: ['sacar'], nome: 'Ferramenta de tirar os eixos da caixa', tipo: 'Haste com olhal e fuso roscado', preco: 548, foto: FOTO(2) },
  { ref: 'VM-08', categoria: 'suportes', tarefas: ['travar'], nome: 'Ferramenta pra pôr o motor no ponto do Scania Super', tipo: 'Gabarito de chapa com recortes', preco: 687, foto: FOTO(8) },
  { ref: 'VM-09', categoria: 'suportes', tarefas: ['sacar'], nome: 'Ferramenta de sacar o rolamento do eixo piloto', tipo: 'Anel de fixação bipartido com parafusos', preco: 1662, foto: FOTO(9) },
  { ref: 'VM-12', categoria: 'suportes', tarefas: ['travar'], nome: 'Ferramenta de guiar cabeçote do D12D', tipo: 'Barra de travamento com furos passantes', preco: 649, foto: FOTO(12) },
  { ref: 'VM-29', categoria: 'suportes', tarefas: ['travar'], nome: 'Suporte da caixa', tipo: 'Placa de montagem com braços de apoio', preco: 1795, foto: FOTO(29) },
  { ref: 'VM-30', categoria: 'suportes', tarefas: ['travar'], nome: 'Suporte do motor VM D8K', tipo: 'Suporte de apoio com prato elevado', preco: 2590, foto: FOTO(30) },
  { ref: 'VM-31', categoria: 'suportes', tarefas: ['travar'], nome: 'Suporte do motor D13', tipo: 'Suporte de apoio com prato — modelo baixo', preco: 2100, foto: FOTO(31) },
  { ref: 'VM-32', categoria: 'suportes', tarefas: ['travar', 'sacar'], nome: 'Ferramenta H', tipo: 'Bloco de fixação com dois fusos', preco: 1750, foto: FOTO(32) },
  { ref: 'VM-33', categoria: 'suportes', tarefas: ['sacar'], nome: 'Ferramenta meia-lua pra sacar as engrenagens do eixo', tipo: 'Chapa de apoio com recorte meia-lua', preco: 1829, foto: FOTO(33) },

  // ---------- Hidráulica e diversos ----------
  { ref: 'VM-23', categoria: 'hidraulica', tarefas: ['prensar', 'sacar'], nome: 'Bomba e pistão hidráulico', tipo: 'Bomba manual com cilindro, mangueira e manômetro', preco: 7890, foto: FOTO(23) },
  { ref: 'VM-21', categoria: 'hidraulica', tarefas: ['prensar'], nome: 'Ferramenta de teste de luva de bico D13A e D13C', tipo: 'Mangueira de teste com engates rápidos', preco: 299, foto: FOTO(21) },
  { ref: 'VM-17', categoria: 'hidraulica', tarefas: ['icar'], nome: 'Ferramenta de erguer o virabrequim', tipo: 'Alça curvada de aço', preco: 383, foto: FOTO(17) },
  { ref: 'VM-24', categoria: 'hidraulica', tarefas: ['icar'], nome: 'Ferramenta de erguer o comando', tipo: 'Alça curvada de aço — modelo alto', preco: 333, foto: FOTO(24) },
].map((p) => ({ ...p, id: p.ref.toLowerCase() }));
