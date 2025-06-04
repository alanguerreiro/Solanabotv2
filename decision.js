import { realizarSwap } from './swap.js';

let historicoCompras = {};

export async function analisarToken(tokenInfo) {
  const { address, name, symbol, volume, createdAt } = tokenInfo;

  const agora = Date.now();
  const idadeTokenMinutos = (agora - new Date(createdAt).getTime()) / 60000;

  if (idadeTokenMinutos > 5) {
    console.log(`Token ${symbol} tem mais de 5 minutos. Ignorado.`);
    return;
  }

  if (volume < 1000) {
    console.log(`Token ${symbol} com volume baixo (${volume}). Ignorado.`);
    return;
  }

  if (historicoCompras[address]) {
    console.log(`Token ${symbol} já comprado. Ignorado.`);
    return;
  }

  console.log(`🔍 Analisando ${symbol} (${address}) - Volume: ${volume}`);

  const resultadoSwap = await realizarSwap(address);
  console.log(`💰 Swap executado para ${symbol}: ${resultadoSwap}`);

  historicoCompras[address] = {
    compradoEm: agora,
    status: "comprado",
    nome: name,
    symbol,
  };
}
