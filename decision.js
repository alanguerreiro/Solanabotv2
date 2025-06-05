// decision.js

window.processarToken = async function (tokenData) {
  try {
    logConsole(`📊 Analisando token: ${tokenData.name} (${tokenData.symbol})`);

    // Lógica de decisão baseada no preço e volume
    const preco = parseFloat(tokenData.price);
    const volume = parseFloat(tokenData.volume || 0);

    // Regras de exemplo: entrar se o token for muito novo e barato
    if (preco < 0.01 && volume < 5000) {
      logConsole(`✅ Condições atendidas para compra de ${tokenData.symbol}. Executando swap...`);
      await executarSwap(tokenData.address);
    } else {
      logConsole(`❌ ${tokenData.symbol} não atende os critérios de compra.`);
    }
  } catch (error) {
    logConsole(`❌ Erro ao processar token ${tokenData.symbol}: ${error.message}`);
  }
};

// Função de swap simulada para testar (em produção, swap.js real fará isso)
async function executarSwap(tokenAddress) {
  try {
    logConsole(`🔄 Iniciando swap para token: ${tokenAddress}`);
    
    // Aqui chamaria window.realizarSwap(tokenAddress) no swap.js
    if (window.realizarSwap) {
      await window.realizarSwap(tokenAddress);
    } else {
      logConsole("⚠️ Função de swap real não implementada. Apenas simulação.");
    }
  } catch (error) {
    logConsole(`❌ Falha ao tentar swap: ${error.message}`);
  }
}
