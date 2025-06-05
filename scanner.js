// scanner.js
const BIRDEYE_API_KEY = "f6238bead5294bc98607d0e4be6082d8";

async function buscarTokensPumpFun() {
  logToConsole("🔍 Buscando novos tokens no Pump.fun...");
  try {
    const response = await fetch("https://client-api.pump.fun/tokens?sort=createdAt&limit=10");
    const data = await response.json();

    const tokens = data?.tokens || [];
    logToConsole(`✅ ${tokens.length} tokens encontrados no Pump.fun`);

    for (const token of tokens) {
      const tokenInfo = {
        name: token.name,
        symbol: token.symbol,
        address: token.mint,
      };

      // Verifica dados adicionais com a Birdeye
      const detalhes = await fetch(
        `https://public-api.birdeye.so/public/token/basic-info?address=${tokenInfo.address}`,
        {
          headers: {
            "X-API-KEY": BIRDEYE_API_KEY,
            "accept": "application/json",
          },
        }
      );

      const detalhesJson = await detalhes.json();

      if (detalhesJson?.data?.price && detalhesJson?.data?.liquidity?.usd > 500) {
        logToConsole(`🚀 Token detectado com liquidez > $500: ${tokenInfo.symbol}`);
        avaliarCompra(tokenInfo); // Envia token para decision.js
      } else {
        logToConsole(`⚠️ Token ignorado: ${tokenInfo.symbol} - Baixa liquidez`);
      }
    }
  } catch (error) {
    logToConsole(`❌ Erro ao buscar tokens: ${error.message}`);
  }
}
