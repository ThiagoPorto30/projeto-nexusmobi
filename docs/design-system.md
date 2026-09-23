# Nexus Studio — design system

Revisão: 23/09/2026. Direção: um estúdio de mobilidade elétrica com produto em primeiro plano. A identidade aproxima o site da marca observada em @nexus.mobi: preto, logotipo branco e acentos verde-lima. Os valores abaixo são uma interpretação para a interface, não um manual oficial fornecido pela empresa.

## Fundamentos

| Papel                     | Token          | Valor     | Uso                                 |
| ------------------------- | -------------- | --------- | ----------------------------------- |
| Fundo principal           | `--background` | `#F5F6F1` | Catálogo e leitura                  |
| Texto / superfície escura | `--ink`        | `#171B14` | Conteúdo e bloco de benefícios      |
| Fundo do estúdio          | —              | `#070807` | Cabeçalho, abertura, rodapé         |
| Destaque                  | `--accent`     | `#C1EE67` | Ação principal, detalhes do estúdio |
| Texto secundário          | `--muted`      | `#5D6555` | Descrições sobre fundo claro        |
| Foco claro                | `--focus`      | `#517814` | Navegação por teclado               |
| Foco escuro               | `--focus`      | `#C1EE67` | Navegação no estúdio e cabeçalho    |
| Erro                      | `--error`      | `#A02F24` | Erros acompanhados de texto         |

Fonte: Geist Sans para títulos, textos e controles; Geist Mono apenas para legendas curtas. As fontes são empacotadas pelo Next.js; não há solicitação ao Google durante a visita. Títulos com peso 450–550 e entreletra negativa. Sem itálico decorativo. Título principal responsivo, 56–122 px; títulos de seção 40–80 px; corpo 13–16 px. Textos auxiliares não devem carregar informação essencial sozinhos.

Escala de espaço: 4, 8, 12, 16, 24, 32, 48, 64, 104 px. Container máximo 1320 px. Margens de 48 px no desktop, 32 px no tablet e 20 px no celular. Cartões: 18 px de raio. Botões: formato cápsula, altura mínima 44 px; principais 52 px. Componentes reaproveitam os tokens de `src/app/tokens.css`.

## Avaliação e decisões

| Elemento anterior                    | Decisão                                                 | Motivo                                            |
| ------------------------------------ | ------------------------------------------------------- | ------------------------------------------------- |
| Marca desenhada como N               | Foto de perfil oficial, mantida sem redesenho           | Reconhecimento da Nexus                           |
| Areia, petróleo e terracota          | Preto, branco mineral e verde-lima                      | Coerência com a identidade pública                |
| Título sobre fotografia lateral      | Título central e estúdio amplo                          | Composição distinta da Flexmobi                   |
| Catálogo em longas linhas alternadas | Três cartões comparáveis no desktop                     | Menos rolagem para comparar a oferta              |
| Mesmo peso para todos os blocos      | Abertura de impacto, catálogo claro, benefícios escuros | Hierarquia entre descoberta, comparação e decisão |
| Efeito 3D como adorno                | Vistas lateral, frontal e perspectiva; rotação          | Exploração controlável e útil                     |
| Cores fixas espalhadas               | Tokens semânticos e papéis documentados                 | Consistência nas próximas alterações              |

## Componentes e comportamento

