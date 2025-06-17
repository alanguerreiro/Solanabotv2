// scanner.js

const fetchNewTokens = async () => {
  try {
    const response = await fetch('https://api.pump.fun/api/launchpad/launches?limit=5');
    const data = await response.json();
    if (data && Array.isArray(data)) {
      return data.map(token => ({
        name: token.metadata?.name || "Unknown",
        symbol: token.metadata?.symbol || "TKN",
        address: token.tokenId,
        pair: token.tokenId,
      }));
    } else {
      console.error("Formato inválido:", data);
      return [];
    }
  } catch (error) {
    console.error("Erro ao buscar tokens:", error);
    return [];
  }
};

setInterval(async () => {
  const tokens = await fetchNewTokens();
  console.log("Novos tokens encontrados:", tokens);
  for (const token of tokens) {
    window.evaluateToken(token);
  }
}, 60000); // Executa a cada 60 segundos
