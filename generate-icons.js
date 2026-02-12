/**
 * Script para gerar ícones PWA em todos os tamanhos necessários
 * 
 * Uso:
 * 1. Instalar dependência: npm install sharp
 * 2. Colocar imagem original (logo-original.png) na raiz do projeto
 * 3. Executar: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Verificar se sharp está instalado
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Erro: Sharp não está instalado!');
  console.log('📦 Instale com: npm install sharp');
  process.exit(1);
}

// Configurações
const INPUT_IMAGE = 'logo.svg'; // Imagem de entrada (suporta SVG, PNG, JPEG)
const OUTPUT_DIR = path.join(__dirname, 'assets', 'icons');
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Cores do WR10 para background (caso queira adicionar)
const BG_COLOR = { r: 45, g: 122, b: 62, alpha: 1 }; // #2d7a3e

async function generateIcons() {
  console.log('🎨 Gerador de Ícones PWA - WR10\n');

  // Verificar se o arquivo de entrada existe
  if (!fs.existsSync(INPUT_IMAGE)) {
    console.error(`❌ Arquivo não encontrado: ${INPUT_IMAGE}`);
    console.log('\n💡 Dicas:');
    console.log('   1. Coloque sua logo/imagem na raiz do projeto');
    console.log('   2. Formatos suportados: SVG, PNG, JPEG, WebP');
    console.log('   3. Ou edite INPUT_IMAGE neste script\n');
    process.exit(1);
  }

  // Verificar se o diretório de saída existe
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log(`📁 Criando diretório: ${OUTPUT_DIR}`);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`📸 Imagem de entrada: ${INPUT_IMAGE}`);
  console.log(`📁 Diretório de saída: ${OUTPUT_DIR}\n`);

  // Obter informações da imagem original
  try {
    const metadata = await sharp(INPUT_IMAGE).metadata();
    console.log(`ℹ️  Imagem original: ${metadata.width}x${metadata.height} (${metadata.format})\n`);

    if (metadata.width < 512 || metadata.height < 512) {
      console.warn('⚠️  AVISO: Imagem menor que 512x512. Qualidade pode ser afetada!\n');
    }
  } catch (error) {
    console.error('❌ Erro ao ler metadados:', error.message);
    process.exit(1);
  }

  // Gerar ícones
  console.log('🔄 Gerando ícones...\n');
  let successCount = 0;
  let errorCount = 0;

  for (const size of SIZES) {
    const outputFile = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    
    try {
      // Para SVG, usar densidade para melhor qualidade
      const sharpInstance = sharp(INPUT_IMAGE, {
        density: 300 // Alta densidade para SVG
      });
      
      await sharpInstance
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Fundo transparente
        })
        .png({ quality: 100 })
        .toFile(outputFile);

      console.log(`✅ Gerado: icon-${size}x${size}.png`);
      successCount++;
    } catch (error) {
      console.error(`❌ Erro ao gerar ${size}x${size}:`, error.message);
      errorCount++;
    }
  }

  // Resumo
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Resumo:`);
  console.log(`   ✅ Sucesso: ${successCount}/${SIZES.length}`);
  console.log(`   ❌ Erros: ${errorCount}`);
  console.log('='.repeat(50) + '\n');

  if (successCount === SIZES.length) {
    console.log('🎉 Todos os ícones foram gerados com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Verificar os ícones em: assets/icons/');
    console.log('   2. Testar o PWA em Chrome DevTools > Application > Manifest');
    console.log('   3. Instalar o app e verificar se o ícone aparece corretamente\n');
  } else {
    console.log('⚠️  Alguns ícones não foram gerados. Verifique os erros acima.\n');
  }
}

// Executar
generateIcons().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
