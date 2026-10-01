"""
Gera a prévia de cada produto para o WhatsApp (e outras redes).

O WhatsApp não mostra prévia de .webp e não lê o catálogo em JavaScript,
então cada produto ganha:
  produto/<id>.html      página com título, descrição e foto (og:*) que
                         leva direto para o produto na loja
  images/previa/<id>.jpg foto em JPG no tamanho que o WhatsApp aceita

Rode de novo sempre que mudar nome, preço ou foto em js/produtos.js:
    python ferramentas/gerar-previas.py
"""
import html
import json
import pathlib
import shutil
import subprocess

from PIL import Image

RAIZ = pathlib.Path(__file__).resolve().parent.parent
PAGINAS = RAIZ / 'produto'
FOTOS = RAIZ / 'images' / 'previa'

LER_CATALOGO = """
global.window = {};
require('./js/produtos.js');
process.stdout.write(JSON.stringify({ site: window.VOLMASTER_CONFIG.site, produtos: window.VOLMASTER_PRODUTOS }));
"""

catalogo = json.loads(subprocess.run(
    ['node', '-e', LER_CATALOGO], cwd=RAIZ, capture_output=True, check=True, text=True,
    encoding='utf-8').stdout)
SITE = catalogo['site']  # VOLMASTER_CONFIG.site em js/produtos.js
produtos = catalogo['produtos']

moeda = lambda v: 'R$ ' + f'{v:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')

for pasta in (PAGINAS, FOTOS):
    shutil.rmtree(pasta, ignore_errors=True)
    pasta.mkdir(parents=True)

for p in produtos:
    pid = p['id']
    imagem = ''
    if p.get('foto'):
        Image.open(RAIZ / 'images' / 'produtos' / f"{p['foto']}.webp").convert('RGB') \
            .save(FOTOS / f'{pid}.jpg', quality=80, optimize=True, progressive=True)
        imagem = f'{SITE}images/previa/{pid}.jpg'

    nome = html.escape(p['nome'])
    preco = moeda(p['preco']) if isinstance(p.get('preco'), (int, float)) else 'Preço sob consulta'
    descricao = html.escape(f"{preco} · Volmaster Ferramentas" + (f" · {p['tipo']}" if p.get('tipo') else ''))
    destino = f'../#produto={pid}'
    og_imagem = f"""
  <meta property="og:image" content="{imagem}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="545">""" if imagem else ''

    (PAGINAS / f'{pid}.html').write_text(f"""<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{nome}</title>
  <meta name="description" content="{descricao}">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="Volmaster Ferramentas">
  <meta property="og:title" content="{nome}">
  <meta property="og:description" content="{descricao}">
  <meta property="og:url" content="{SITE}produto/{pid}.html">{og_imagem}
  <meta http-equiv="refresh" content="0; url={destino}">
  <script>location.replace('{destino}');</script>
</head>
<body style="background:#0f171c;color:#fff;font-family:sans-serif;padding:24px">
  <p><a href="{destino}" style="color:#7fa2ff">Abrir {nome} na loja</a></p>
</body>
</html>
""", encoding='utf-8', newline='\n')

print(f'{len(produtos)} prévias geradas')
