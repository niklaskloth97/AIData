'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBillingData } from "@/hooks/api/useBillingData";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";import { BarChart, CartesianGrid, XAxis, Bar} from "recharts";
import { type ChartConfig } from "@/components/ui/chart"
import { Monitor, DollarSign} from "lucide-react"
import PageHeader from "@/components/PageHeader";

export default function Page() {
  const { data: billingData, isLoading } = useBillingData();

  if (isLoading) return <div>Loading...</div>;
  if (!billingData) return <div>Error loading billing data</div>;

  const chartConfig: ChartConfig = {
    date: {
      label: "Date",
      color: "var(--ercis-red-dark)",
    },
    cost: {
      label: "Daily Costs",
      color: "var(--ercis-red-dark)",
    },
  };
  

  const chartData = billingData.dailyCosts.map(item => ({
    date: item.date,
    cost: item.cost,
  }));

  return (
    <div>
      <PageHeader heading="Billing" subtext="Manage your subscription and payment details" />
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Card stays the same */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">${billingData.price}/month</p>
              <p>Plan: {billingData.currentPlan}</p>
              <p>Billing cycle: {billingData.billingCycle}</p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Metrics Card stays the same */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Metrics</CardTitle>
            <CardDescription>Current period usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Tokens Spent</span>
                <span>{billingData.usageMetrics.tokensSpent}/1,000,000</span>
              </div>
              <Progress value={(billingData.usageMetrics.tokensSpent / 1000000) * 100} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Storage</span>
                <span>{billingData.usageMetrics.storageUsed}GB/500GB</span>
              </div>
              <Progress value={billingData.usageMetrics.storageUsed / 5} />
            </div>
          </CardContent>
        </Card>

        {/* Updated Chart Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Daily Token Costs</CardTitle>
            <CardDescription>Cost breakdown for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cost" fill="var(--ercis-red-dark)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}