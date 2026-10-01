/* =========================================================
   Volmaster Ferramentas — CATÁLOGO
   Edite aqui preços, nomes, categorias e fotos. O site se atualiza sozinho.
   Depois de editar, rode  python ferramentas/gerar-previas.py  para atualizar
   a prévia (foto + nome) que aparece no link do pedido no WhatsApp.

   Os NOMES abaixo foram escritos a partir das fotos. Confira e ajuste
   para o nome/aplicação correta de cada ferramenta (motor, modelo etc.).

   ref          código interno do produto (não aparece no site)
   preco        preço à vista (Pix ou cartão)
                null = "Sob consulta" (botão "Solicitar orçamento" abre o WhatsApp)
   precoAntigo  opcional — preço riscado (o produto aparece em "Ofertas")
   selo         opcional — etiqueta no card (ex.: 'Mais vendido')
   categoria    id de uma categoria em VOLMASTER_CATEGORIAS
   tarefas      ids de VOLMASTER_TAREFAS em que a ferramenta ajuda
   estoque      opcional — quantidade disponível (0 = esgotado)
   tipo         opcional — linha cinza embaixo do nome
   foto         nome do arquivo em images/produtos/ (sem .webp)
   fotos        opcional — fotos extras da galeria na página do produto
   aplicacao    opcional — motores/veículos em que a ferramenta é usada
   resumo       opcional — texto da página do produto
   destaques    opcional — lista de pontos fortes
   specs        opcional — lista de [característica, valor]
   ========================================================= */

window.VOLMASTER_CONFIG = {
  // Número que recebe os pedidos, só dígitos com DDI + DDD
  whatsapp: '5562984930079',
  // Endereço público do site: o link "Ver a peça" do pedido no WhatsApp usa ele,
  // para abrir no celular de quem recebe (mesmo se o pedido sair de um teste local).
  // Mudou de domínio? Troque aqui e rode  python ferramentas/gerar-previas.py
  site: 'https://snoopyzin.github.io/volmaster-ferramentas/',
  freteGratisAcima: 0,     // frete grátis a partir deste valor (0 = desligado)
  freteFixo: 0,            // 0 = frete combinado no WhatsApp após o pedido
  descontoPix: 0,          // % de desconto no Pix (0 = sem desconto)
};

