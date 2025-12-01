export class HealthFixture {
  private name: string;
  private shouldFail: boolean;
  constructor(name: string, shouldFail: boolean) {
    this.name = name;
    this.shouldFail = shouldFail;
  }
  async fetchBalance(): Promise<{ balance: { USD: number } }> {
    if (!this.shouldFail) {
      throw new Error('API key invalid');
    }
    return { balance: { USD: 10000 } };
  }
}
