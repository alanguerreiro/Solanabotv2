const BUY_AMOUNT_USDC = 5;
const PROFIT_TARGET_PERCENT = 100;
const STOP_LOSS_PERCENT = 15;
const HOLD_MAX_HOURS = 5;

async function shouldBuyToken(tokenInfo) {
    // Aqui você pode adicionar critérios mais avançados se quiser
    return tokenInfo.symbol && tokenInfo.address;
}

async function shouldSellToken(purchaseData, currentPrice) {
    const { buyPrice, timestamp } = purchaseData;
    const profitPercent = ((currentPrice - buyPrice) / buyPrice) * 100;
    const hoursHeld = (Date.now() - timestamp) / (1000 * 60 * 60);

    if (profitPercent >= PROFIT_TARGET_PERCENT) {
        return true; // Vender com lucro
    }

    if (profitPercent <= -STOP_LOSS_PERCENT) {
        return true; // Stop loss
    }

    if (hoursHeld >= HOLD_MAX_HOURS) {
        return true; // Tempo máximo de espera
    }

    return false;
}
