# 🛡️ Motor de Auditoria e Conformidade - Polícia RCC

Este projeto é um motor de validação front-end de alta performance desenvolvido para auditar perfis, fardamentos, missões e associações de usuários do Habbo Hotel, garantindo a conformidade estrita com o **Código de Conduta Militar (Anexo I)** da Polícia RCC.

O sistema consome a API REST pública da Sulake (Habbo) e cruza os dados extraídos (`figureString`, `motto`, `groups`) com um dicionário de regras estatutárias locais.

## ✨ Funcionalidades Principais

* **Validação Léxica de Missão:** Extração de patentes via Regex e bloqueio de abreviações irregulares.
* **Filtro Anti-Bot e Comandos:** Detecção de repetições excessivas de caracteres e comandos bloqueados no nickname (ex: `porta1`, `:sit`).
* **Auditoria de Fardamento Paramétrica:** Quebra estrutural da string visual para auditar o uso correto de barbas, óculos, chapéus, cintos e tons de pele com base na patente atual.
* **Varredura Anti-Concorrência:** Leitura de grupos do perfil para detecção imediata de filiação a polícias ou organizações rivais.
* **Sistema de Cache em Memória:** Mitigação de *Rate Limit* (429 Too Many Requests) guardando dados de usuários já consultados durante a sessão ativa.

## 🏗️ Arquitetura e Padrões de Projeto

O projeto foi refatorado para abandonar o paradigma de "scripts procedurais" em favor da **Engenharia de Software Moderna**, aplicando:

* **Separação de Responsabilidades (SoC):** Divisão clara entre Dados, Regras de Negócio, Interface e Orquestração.
* **ES6 Modules:** Escopos isolados via `import`/`export`, evitando poluição do objeto global `window`.
* **Imutabilidade (Deep Freeze):** O arquivo de configuração (`config.js`) é protegido contra mutações acidentais em tempo de execução.
* **Design Responsivo e Autônomo:** Interface rica baseada em CSS puro, dispensando bibliotecas externas ou CDNs sujeitas a bloqueios de rede.

## 📂 Estrutura de Diretórios

```text
/
├── index.html           # Entry point e estrutura semântica (UI)
├── style.css            # Estilização corporativa (Dark Mode)
├── config.js            # Dicionários imutáveis (Estatuto, Cores, IDs)
├── api.service.js       # Camada de rede e gerenciamento de Cache (Fetch)
├── validator.js         # Lógica de negócio pura e expressões regulares
├── ui.controller.js     # Manipulação isolada do DOM
└── app.js               # Orquestrador (liga a UI, o Validator e a API)
