# diHelper (Mystera Legacy Web)

Extensão Chrome/Chromium (Manifest V3) que adiciona recursos de Qualidade de Vida (QoS) ao Mystera Legacy no navegador, rodando em `full.php`.

---

## Objetivo

Criar um overlay leve e integrado ao client web do jogo, utilizando a própria stack gráfica exposta (PIXI_GLOBAL / jv), adicionando ferramentas visuais auxiliares sem interferir na lógica do servidor.

A extensão é carregada automaticamente pelo Chrome quando a URL abaixo é acessada:

https://www.mysteralegacy.com/play/full.php

O carregamento ocorre via `content_script` (Manifest V3), injetando um bundle único (`dihelper.bundle.js`).

---

## Funcionalidades Planejadas

### Overlay Base
- Container PIXI_GLOBAL próprio (`dihelper_overlay`)
- Inicialização segura (aguarda PIXI_GLOBAL/jv)
- Controle de start/stop limpo
- Gerenciamento próprio de timers

### Botão INV+
- Fixo no canto inferior esquerdo
- Resize-safe
- Não interfere na UI original

### Inventário++
- Visualização read-only baseada em `item_data`
- Renderização por `.slot`
- Layout compacto (15x5)
- Transparência ajustável
- Cabeçalho informativo

### Destaques Visuais
- Bordas e marcações auxiliares nas áreas equivalentes ao painel original
- Somente renderização gráfica adicional

### Mob Labels
- Nome e level sobre entidades
- Start/stop controlado
- Sem impacto perceptível na performance

### Mini Radar (Opcional)
- Posição do player
- Posição de mobs
- Representação simplificada

### Informações Contextuais
- Coordenadas
- Nome do mapa (se disponível)
- Indicadores auxiliares

---

## Arquitetura

- Node.js (LTS)
- esbuild (bundle IIFE único)
- Chrome Extension MV3
- Injeção automática via content_script
- Código organizado em POO
- Cleanup seguro no destroy()

---

## Estrutura do Projeto
dihelper/
├── src/
├── public/
├── dist/
├── package.json
├── esbuild.config.js
└── README.md

---

## Roadmap

### Fase 1
- Extensão MV3 funcionando
- Overlay “diHelper ON”
- Botão INV+

### Fase 2
- Inventário++ renderizado corretamente

### Fase 3
- Labels + Radar

---

## Filosofia

- Código limpo
- Responsabilidade técnica
- Modularidade
- Performance
- Manutenção sustentável