# Planejamento do Produto - Minha Fila

O Minha Fila é projetado para transformar a gestão de filas em pequenos negócios, eliminando a confusão de senhas de papel e gritos no balcão. Operando como uma plataforma multi-empresa, ele permite que proprietários gerenciem um ou mais estabelecimentos a partir de um único painel centralizado.

Público-Alvo
------------
- **Food Trucks & Carrinhos**: Mobilidade total sem necessidade de hardware caro.
- **Creperias & Lanchonetes**: Operações rápidas que necessitam de organização visual clara.
- **Eventos Sazonais**: Facilidade de setup em feiras, praias e festivais.

Conceitos Fundamentais (SaaS)
-----------------------------
1. **Multi-empresa (Multi-tenancy)**: Cada usuário pode possuir várias "Filas" ou "Empresas". Cada empresa tem seu próprio conjunto de pedidos, sequências e configurações.
2. **Domínio Unificado**: Toda a operação ocorre em `https://minha-fila.meugarcom.app`. O acesso é diferenciado por caminhos:
   - `/`: Landing Page / Vendas.
   - `/auth/*`: Portal de acesso (Google/Magic Link).
   - `/fila/`: Dashboard do proprietário (Lista de empresas).
   - `/fila/[uuid]/admin`: Gestão da fila específica.
   - `/fila/[uuid]`: Link público para clientes acompanharem pedidos (QR Code).

Funcionalidades de Gestão (MVP+)
--------------------------------
- **Gestão de Pedidos**: Criação rápida de pedidos com labels (Nomes ou Números).
- **Controle de Status**: Alteração fluida entre Aguardando -> Preparando -> Pronto -> Entregue.
- **Realtime Dashboard**: Acompanhamento automático em tablets, monitores ou TVs na cozinha/salão.
- **Configurações por Empresa**: Personalização do nome, logo e reinício da sequência de pedidos.

Vantagens Competitivas
----------------------
- **Zero Instalação**: Funciona diretamente no navegador (Mobile-first PWA).
- **Baixo Custo**: Modelo SaaS acessível.
- **Velocidade**: Sincronização instantânea via WebSockets.
- **UX Premium**: Design moderno, intuitivo e com foco em alta conversão.

---

Este documento serve como a "Fonte da Verdade" para o propósito e direcionamento do produto Minha Fila.
