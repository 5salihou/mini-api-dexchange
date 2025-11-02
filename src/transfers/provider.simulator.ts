export class ProviderSimulator {
  async processTransferWave() {
    const random = Math.random();
    await new Promise((r) => setTimeout(r, 2000));

    if (random < 0.7) {
      return {
        status: 'SUCCESS',
        provider_ref: 'WAVE-' + Math.floor(Math.random() * 1000000),
      };
    } else {
      return {
        status: 'FAILED',
        error_code: 'ERR-' + Math.floor(Math.random() * 1000),
      };
    }
  }

  async processTransferOM() {
    const random = Math.random();
    await new Promise((r) => setTimeout(r, 2000));
    if (random < 0.7) {
      return {
        status: 'SUCCESS',
        provider_ref: 'OM-' + Math.floor(Math.random() * 1000000),
      };
    } else {
      return {
        status: 'FAILED',
        error_code: 'ERR-' + Math.floor(Math.random() * 1000),
      };
    }
}
}
