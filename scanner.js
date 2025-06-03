// scanner.js
const PUMP_FUN_API = "https://pump.fun/api/launches/recent";

export async function getNewTokens(limit = 10) {
  try {
    const response = await fetch(`${PUMP_FUN_API}?limit=${limit}`);
    if (!response.ok) throw new Error("Erro ao buscar tokens");

    const data = await response.json();
    const tokens = data
      .filter(token => token && token.tokenAddress)
      .map(token => ({
        name: token.name,
        address: token.tokenAddress,
        creator: token.creator,
        volume: token.volume,
        marketCap: token.marketCap
      }));

    console.log(`🟢 ${tokens.length} tokens encontrados`);
    return tokens;
  } catch (error) {
    console.error("❌ Erro no scanner:", error.message);
    return [];
  }
}
