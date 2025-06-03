// scanner.js
export async function scanPumpFunTokens(limit = 5) {
  try {
    const response = await fetch("https://pump.fun/api/token/leaderboard");
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Formato de dados inesperado:", data);
      return [];
    }

    const topTokens = data.slice(0, limit).map(token => ({
      name: token.name,
      mint: token.mint,
      marketCap: token.marketCap,
      price: token.price
    }));

    console.log("🚀 Tokens encontrados no Pump.fun:", topTokens);
    return topTokens;
  } catch (error) {
    console.error("❌ Erro ao buscar tokens no Pump.fun:", error);
    return [];
  }
}
