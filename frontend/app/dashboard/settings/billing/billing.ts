export interface BillingData {
  currentPlan: string;
  price: number;
  billingCycle: string;
  usageMetrics: {
    apiCalls: number;
    storageUsed: number;
    activeUsers: number;
    tokensSpent: number;
  };
  dailyCosts: Array<{
    date: string;
    cost: number;
  }>;
}