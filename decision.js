// decision.js

const PROFIT_TARGET = 3.0;  // 3x = +200%
const STOP_LOSS = 0.8;      // -20%

window.activeTrades = {}; // Armazena as compras ativas

window.evaluateToken = async (token) => {
  if (window.activeTrades[token.address]) return;

  console.log(`🔍 Avaliando token: ${token.name} (${token.symbol})`);

  const buyAmount = 5; // USD
  const buyPrice = await window.getPriceInUSD(token.address);
  if (!buyPrice) return console.log("Preço de compra não encontrado.");

  const tokenAmount = buyAmount / buyPrice;
  window.activeTrades[token.address] = {
    ...token,
    buyPrice,
    tokenAmount,
    buyTime: Date.now()
  };

  console.log(`💰 Comprando ${token.symbol} por $${buyAmount}...`);
  await window.swap('USDC', token.address, buyAmount);
};

window.monitorPrices = async () => {
  for (const tokenAddress in window.activeTrades) {
    const trade = window.activeTrades[tokenAddress];
    const currentPrice = await window.getPriceInUSD(tokenAddress);

    if (!currentPrice) continue;

    const priceChange = currentPrice / trade.buyPrice;

    if (priceChange >= PROFIT_TARGET) {
      console.log(`🚀 Vendendo ${trade.symbol} com +${((priceChange - 1) * 100).toFixed(2)}% lucro`);
      await window.swap(tokenAddress, 'USDC', trade.tokenAmount);
      delete window.activeTrades[tokenAddress];
    } else if (priceChange <= STOP_LOSS) {
      console.log(`🔻 Vendendo ${trade.symbol} com -${((1 - priceChange) * 100).toFixed(2)}% prejuízo`);
      await window.swap(tokenAddress, 'USDC', trade.tokenAmount);
      delete window.activeTrades[tokenAddress];
    } else {
      console.log(`⏳ Aguardando ${trade.symbol}: Atual = ${priceChange.toFixed(2)}x`);
    }
  }
};

setInterval(window.monitorPrices, 30000); // Checa a cada 30 segundos
