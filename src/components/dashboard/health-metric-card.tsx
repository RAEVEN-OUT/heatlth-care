"use client";

import {
  Area,
  AreaChart,
  Tooltip,
} from "recharts";
import { Droplets, Footprints, HeartPulse } from "lucide-react";
import type { HealthMetric } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

type HealthMetricCardProps = {
  metric: HealthMetric;
};

const iconMap = {
    "heart-rate": HeartPulse,
    "blood-oxygen": Droplets,
    "steps": Footprints,
}

export function HealthMetricCard({ metric }: HealthMetricCardProps) {
  const { name, value, unit, data, id } = metric;

  const Icon = useMemo(() => iconMap[id as keyof typeof iconMap] || HeartPulse, [id]);

  const chartConfig = {
    value: {
      label: name,
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{name}</CardTitle>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <div>
          <span className="text-4xl font-bold">{value}</span>
          <span className="text-sm text-muted-foreground ml-2">{unit}</span>
        </div>
        <div className="h-24 w-full mt-4">
          <ChartContainer config={chartConfig} className="h-full w-full p-0">
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 0,
              }}
              accessibilityLayer
            >
              <defs>
                <linearGradient id={`fill${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-value)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-value)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />
              <Area
                dataKey="value"
                type="natural"
                fill={`url(#fill${metric.id})`}
                stroke="var(--color-value)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
