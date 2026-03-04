# Design Guidelines - VCD Hub

Este documento define as diretrizes visuais e de UX do produto com base no KV do site da Você Digital Propaganda.

## 1. Fonte da verdade da marca

Referências oficiais usadas:
- Logo principal: `https://vocedigitalpropaganda.com.br/wp-content/uploads/2022/02/Logo-VCD.svg`
- Favicon: `https://vocedigitalpropaganda.com.br/wp-content/uploads/2022/02/Favicon.svg`
- Tokens visuais identificados no CSS global do site:
  - Primária: `#000000`
  - Secundária: `#FFB500`
  - Texto secundário: `#BDBDBD`
  - Branco: `#FFFFFF`
  - Escala quente de apoio: `#FFD61B`, `#E28A00`, `#BB6102`

Assets locais no projeto:
- `public/brand/logo-vcd.svg`
- `public/brand/favicon-vcd.svg`

## 2. Direção visual

A interface deve transmitir:
- Performance e conversão (alto contraste, dados em destaque)
- Sofisticação (fundo escuro com glow sutil)
- Identidade VCD (amarelo ouro como cor de ação, preto como base)

Evitar:
- UIs "genéricas" claras sem personalidade
- Paletas frias dominantes (azul/cinza sem amarelo VCD)
- Excesso de gradiente saturado

## 3. Tokens de design

## 3.1 Cores

- `--bg-base: #06080D`
- `--bg-surface: #101723`
- `--bg-card: #131D2B`
- `--border-subtle: rgba(255,255,255,0.10)`
- `--text-primary: #FFFFFF`
- `--text-secondary: #BDBDBD`
- `--brand-primary: #FFB500`
- `--brand-primary-hover: #FFD61B`
- `--brand-primary-pressed: #E28A00`
- `--brand-support: #BB6102`
- `--success: #25D366`
- `--danger: #FF5F57`

## 3.2 Tipografia

Hierarquia:
- Título de bloco: 36-48px, peso 700, tracking levemente aberto
- Subtítulo: 20-24px, peso 600-700
- Label de métrica: 12-16px, peso 600, caixa alta
- Valor de KPI: 40-56px, peso 700

Fallback recomendado (web-safe):
- `font-family: "Gilroy", "Montserrat", "Poppins", sans-serif;`

## 3.3 Espaçamento e grid

- Base spacing: múltiplos de 8px
- Container desktop: `max-width: 1440px`
- Gutter desktop: 32px
- Gutter mobile: 16px
- Grid de cards KPI:
  - Desktop: 4 colunas
  - Tablet: 2 colunas
  - Mobile: 1 coluna

## 3.4 Bordas e sombras

- Raio principal: 24px
- Raio card: 20px
- Borda: `1px solid var(--border-subtle)`
- Glow da marca (sutil): `0 0 32px rgba(255,181,0,0.12)`

## 4. Uso de logo

- Sempre usar `public/brand/logo-vcd.svg` como primeira opção.
- Área de proteção mínima: altura do "V" em volta do logo.
- Não distorcer, inclinar ou aplicar sombras pesadas.
- Em fundo escuro, manter versão original.
- Em fundo claro, envolver em container escuro com padding de 12-16px e raio 12-16px.

## 5. Padrão de layout para dashboards de canais

Todos os blocos de canal (Google, Meta, LinkedIn, TikTok, Shopee, etc.) devem seguir o mesmo sistema:

1. Header do bloco:
- Ícone/logo do canal em "badge" quadrado
- Nome do canal em caixa alta
- Cor de destaque do título usando `--brand-primary` ou variação semântica do canal

2. Corpo:
- Cards KPI com mesma altura
- Valor grande no topo
- Label abaixo em caixa alta com tracking
- Ordem dos KPIs padronizada: Impressões, Cliques, Conversões/Leads, Investido

3. Consistência entre canais:
- Mesmo raio, altura, espaçamento e tipografia
- Apenas ícone e nomenclatura variam
- Nunca usar um card "mais simples" em um canal e "premium" em outro

## 6. Componentes base

## 6.1 Card KPI

- Fundo: `--bg-card`
- Borda: `--border-subtle`
- Padding: 32px (desktop), 20px (mobile)
- Valor: `--brand-primary`
- Label: `--text-secondary`
- Hover: leve elevação + borda mais visível

## 6.2 Botões

Primário:
- Fundo `--brand-primary`
- Texto preto
- Hover `--brand-primary-hover`

Secundário:
- Fundo transparente
- Borda `--border-subtle`
- Texto branco

## 6.3 Inputs

- Fundo `#0E1520`
- Borda `rgba(255,255,255,0.14)`
- Focus ring: `rgba(255,181,0,0.35)`

## 7. Motion

- Duração padrão: 180-240ms
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- Evitar animações longas e chamativas em áreas de dados
- Usar microinterações apenas para feedback (hover, foco, confirmação)

## 8. Acessibilidade

- Contraste mínimo AA em todos os textos
- Nunca depender só de cor para estado
- Tamanho mínimo de toque: 44x44px
- Labels claros para KPIs e inputs

## 9. Implementação em CSS (base sugerida)

```css
:root {
  --bg-base: #06080D;
  --bg-surface: #101723;
  --bg-card: #131D2B;
  --border-subtle: rgba(255,255,255,0.10);
  --text-primary: #FFFFFF;
  --text-secondary: #BDBDBD;
  --brand-primary: #FFB500;
  --brand-primary-hover: #FFD61B;
  --brand-primary-pressed: #E28A00;
  --brand-support: #BB6102;
  --radius-xl: 24px;
  --radius-lg: 20px;
}
```

## 10. Checklist de revisão UI/UX

Antes de subir qualquer tela:
- O logo é o oficial da VCD?
- O amarelo VCD está consistente (`#FFB500`)?
- Todos os cards de canais seguem o mesmo padrão de layout?
- Existe equilíbrio de contraste (texto legível)?
- Mobile mantém a hierarquia e legibilidade dos KPIs?
- A tela parece parte do ecossistema visual da VCD?
