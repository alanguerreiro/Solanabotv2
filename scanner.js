async function buscarTokensPumpFun() {
  try {
    const response = await fetch("https://pump.fun/api/trending"); // ou outro endpoint válido
    const tokens = await response.json();

    // Filtro opcional, se tokens vierem com mais dados
    return tokens.slice(0, 10); // limita a 10 tokens para testes
  } catch (err) {
    console.error("❌ Erro ao buscar tokens:", err);
    return [];
  }
}
