# LUNA CRM — Design System v1.0

## Fundamentos Visuais

A identidade do CRM parte de um tema escuro permanente, construído sobre uma base azul-ardósia profunda com um único acento de marca: o violeta Evenyx. A interface é densa em informação, então a cor tem função — indicar hierarquia, estado e urgência — e nunca decoração.

- **Tokens semânticos**: toda cor vem de uma variável de tema (primary, surface, success…)
- **Um só acento**: violeta marca ações primárias, itens ativos e destaques
- **Superfícies em camadas**: fundo → surface → surface elevada
- **Cor de estado padronizada**: verde (sucesso), âmbar (atenção), vermelho (risco), azul (informação)
- **Cantos generosos (1rem) e sombras suaves**: design moderno sem contornos pesados

---

## Paleta de Cores

### Base e Superfícies

| Amostra | Token | OKLCH | HEX | Uso |
|---------|-------|-------|-----|-----|
| | background | oklch(0.205 0.04 265) | #0E1629 | Fundo geral |
| | surface | oklch(0.27 0.04 260) | #1B273A | Painéis e cards |
| | surface-elevated | oklch(0.31 0.04 260) | #243145 | Hover, popovers |
| | card | oklch(0.27 0.04 260) | #1B273A | Cards, diálogos |
| | foreground | oklch(0.97 0.01 250) | #F0F6FC | Texto principal |
| | muted | oklch(0.32 0.035 260) | #283345 | Preenchimento neutro |
| | muted-foreground | oklch(0.72 0.02 260) | #9DA5B1 | Texto secundário |
| | border / input | oklch(0.32 0.035 260) | #283345 | Bordas |

### Marca

| Token | OKLCH | HEX | Uso |
|-------|-------|-----|-----|
| primary | oklch(0.62 0.23 295) | #955BFE | Violeta Evenyx: ações primárias |
| primary-glow | oklch(0.7 0.22 295) | #AC79FF | Brilho do botão primário (45% opacidade) |
| secondary | oklch(0.62 0.2 250) | #0087F8 | Azul de apoio |
| accent | oklch(0.34 0.05 280) | #333551 | Realce discreto |
| ring | oklch(0.62 0.23 295) | #955BFE | Anel de foco (acessibilidade) |

### Estados

| Token | OKLCH | HEX | Uso |
|-------|-------|-----|-----|
| success | oklch(0.7 0.18 155) | #00BE6A | Confirmado, pago, lead fechado |
| warning | oklch(0.83 0.17 85) | #F9BD01 | Atenção, prioridade alta |
| destructive | oklch(0.63 0.24 22) | #F92240 | Erro, exclusão, urgente |
| info | oklch(0.7 0.16 230) | #00AEEE | Informação, prioridade média |

**Textos:**
- Sobre success e warning: tom escuro (oklch(0.15 0 0))
- Sobre primary, destructive e info: branco (oklch(0.99 0 0))

### Gráficos

| Token | OKLCH | HEX | Série |
|-------|-------|-----|-------|
| chart-1 | oklch(0.62 0.23 295) | #955BFE | Principal (violeta) |
| chart-2 | oklch(0.62 0.2 250) | #0087F8 | Comparação (azul) |
| chart-3 | oklch(0.7 0.18 155) | #00BE6A | Positiva (verde) |
| chart-4 | oklch(0.83 0.17 85) | #F9BD01 | Atenção (âmbar) |
| chart-5 | oklch(0.63 0.24 22) | #F92240 | Risco (vermelho) |

### Menu Lateral

| Token | OKLCH | HEX | Uso |
|-------|-------|-----|-----|
| sidebar | oklch(0.23 0.04 263) | #131D30 | Fundo do menu |
| sidebar-foreground | oklch(0.92 0.01 250) | #E0E5EB | Items em repouso |
| sidebar-primary | oklch(0.62 0.23 295) | #955BFE | Item ativo |
| sidebar-accent | oklch(0.3 0.04 270) | #262D42 | Hover e acordeão |
| sidebar-border | oklch(0.3 0.035 260) | #232E40 | Divisórias |

---

## Gradientes, Sombras e Efeitos

