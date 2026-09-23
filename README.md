# Nexus.mobi

Protótipo de site para bicicletas elétricas, com catálogo de três modelos, identidade visual própria e uma jornada demonstrativa de consulta de preços e test ride.

**Status:** protótipo para apresentação. O formulário valida os campos e simula a confirmação; não transmite dados, não armazena contatos e não agenda visitas. A interface informa a simulação antes e depois do envio. Use dados fictícios na apresentação. Para contato real, use o WhatsApp da Nexus.

## O projeto

- Identidade em preto, branco mineral e verde-lima, com a marca do perfil oficial da Nexus.
- Estúdio 3D interativo com vistas acessíveis por botões, carregamento separado e alternativa fotográfica.
- Fotografias locais e catálogo com V40 Pro, V20 Mini e LAF Comfort.
- Seleção de modelo integrada ao formulário, validação, carregamento e repetição.
- Layout responsivo, navegação por teclado e preferência por movimento reduzido.
- Rodapé com navegação, ícones de Instagram e WhatsApp e página `/privacidade` descrevendo o funcionamento desta demonstração.

O [design system](docs/design-system.md) registra a direção visual, referências, tokens e componentes. As cores são uma interpretação visual do perfil, sujeita à aprovação da marca.

O estúdio usa Three.js e um arquivo local comprimido de aproximadamente 3,9 MB. No celular, em economia de dados ou com movimento reduzido, o visitante decide quando carregar o 3D. A cena só renderiza quando necessário. Se falhar, a foto e o catálogo continuam disponíveis.

**Limite do 3D:** a representação INOW V20 Brake Pro é ilustrativa, reconstruída a partir de fotografias, com dimensões estimadas; não é CAD do fabricante nem uma representação validada dos três modelos do catálogo. Essa distinção aparece na própria interface. Antes de apresentar o 3D como produto à venda, obter o modelo correto e validar geometria, acabamento e autorização de uso com a Nexus.

## Executar

Requisitos: Node.js 20.9 ou superior e npm. Utilize as versões fixadas em `package-lock.json`.

```sh
git clone https://github.com/ThiagoPorto30/projeto-nexusmobi.git
cd projeto-nexusmobi
npm ci
npm run dev
```

Abra [localhost:3000](http://localhost:3000).

### Versão de produção local

```sh
npm run build
npm run start
```

A instalação e a primeira compilação requerem internet, inclusive para obter as fontes Geist. Depois de preparado o build, a página, as fontes e as fotos são servidas localmente. Links para WhatsApp e Instagram continuam dependendo de conexão.

## Validação

```sh
npm run lint
npm run typecheck
npm run format:check
npm run test:unit
npm run build
npm test
```

Os testes de navegador usam Microsoft Edge instalado e podem iniciar o servidor de produção automaticamente. Compile antes de executá-los. Para usar outro navegador, ajuste `channel` em `playwright.config.ts`.

A suíte cobre catálogo, fotos, seleção de produto, campos inválidos, foco, confirmação, repetição, menu móvel, teclado, movimento reduzido, auditoria axe e larguras de 360 a 1440 px. O ensaio de apresentação bloqueia acessos externos e verifica fontes, imagens e ausência de envio ou persistência dos dados. Testes automatizados não substituem avaliação completa com leitores de tela ou aparelhos físicos.

## Organização

| Caminho              | Responsabilidade                              |
| -------------------- | --------------------------------------------- |
| `src/app/`           | Página, layout, estilos e metadados           |
| `src/components/`    | Navegação, catálogo e interface do formulário |
| `src/lib/catalog.ts` | Modelos, especificações, imagens e contatos   |
| `src/lib/leads.ts`   | Validação e simulação de envio                |
| `public/images/`     | Fotografias usadas pela página                |
| `tests/`             | Testes de dados e navegador                   |

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Three.js e Lucide. Sem banco de dados, autenticação ou API de recebimento de contatos.

## Conteúdo e fontes

As fotografias e especificações do protótipo foram obtidas das publicações oficiais abaixo. Os números reproduzem informações anunciadas e precisam de confirmação comercial antes da publicação do site. Autonomia depende do trajeto, da carga e das condições de uso. Preços permanecem sob consulta.

| Material            | Fonte                                                                         |
| ------------------- | ----------------------------------------------------------------------------- |
| V40 Pro e V20 Mini  | [Publicação comparativa](https://www.instagram.com/nexus.mobi/p/DbvnPTjqTWG/) |
| LAF Comfort         | [Apresentação do modelo](https://www.instagram.com/nexus.mobi/p/DcgfANxK3-g/) |
| Foto LAF Comfort    | [Publicação oficial](https://www.instagram.com/nexus.mobi/p/DdEoY11KqE3/)     |
| Marca e atendimento | [Instagram Nexus.mobi](https://www.instagram.com/nexus.mobi/)                 |

A presença dos arquivos neste repositório não concede direitos de reutilização de marcas ou fotografias de terceiros.

## Antes de publicar como site operacional

- **LEADS-001:** integrar recebimento real, validação no servidor, limites de abuso e confirmação de recebimento antes de exibir sucesso.
- **CONTENT-001:** aprovar imagens, especificações, disponibilidade, entrega, preços e condições de test ride com a Nexus.
- **RELEASE-001:** definir domínio, privacidade, retenção de dados, responsáveis, monitoramento e reversão. Remover `noindex` somente depois das validações.

Backups, materiais comerciais de apresentação, relatórios locais, instruções da estação de trabalho e arquivos 3D de trabalho permanecem fora do Git. Apenas o modelo comprimido usado no estúdio é publicado. O repositório inclui o site, suas configurações, design system e testes. A publicação na Vercel continua sendo uma demonstração; o formulário não recebe contatos reais.
