import { Jupiter, RouteMap, TOKEN_LIST_URL, createJupiterApiClient } from '@jup-ag/core';
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const jupiter = await createJupiterApiClient(connection);

// Token padrão (USDC → token de destino)
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

async function fazerSwap(tokenDestinoMint, publicKey, provider) {
  try {
    const amount = 5 * 10 ** 6; // $5 USDC = 5 * 10^6 (USDC tem 6 casas decimais)

    const routes = await jupiter.quoteGet({
      inputMint: USDC_MINT,
      outputMint: new PublicKey(tokenDestinoMint),
      amount,
      slippageBps: 500, // 5% de slippage
    });

    if (!routes || !routes.routesInfos || routes.routesInfos.length === 0) {
      console.warn("Nenhuma rota encontrada para o swap.");
      return;
    }

    const { swapTransaction } = await jupiter.exchange({
      routeInfo: routes.routesInfos[0],
      userPublicKey: publicKey,
    });

    const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));
    const signed = await provider.signAndSendTransaction(tx);
    console.log("Swap enviado:", signed);
    alert("Swap enviado com sucesso!");
  } catch (err) {
    console.error("Erro ao fazer swap:", err);
    alert("Erro ao realizar o swap.");
  }
}
