// decision.js

// Função para decidir se o token é elegível para compra
export function shouldBuyToken(tokenData) {
  const preco = tokenData.price;
  const volume = tokenData.volume;
  const liquidez = tokenData.liquidity;
  const minutosDesdeCriacao = tokenData.ageMinutes;
  const marketCap = tokenData.marketCap;

  // Lógica para tokens pequenos com potencial
  const precoAlvo = 0.01;
  const volumeMinimo = 3000;
  const liquidezMinima = 10000;
  const tempoMaximo = 60; // minutos
  const marketCapMax = 100000;

  const elegivel = (
    preco < precoAlvo &&
    volume > volumeMinimo &&
    liquidez > liquidezMinima &&
    minutosDesdeCriacao < tempoMaximo &&
    marketCap < marketCapMax
  );

  if (elegivel) {
    console.log("✅ Token elegível para compra:", tokenData);
  } else {
    console.log("❌ Token ignorado:", tokenData);
  }

  return elegivel;
}

// Estratégia de retenção de até 5h caso identifique potencial de 5x ou mais
export function shouldHold(tokenMetrics) {
  if (tokenMetrics.potentialMultiplier >= 5) {
    console.log("⏳ Token mantido por potencial de múltiplo:", tokenMetrics);
    return true;
  }
  return false;
}
