// swap.js
import { Jupiter, RouteMap, createJupiterApiClient } from '@jup-ag/core';
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';

const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC SPL
const connection = new Connection(RPC_ENDPOINT);
const jupiter = createJupiterApiClient();

export async function executeSwap({ wallet, inputMint, outputMint, amount }) {
  try {
    const routes = await jupiter.quoteGet({
      inputMint,
      outputMint,
      amount: amount * 10 ** 6, // USDC has 6 decimals
      slippageBps: 500, // 5% slippage
      onlyDirectRoutes: false
    });

    if (!routes || !routes.data || routes.data.length === 0) {
      console.error("⚠️ Nenhuma rota encontrada para o swap.");
      return;
    }

    const bestRoute = routes.data[0];
    const swapResponse = await jupiter.swapPost({
      swapRequest: {
        route: bestRoute,
        userPublicKey: wallet.publicKey.toString()
      }
    });

    const { swapTransaction } = swapResponse;
    if (!swapTransaction) {
      console.error("❌ Falha ao gerar transação de swap.");
      return;
    }

    const txBuf = Buffer.from(swapTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(txBuf);

    const signed = await wallet.signAndSendTransaction(transaction);
    console.log("✅ Swap enviado! TX:", signed);
  } catch (err) {
    console.error("❌ Erro durante o swap:", err.message || err);
  }
}
