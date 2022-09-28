/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

export class CoinFlip {
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;    
  }

  async getScoreOf(player) {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'points_of', args: {player} });
  }

  async flipCoin(side) {
    return await this.wallet.callMethod({ contractId: this.contractId, method: 'flip_coin', args: { player_guess: side } });
  }
}