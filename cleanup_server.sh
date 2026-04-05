#!/bin/bash
# Reorganização de Diretórios - Minha Fila
# Este script deve ser executado no VPS (/root/)

set -e

echo "🚀 Iniciando reorganização do projeto Minha Fila..."

# 1. Preparar Pasta de Secrets
echo "🔑 Configurando /root/minha-fila-secrets..."
mkdir -p /root/minha-fila-secrets

# Tentar localizar o .env.prod correto
if [ -f "/root/minha-fila/secrets/.env.prod" ]; then
    cp "/root/minha-fila/secrets/.env.prod" "/root/minha-fila-secrets/.env.prod"
    echo "✓ .env.prod copiado de /root/minha-fila/secrets/"
elif [ -f "/root/minhafila-secrets/secrets/.env.prod" ]; then
    cp "/root/minhafila-secrets/secrets/.env.prod" "/root/minha-fila-secrets/.env.prod"
    echo "✓ .env.prod copiado de /root/minhafila-secrets/secrets/"
else
    echo "⚠️ .env.prod não encontrado nos locais esperados. Por favor, mova-o manualmente para /root/minha-fila-secrets/.env.prod"
fi

# 2. Consolidar Código
echo "📦 Organizando código em /root/minha-fila..."
if [ -d "/root/minha-fila/project" ]; then
    # Move conteúdo de project para a raiz se necessário
    # Cuidado: se já houver arquivos na raiz que conflitem, o rsync é mais seguro
    rsync -av /root/minha-fila/project/ /root/minha-fila/
    echo "✓ Conteúdo de 'project/' movido para a raiz de 'minha-fila/'"
fi

# 3. Limpeza de "Lixo"
echo "🧹 Removendo diretórios redundantes..."

# Remove o antigo minhafila-secrets
rm -rf /root/minhafila-secrets

# Remove pastas internas que agora estão no topo ou em outro lugar
rm -rf /root/minha-fila/secrets
rm -rf /root/minha-fila/build
rm -rf /root/minha-fila/project

# Opcional: Limpar backups antigos (Descomente se desejar)
# rm -rf /root/minha-fila/backups/*

echo "✅ Organização concluída!"
echo "Novo Layout:"
echo "  Code:    /root/minha-fila"
echo "  Secrets: /root/minha-fila-secrets"
echo ""
echo "⚠️  Lembre-se de rodar um novo Deploy pelo GitHub Actions para garantir que os caminhos foram sincronizados."
