async function buscarTokensPumpFun() {
  try {
    const response = await fetch("https://pump.fun/api/trending");
    const tokens = await response.json();

    console.log("Tokens encontrados:", tokens);
    return tokens;
  } catch (err) {
    console.error("Erro ao buscar tokens:", err);
    return [];
  }
}
