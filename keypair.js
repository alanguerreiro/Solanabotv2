const fs = require('fs');
const bs58 = require('bs58');
const { Keypair } = require('@solana/web3.js');

// 🔐 Sua chave privada em Base58 (NÃO é a seed, é a private key):
const PRIVATE_KEY_BASE58 = '51dyWaLNZYpTuV4dwznxvPcyuMCMujfu7uUXfvgxodRY5UE8poGEyUPfPJW5aS9SgqZdeKLBQnXwFxounYRCQCXh';

try {
  // Decodifica a chave
  const secretKey = bs58.decode(PRIVATE_KEY_BASE58);

  // Cria o keypair
  const keypair = Keypair.fromSecretKey(secretKey);

  // Salva em formato .json
  fs.writeFileSync('keypair.json', JSON.stringify(Array.from(keypair.secretKey)));
  console.log('✅ keypair.json gerado com sucesso!');
} catch (err) {
  console.error('❌ Erro ao gerar o keypair:', err.message);
}