| Efeito | Definição | Onde usar |
|--------|-----------|-----------|
| gradient-primary | linear-gradient(135°, #955BFE → #6054EC) | Botões de ação principal |
| text-gradient | linear-gradient(135°, #B893FF → #6281FF) | Números destaque e títulos |
| glass-card | Gradiente translúcido + blur 12px + borda branca 6% | Cards de KPI |
| shadow-soft | 0 4px 16px -4px preto 40% | Cards em repouso |
| shadow-elevated | 0 16px 48px -12px preto 50% | Hover, diálogos |
| shadow-glow | 0 0 32px -4px violeta 45% | Botão primário em foco |

**Hover-lift**: elemento sobe 2px + sombra elevada

---

## Tipografia

| Família | Uso | Detalhes |
|---------|-----|----------|
| Montserrat | Títulos (h1–h6), números destaque, logo | Peso 600–800; tracking -0.02em |
| Inter | Texto corrido, interface, tabelas, formulários | Pesos 400/500/600; recursos tipográficos ativados |

### Escala de Interface

| Nível | Tamanho | Aplicação |
|-------|---------|-----------|
| Título de página | 24–30px / semibold | Cabeçalho de cada tela |
| Título de seção | 16–18px / semibold | Blocos internos, títulos de card |
| Valor de KPI | 24–32px / bold | Números principais |
| Texto padrão | 14px / regular | Conteúdo, tabelas, formulários |
| Apoio | 12px / regular | Subtítulos, descrições |
| Micro-rótulo | 10–11px / semibold, caixa alta | Badges, tags |

---

## Forma e Espaçamento

**Raio base**: 1rem (16px) — mudá-lo reajusta todo o produto

| Token | Valor | Aplicação |
|-------|-------|-----------|
| radius-sm | 12px | Badges, tags, chips |
| radius-md | 14px | Inputs e botões pequenos |
| radius-lg | 16px | Botões e campos padrão |
| radius-xl | 20px | Cards, items Kanban, menus |
| radius-2xl | 24px | Painéis, tabelas |
| radius-3xl / 4xl | 28px / 32px | Superfícies grandes, modais |

### Ritmo de Espaçamento

- Páginas: respiro horizontal 24–32px
- Cards: padding 16–24px, distância 12–16px
- Tabelas: 12–16px horizontal, 12px vertical
- Kanban: colunas com largura fixa, rolagem horizontal

---

## Movimento e Transições

| Propriedade | Valor | Observação |
|-------------|-------|-----------|
| Duração | 200ms | Padrão global |
| Curva | cubic-bezier(0.4, 0, 0.2, 1) | Saída suave |
| Hover card | translateY(-2px) + shadow | hover-lift |
| Foco | Anel violeta | Navegação por teclado |
| Scrollbar | Polegar muted → accent | Trilha transparente, 10px |

---

## Componentes-Chave

### Menu Lateral
- Item ativo em violeta com fundo accent
- CRM em acordeão
- Items sem permissão ocultos

### Topbar
- Surface translúcido
- Busca, atalho de comando, avatar com iniciais

### Card de KPI
- glass-card
- Rótulo em muted-foreground, valor em Montserrat

### Card do Kanban
- card + borda
- Barra de prioridade, badge de temperatura
- Alerta vermelho em data limite

### Tabelas
- Card com cabeçalho surface
- Cabeçalho em caixa alta
- Linhas com hover em surface

### Badges
- Cor de estado a 15% de opacidade
- Texto na cor cheia, borda a 30%

### Botões
- **Primário**: gradient-primary, texto branco, shadow-glow
- **Ghost**: transparente para ações secundárias
- **Destrutivo**: vermelho apenas para exclusão

### Campos
- surface a 60%
- Borda input, anel violeta no foco
- Erro em destructive abaixo

### Diálogos
- card + shadow-elevated
- Cantos 24px, título sempre presente

---

## Cores Semânticas de Negócio

### Temperatura do Lead

| Temperatura | Cor | Uso |
|-------------|-----|-----|
| Quente | destructive (#F92240) | Negociação ativa |
| Morno | warning (#F9BD01) | Contato feito, aguardando |
| Frio | info (#00AEEE) | Sem interação recente |
| Fechado | success (#00BE6A) | Negócio ganho |

### Prioridade da Demanda

| Prioridade | Cor | Posição |
|------------|-----|---------|
| Urgente | destructive (#F92240) | 1ª posição |
| Alta | warning (#F9BD01) | 2ª posição |
| Média | info (#00AEEE) | 3ª posição |
| Baixa | muted (#283345) | Última posição |

### Etiquetas de Evento

| Etiqueta | Cor | Etiqueta | Cor |
|----------|-----|----------|-----|
| Alto Ticket | warning | Carnaval | secondary |
| Grande Evento | info | Camarote | destructive |
| Festival | success | Casa de Show | muted |
| São João | primary | Fim de Ano | accent |

---

## Boas Práticas

### ✅ Faça

- Usar tokens semânticos (bg-primary, text-muted-foreground)
- Reaproveitar utilidades do tema (gradient-primary, glass-card, hover-lift)
- Manter um único botão primário por área de decisão
- Aplicar cor de estado pelo significado
- Respeitar a escala tipográfica e raio base
- Garantir contraste do texto

### ❌ Não Faça

- Escrever cores fixas como text-white, bg-black ou hex direto
- Recriar gradientes e sombras à mão
- Empilhar vários botões violeta competindo
- Escolher cor por gosto visual
- Introduzir tamanhos e raios avulsos

---

## Referência Técnica de Tokens

Todos os tokens são variáveis CSS e expostos ao Tailwind como classes.

### Grupos de Tokens

**Base**: background, foreground, surface, surface-elevated, card, popover, muted, border, input

**Marca**: primary, primary-glow, secondary, accent, ring

**Estados**: success, warning, destructive, info (+ foreground variants)

**Gráficos**: chart-1 … chart-5

**Menu**: sidebar, sidebar-foreground, sidebar-primary, sidebar-accent, sidebar-border

**Forma**: radius (1rem base) + radius-sm, md, lg, xl, 2xl, 3xl, 4xl

**Tipografia**: font-sans (Inter), font-display (Montserrat)

**Sombras**: shadow-soft, shadow-elevated, shadow-glow

**Utilidades**: glass-card, hover-lift, gradient-primary, text-gradient

---

**Versão**: 1.0  
**Data**: 17/08/2026
