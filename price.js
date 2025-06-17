// price.js

const fetch = require('node-fetch');

const BIRDEYE_API_KEY = 'f6238bead5294bc98607d0e4be6082d8';

async function getPrice(mintAddress) {
  try {
    const url = `https://public-api.birdeye.so/public/price?address=${mintAddress}`;
    const res = await fetch(url, {
      headers: {
        'X-API-KEY': BIRDEYE_API_KEY
      }
    });

    const data = await res.json();

    if (data && data.data && data.data.value) {
      return data.data.value; // preço em USD
    } else {
      console.log(`⚠️ Token ${mintAddress} sem preço detectado.`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erro ao buscar preço para ${mintAddress}:`, error);
    return null;
  }
}

module.exports = { getPrice };
