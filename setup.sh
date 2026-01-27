#!/bin/bash

echo "🚀 Iniciando configuração do projeto MYF'SP React..."
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale Node.js (v16+)"
    exit 1
fi

echo "✅ Node.js encontrado: $(node -v)"
echo "✅ npm encontrado: $(npm -v)"
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

echo ""
echo "✅ Instalação concluída!"
echo ""
echo "🎯 Próximos passos:"
echo "   1. Para iniciar o servidor de desenvolvimento: npm run dev"
echo "   2. Para fazer build: npm run build"
echo "   3. Para preview da build: npm run preview"
echo ""
echo "📂 Estrutura de pastas criada:"
echo "   - src/components/Questionnaire: Componentes do questionário"
echo "   - src/components/Common: Componentes compartilhados (Navbar, Footer)"
echo "   - src/pages: Páginas principais"
echo "   - public/imagens: Pasta para imagens"
echo ""
echo "🎨 Cores já configuradas em tailwind.config.js"
echo "📱 Layout totalmente responsivo com Tailwind CSS"
echo ""
echo "Tudo pronto! Execute 'npm run dev' para começar! 🎉"