- **Marca:** arquivo original `public/brand/nexus-profile.jpg`, obtido do perfil autorizado pelo usuário. Apresentado por enquadramento CSS sobre preto. O original disponível tem 150 × 150 px; substituir por arquivo vetorial oficial quando recebido. Não ampliar para uso em impressão.
- **Botão primário:** verde-lima com texto escuro. Uma ação principal por grupo. Botão secundário escuro no catálogo. Links de apoio usam texto claro e área mínima de toque. Setas ficam restritas aos controles de rotação do 3D.
- **Catálogo:** mesma ordem de informação: fotografia, modelo, proposta, autonomia, especificações, preço sob consulta e contato com modelo selecionado. Não inventar preços, estoque, garantias ou avaliações.
- **Formulário:** mantém o fluxo demonstrativo existente, sem transmissão ou armazenamento. A integração real continua fora do escopo. O WhatsApp existente é o canal de contato real.
- **Navegação:** menu móvel com Escape, foco visível, link de salto e conteúdo fechado fora da navegação de teclado.
- **Movimento:** hover de 180 ms, escala de foto de 450 ms e apenas 2,5%. Respeitar `prefers-reduced-motion`. O modelo não gira automaticamente e não captura a roda de rolagem.

## Estúdio 3D

O arquivo existente é uma reconstrução ilustrativa da **INOW V20 Brake Pro**. Não corresponde a uma representação verificada de V40 Pro, V20 Mini ou LAF Comfort. A interface informa a distinção junto ao estúdio e mantém as fotografias reais no catálogo. Aprovar a correspondência do modelo ou fornecer um modelo oficial antes de associar o 3D a uma oferta comercial.

- Three.js 0.186.0, licença MIT; carregamento por importação dinâmica. Sem React Three Fiber ou Drei.
- Asset local compactado em gzip (`.bin`, aproximadamente 3,9 MB); sem HDR, CDN ou textura remota.
- Desktop: iniciar quando o estúdio estiver visível. Celular, preferência por movimento reduzido ou economia de dados: iniciar somente ao tocar em “Explorar em 3D”.
- Renderizar somente ao interagir ou redimensionar; suspender fora da tela e com aba oculta. Pixel ratio limitado a 1,5.
- Estados: fotografia antes de iniciar, carregamento, cena pronta, falha com tentativa novamente. Limite de 20 segundos. Falha no WebGL preserva catálogo e contato.
- Controles nativos permitem trocar de vista ou girar sem arrastar. Zoom da cena desligado para preservar a navegação da página.
- Liberar observadores, eventos, geometria, texturas, materiais e renderer ao desmontar.

## Fontes e referências

Consultadas em 23/09/2026:

- [Instagram Nexus](https://www.instagram.com/nexus.mobi/): marca, contraste preto/branco, verde dos detalhes e canal comercial. Logo incorporada conforme autorização do usuário.
- [Cowboy](https://us.cowboy.com/): produto como protagonista, hierarquia reduzida e descoberta por detalhes. Não copiar textos, produtos, números ou assets.
- [Veloretti](https://www.veloretti.com/): clareza de coleção e alternância entre produto e contexto de uso. Referência de organização, sem reutilizar imagens.
- [Flexmobi](https://projeto-flexmobi.vercel.app/): referência de diferenciação. Evitar a abertura dividida com manchete à esquerda e modelo à direita, o mesmo texto, catálogo e sequência de seções.
- [Three.js](https://threejs.org/docs/): GLTFLoader, OrbitControls, RoomEnvironment e descarte de recursos.
- Procedência e limites do modelo preservados no relatório local `public/models/source-report.json`, fora da publicação. Não é CAD de fabricante.

## Critérios de revisão

Validar em 360, 390, 768, 1024 e 1440 px: ausência de rolagem horizontal, legibilidade, imagens, teclado, foco, menu, seleção de produto, formulário, carregamento 3D, vistas, falha e nova tentativa. Rodar tipos, lint, formatação, build, testes de dados, navegador e axe. Revisão automática não substitui teste em aparelhos físicos.

Materiais de pesquisa, capturas e apresentação permanecem em pastas ignoradas. Versionar somente assets usados, código, testes e esta documentação do design system.

## Densidade visual

Remover ícones que apenas repetem o texto de botões, números decorativos, marca d’água atrás do produto e frases duplicadas. Não usar setas como assinatura visual. Reservar ícones para controles, estados e categorias que ajudem a leitura. A fotografia, o produto e a hierarquia tipográfica conduzem a página.
