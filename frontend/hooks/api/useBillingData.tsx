import { useQuery } from "@tanstack/react-query";
import { BillingData } from "../../app/dashboard/settings/billing/billing";

export function useBillingData() {
  return useQuery({
    queryKey: ["billing"],
    queryFn: async (): Promise<BillingData> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        currentPlan: "Business",
        price: 99,
        billingCycle: "monthly",
        usageMetrics: {
          apiCalls: 50000,
          storageUsed: 250,
          activeUsers: 10,
          tokensSpent: 750000
        },
        dailyCosts: [
          { date: "03-01", cost: 12.5 },
          { date: "03-02", cost: 15.2 },
          { date: "03-03", cost: 8.7 },
          { date: "03-04", cost: 21.3 },
          { date: "03-05", cost: 16.8 },
          { date: "03-06", cost: 19.5 },
          { date: "03-07", cost: 14.2 },
        ]
      };
    },
  });
}