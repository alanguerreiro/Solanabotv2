import { Connection, Keypair, VersionedTransaction, PublicKey } from "@solana/web3.js";

let provider = window.solana;

async function swapToken(inputMint, outputMint, amount, connection, walletPublicKey) {
  const jupiter = await Jupiter.load({
    connection,
    cluster: "mainnet-beta",
    user: walletPublicKey,
  });

  const routes = await jupiter.computeRoutes({
    inputMint: new PublicKey(inputMint),
    outputMint: new PublicKey(outputMint),
    amount,
    slippage: 1, // 1%
    forceFetch: true,
  });

  const bestRoute = routes?.routesInfos[0];

  if (!bestRoute) {
    console.log("⚠️ No swap route found.");
    return;
  }

  const { execute } = await jupiter.exchange({ routeInfo: bestRoute });

  const swapResult = await execute();
  if (swapResult.error) {
    console.log("❌ Swap failed:", swapResult.error);
  } else {
    console.log("✅ Swap successful:", swapResult.txid);
  }
}

export async function executeSwap(inputMint, outputMint, amount) {
  try {
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    if (!provider?.isPhantom) {
      throw new Error("Phantom Wallet not found.");
    }

    const resp = await provider.connect();
    const walletPublicKey = new PublicKey(resp.publicKey.toString());

    await swapToken(inputMint, outputMint, amount, connection, walletPublicKey);
  } catch (err) {
    console.error("❌ Swap execution error:", err.message);
  }
}