window.VOLMASTER_CATEGORIAS = [
  { id: 'diagnostico',  nome: 'Diagnóstico e programação' },
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
  // ---------- Diagnóstico e programação ----------
  { ref: 'NOTEBOOK-VOCOM1', categoria: 'diagnostico', tarefas: [], nome: 'Notebook completo com Tech Tool 2, interface de diagnóstico Vocom I importada e cabos, pronto para realizar diagnósticos e procedimentos em caminhões Volvo.', tipo: 'Uma solução completa para oficinas e profissionais que trabalham com diagnóstico, testes, calibrações e parametrizações dos sistemas eletrônicos dos caminhões Volvo.', preco: 15000, foto: 'notebook-vocom1', fotos: ['notebook-vocom1-2', 'notebook-vocom1-3', 'notebook-vocom1-4'] },
  { ref: 'NOTEBOOK-VOCOM2', categoria: 'diagnostico', tarefas: [], nome: 'Notebook completo com Tech Tool 2, interface de diagnóstico Vocom 2 original e cabos, pronto para realizar diagnósticos e procedimentos em caminhões Volvo.', tipo: 'Uma solução completa para oficinas e profissionais que trabalham com diagnóstico, testes, calibrações e parametrizações dos sistemas eletrônicos dos caminhões Volvo.', preco: 25000, foto: 'notebook-vocom2', fotos: ['notebook-vocom2-2', 'notebook-vocom2-3', 'notebook-vocom2-4'] },
  { ref: 'THE-GENIUS', categoria: 'diagnostico', tarefas: [], nome: 'The Genius Dimsport — tablet para reprogramação de módulos pela tomada OBD, com maleta e cabos.', preco: null, foto: 'the-genius', fotos: ['the-genius-2', 'the-genius-3', 'the-genius-4', 'the-genius-5'] },
  { ref: 'NEW-GENIUS', categoria: 'diagnostico', tarefas: [], nome: 'New Genius Dimsport — console para leitura e gravação de módulos pela tomada OBD, com maleta e cabos.', preco: null, foto: 'new-genius', fotos: ['new-genius-2', 'new-genius-3'] },
  { ref: 'NEW-TRASDATA', categoria: 'diagnostico', tarefas: [], nome: 'New Trasdata Dimsport — ferramenta de bancada para leitura e gravação de módulos, com maleta e cabos.', preco: null, foto: 'new-trasdata', fotos: ['new-trasdata-2', 'new-trasdata-3'] },

  // ---------- Extratores e sacadores ----------
  { ref: 'VM-05', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial para remoção do rolamento do eixo principal, desenvolvida para aplicações em transmissões Volvo I-Shift e VT.', preco: 2274.79, foto: FOTO(5) },
  { ref: 'VM-06', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida para a remoção das engrenagens do eixo principal das transmissões Volvo I-Shift e VT.', preco: 3999, foto: FOTO(6) },
  { ref: 'VM-15', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial para a remoção do pino da marcha-ré e, em conjunto com o dispositivo específico, para a instalação do anel de acoplamento do grupo redutor alto da transmissão Volvo I-Shift.', preco: 1189.34, foto: FOTO(15) },
  { ref: 'VM-16', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida para facilitar a instalação do trocador de calor nos motores Volvo D13A e D13C.', preco: 598, foto: FOTO(16) },
  { ref: 'VM-25', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida para facilitar a remoção do filtro de partículas (DPF) dos veículos Volvo Euro 6.', preco: 1194.12, foto: FOTO(25) },
  { ref: 'VM-26', categoria: 'extratores', tarefas: ['sacar', 'retentor'], nome: 'Ferramenta especial desenvolvida para facilitar a substituição dos retentores de válvulas do cabeçote dos motores Volvo D13.', preco: 853.79, foto: 'vm-26-14' },
  { ref: 'VM-27', categoria: 'extratores', tarefas: ['sacar', 'retentor'], nome: 'Ferramenta pra trocar retentor de válvulas do cabeçote D8K', tipo: 'Placa extratora com fuso — modelo largo', preco: 752.29, foto: FOTO(27) },
  { ref: 'VM-34', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida para a remoção da camisa de cilindro dos motores Volvo D13.', preco: 2548, foto: FOTO(34) },

  // ---------- Instaladores ----------
  { ref: 'VM-11', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Ferramenta especial desenvolvida para facilitar a instalação do retentor traseiro do motor DC13 Scania Super.', selo: 'Retentor traseiro', preco: 3354.57, foto: 'vm-11-traseiro' },
  { ref: 'VM-40', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Ferramenta especial desenvolvida para facilitar a instalação do retentor dianteiro do motor DC13 Scania Super.', selo: 'Retentor dianteiro', preco: 2994.84, foto: FOTO(11) },
  { ref: 'VM-18', categoria: 'instaladores', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida para facilitar a remoção do eixo de extensão Crawler das transmissões ASO-C e ASO-ULC.', preco: 532, foto: FOTO(18) },
  { ref: 'VM-20', categoria: 'instaladores', tarefas: ['retentor', 'prensar'], nome: 'Kit com 7 copos de prensagem desenvolvidos para facilitar a instalação de rolamentos e engrenagens das transmissões Volvo I-Shift.', preco: 3198, foto: 'vm-20-22' },
  { ref: 'VM-28', categoria: 'instaladores', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida para a remoção do anel de acoplamento do redutor alto (prato) das transmissões Volvo I-Shift.', preco: 3299, foto: FOTO(28) },
  { ref: 'VM-35', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Ferramenta especial desenvolvida para a instalação do retentor traseiro dos motores Volvo D13, compatível com modelos modernos e antigos.', preco: 4919.76, foto: 'vm-35-36' },
  { ref: 'VM-37', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Ferramenta especial desenvolvida para facilitar a instalação do retentor dianteiro moderno dos motores Volvo D13, proporcionando mais precisão, segurança e agilidade durante a montagem.', preco: 3845.65, foto: 'vm-37-38' },
  { ref: 'VM-39', categoria: 'instaladores', tarefas: ['retentor'], nome: 'Ferramenta especial desenvolvida para facilitar a instalação do retentor traseiro dos motores Volvo VM D8K.', preco: 3451, foto: FOTO(39) },

  // ---------- Chaves e soquetes ----------
  { ref: 'VM-01', categoria: 'chaves', tarefas: ['sacar', 'travar'], nome: 'Ferramenta especial desenvolvida para facilitar a remoção da porca do flange de saída das transmissões Volvo I-Shift.', preco: 863.93, foto: FOTO(1) },
  { ref: 'VM-07', categoria: 'chaves', tarefas: ['travar'], nome: 'Kit com 7 peças, desenvolvido para fixar a camisa de cilindro durante a realização de medições no bloco do motor.', preco: 235, foto: FOTO(7) },
  { ref: 'VM-10', categoria: 'chaves', tarefas: ['porca', 'sacar'], nome: 'Ferramenta especial desenvolvida para facilitar a remoção e o torque do tubo de lubrificação das transmissões Volvo I-Shift.', preco: 214.94, foto: FOTO(10) },
  { ref: 'VM-19', categoria: 'chaves', tarefas: ['porca', 'sacar'], nome: 'Ferramenta especial desenvolvida para facilitar a remoção e o torque do tubo de lubrificação das transmissões Volvo I-Shift.', tipo: 'Além disso, a mesma ferramenta pode ser utilizada para remover e aplicar o torque na válvula de alívio do bloco do motor Volvo D13.', preco: 360, foto: FOTO(19) },

  // ---------- Suportes, travas e gabaritos ----------
  { ref: 'VM-03', categoria: 'suportes', tarefas: ['icar'], nome: 'Ferramenta especial desenvolvida para fixar o eixo de balancins durante os serviços de manutenção dos motores Volvo D12 e D13.', preco: 871.90, foto: FOTO(3) },
  { ref: 'VM-04', categoria: 'suportes', tarefas: ['icar'], nome: 'Ferramenta especial desenvolvida para auxiliar na remoção do grupo redutor da transmissão, proporcionando maior segurança e estabilidade durante a desmontagem.', preco: 609, foto: FOTO(4) },
  { ref: 'VM-02', categoria: 'suportes', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida para auxiliar na remoção dos eixos das transmissões Volvo I-Shift e VT.', preco: 548, foto: FOTO(2) },
  // fora do site por enquanto: { ref: 'VM-08', categoria: 'suportes', tarefas: ['travar'], nome: 'Ferramenta pra pôr o motor no ponto do Scania Super', tipo: 'Gabarito de chapa com recortes', preco: 687, foto: FOTO(8) },
  { ref: 'VM-09', categoria: 'suportes', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida para facilitar a remoção do rolamento do eixo de entrada das transmissões Volvo I-Shift.', preco: 1662, foto: FOTO(9) },
  { ref: 'VM-12', categoria: 'suportes', tarefas: ['travar'], nome: 'Ferramenta especial desenvolvida para auxiliar no procedimento de centralização do cabeçote dos motores Volvo D12D.', preco: 649, foto: 'vm-12b', fotos: ['vm-12b-2'] },
  { ref: 'VM-29', categoria: 'suportes', tarefas: ['travar'], nome: 'Suporte especial desenvolvido para a fixação das transmissões Volvo I-Shift e VT no cavalete de recondicionamento.', preco: 1934.97, foto: FOTO(29) },
  { ref: 'VM-30', categoria: 'suportes', tarefas: ['travar'], nome: 'Suporte especial desenvolvido para a fixação do motor Volvo VM D8K no cavalete de recondicionamento.', preco: 2794.23, foto: FOTO(30) },
  { ref: 'VM-31', categoria: 'suportes', tarefas: ['travar'], nome: 'Suporte especial desenvolvido para a fixação dos motores Volvo D13 A/C/K no cavalete de recondicionamento.', preco: 2256.88, foto: FOTO(31) },
  { ref: 'VM-32', categoria: 'suportes', tarefas: ['travar', 'sacar'], nome: 'Ferramenta especial desenvolvida para auxiliar na remoção de rolamentos e engrenagens utilizando bomba hidráulica.', preco: 1791, foto: FOTO(32) },
  { ref: 'VM-33', categoria: 'suportes', tarefas: ['sacar'], nome: 'Ferramenta especial desenvolvida no formato meia-lua para auxiliar na remoção de engrenagens do eixo utilizando prensa hidráulica.', preco: 1970.29, foto: FOTO(33) },

  // ---------- Hidráulica e diversos ----------
  { ref: 'VM-23', categoria: 'hidraulica', tarefas: ['prensar', 'sacar'], nome: 'Conjunto hidráulico desenvolvido para auxiliar na remoção e instalação de componentes mecânicos que exigem aplicação de força controlada.', preco: 7890, foto: FOTO(23) },
  { ref: 'VM-21', categoria: 'hidraulica', tarefas: ['prensar'], nome: 'Ferramenta especial desenvolvida para realizar o teste de fuga de compressão no sistema de combustível através da luva do bico injetor dos motores Volvo D13A e D13C.', preco: 349, foto: FOTO(21) },
  { ref: 'VM-17', categoria: 'hidraulica', tarefas: ['icar'], nome: 'Ferramenta especial desenvolvida para auxiliar na remoção do virabrequim durante os serviços de desmontagem do motor.', preco: 591, foto: FOTO(17) },
  { ref: 'VM-24', categoria: 'hidraulica', tarefas: ['icar'], nome: 'Ferramenta especial desenvolvida para auxiliar na remoção do comando de válvulas durante os serviços de desmontagem e manutenção do motor.', preco: 411, foto: FOTO(24) },

  // ---------- Novas ----------
  { ref: 'VM-41', categoria: 'extratores', tarefas: ['sacar'], nome: 'Ferramenta especial com pistão e bomba hidráulica, desenvolvida para facilitar a remoção do flange das transmissões Volvo I-Shift.', preco: 1839, foto: 'vm-41', fotos: ['vm-41-2'] },
  { ref: 'VM-42', categoria: 'suportes', tarefas: [], nome: 'Ferramenta especial desenvolvida para ser utilizada em conjunto com relógio comparador, permitindo medir a altura da camisa de cilindro em relação à face do bloco dos motores Volvo.', preco: 898, foto: 'vm-42', fotos: ['vm-42-2'] },
  { ref: 'VM-43', categoria: 'hidraulica', tarefas: ['prensar'], nome: 'Ferramenta desenvolvida para realizar o teste de pressão no sistema de escape dos veículos Volvo Euro 6, auxiliando na avaliação das condições do catalisador.', preco: 799, foto: 'vm-43' },
  { ref: 'VM-44', categoria: 'suportes', tarefas: [], nome: 'Par de prisioneiros desenvolvido para auxiliar na instalação do seletor de mudanças das transmissões Volvo I-Shift.', preco: 199, foto: 'vm-44' },
  { ref: 'VM-45', categoria: 'hidraulica', tarefas: ['prensar'], nome: 'Ferramenta especial para avaliar possíveis fugas de compressão para o sistemas de arrefecimento e de combustível dos motores Volvo D13.', preco: 499, foto: 'vm-45' },
  { ref: 'VM-46', categoria: 'hidraulica', tarefas: ['prensar'], nome: 'Ferramenta especial desenvolvida para realizar o teste da válvula APM após o recondicionamento, permitindo avaliar seu funcionamento sem a necessidade de utilizar o módulo eletrônico.', preco: 1135, foto: 'vm-46' },
].map((p) => ({ ...p, id: p.ref.toLowerCase() }));
