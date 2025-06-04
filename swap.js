import { Jupiter, RouteMap, TOKEN_LIST_URL } from "@jup-ag/core";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getSwapTransaction } from "@jup-ag/core";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

export async function realizarSwap(tokenAddress) {
  try {
    const provider = window.phantom?.solana;
    if (!provider || !provider.publicKey) throw new Error("Carteira não conectada");

    const inputAmount = 5 * 10 ** 6; // $5 em USDC (com 6 casas decimais)

    const jupiter = await Jupiter.load({
      connection,
      cluster: "mainnet-beta",
      user: provider.publicKey,
    });

    const routes = await jupiter.computeRoutes({
      inputMint: USDC_MINT,
      outputMint: new PublicKey(tokenAddress),
      amount: inputAmount,
      slippage: 15, // 15% stop loss
      forceFetch: true,
    });

    if (!routes || !routes.routesInfos || routes.routesInfos.length === 0) {
      return "Nenhuma rota de swap encontrada.";
    }

    const { swapTransaction } = await jupiter.exchange({
      routeInfo: routes.routesInfos[0],
    });

    const txid = await provider.signAndSendTransaction(swapTransaction);
    return `Swap realizado com sucesso. TX: ${txid}`;
  } catch (error) {
    return `Erro ao executar swap: ${error.message}`;
  }
}
