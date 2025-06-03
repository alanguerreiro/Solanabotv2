// scanner.js
async function scanTokens() {
  try {
    const response = await fetch("https://pump.fun/api/tokens");
    const tokens = await response.json();

    const recentTokens = tokens.filter(token => {
      const ageMinutes = (Date.now() - new Date(token.launchDate).getTime()) / 60000;
      return ageMinutes < 10 && token.liquidityUSD > 500;
    });

    console.log("Tokens encontrados:", recentTokens.length);
    return recentTokens;
  } catch (error) {
    console.error("Erro ao buscar tokens:", error);
    return [];
  }
}
