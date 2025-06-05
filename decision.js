import { executarSwap } from './swap.js';

let ativos = {};

export async function analisarToken(token) {
    if (ativos[token.address]) return;

    console.log(`📈 Analisando token: ${token.name} (${token.address})`);

    const deveComprar = true; // Aqui você pode colocar lógica futura de volume, holders, etc.

    if (deveComprar) {
        console.log(`✅ Executando compra de ${token.name}`);
        const resultado = await executarSwap(token);

        if (resultado.status === "sucesso") {
            ativos[token.address] = {
                nome: token.name,
                compradoEm: Date.now(),
                txCompra: resultado.assinatura,
                status: "comprado",
                precoCompra: token.price, // se você tiver isso vindo do scanner
            };
            console.log(`🛒 Compra efetuada! TX: ${resultado.assinatura}`);
        } else {
            console.error(`Erro ao comprar ${token.name}: ${resultado.mensagem}`);
        }
    }
}
