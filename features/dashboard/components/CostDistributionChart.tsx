"use client";

/**
 * Cost Distribution Chart Component
 * 
 * Displays a bar chart showing the cost distribution of top recipes.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Recipe } from "@/types";
import { formatCurrency } from "@/lib/formatters";

interface CostDistributionChartProps {
  recipes: Recipe[];
}

export function CostDistributionChart({ recipes }: CostDistributionChartProps) {
  // Get top 5 recipes by cost
  const topRecipes = [...recipes]
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, 5)
    .map((recipe) => ({
      name: recipe.name.length > 15 ? `${recipe.name.substring(0, 15)}...` : recipe.name,
      cost: recipe.totalCost,
      fullName: recipe.name,
    }));

  if (topRecipes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Distribution</CardTitle>
          <CardDescription>Top 5 recipes by cost</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recipes available for chart
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-semibold">{payload[0].payload.fullName}</p>
          <p className="text-sm text-muted-foreground">
            Cost: <span className="font-medium">{formatCurrency(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Distribution</CardTitle>
        <CardDescription>Top 5 recipes by total cost</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topRecipes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              className="text-xs"
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="cost"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

