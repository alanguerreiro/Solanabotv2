export async function buscarTokensPumpFun() {
  try {
    const res = await fetch("https://lite-api.jup.ag/tokens/v1/mints/tradable");
    const mints = await res.json();

    // Limita a 10 tokens para testes
    const tokens = mints.slice(0, 10).map((mint) => ({
      name: mint,
      address: mint
    }));

    return tokens;
  } catch (err) {
    console.error("Erro ao buscar tokens:", err);
    return [];
  }
}
