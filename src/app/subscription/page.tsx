'use client';

import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';

import ProtectedRoute from '@/components/protected-route';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type PlanId = 'free' | 'pro' | 'ultra';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 'Free',
    description: 'To get started and try the app.',
    badge: null,
    features: [
      'Basic access to the platform',
      'Standard limits',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$20 / month',
    description: 'For users who rely on the app daily.',
    badge: 'Popular',
    features: [
      'Everything in Free',
      'Higher limits and priority',
      'Email support',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: '$60 / month',
    description: 'For teams or heavy usage.',
    badge: null,
    features: [
      'Everything in Pro',
      'More capacity and priority',
      'Priority support',
    ],
  },
] as const;

function SubscriptionSkeleton() {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col gap-8 px-4 py-10">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={`subscription-skeleton-${index}`}
            className="overflow-hidden"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-4 w-48" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('free');
  const currentPlan = useMemo(() => selectedPlan, [selectedPlan]);

  return (
    <ProtectedRoute skeleton={<SubscriptionSkeleton />}>
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col gap-8 px-4 py-10">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Subscription</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Choose the ideal plan for you
          </h1>
          <p className="text-sm text-muted-foreground">
            This is a mock for now. No charges will be made.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative overflow-hidden',
                  isCurrent && 'border-primary shadow-sm'
                )}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    {plan?.badge && (
                      <Badge variant="secondary">{plan.badge}</Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-semibold">{plan.price}</p>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    className="w-full"
                    variant={isCurrent ? 'secondary' : 'default'}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {isCurrent ? 'Current plan' : 'Select plan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </ProtectedRoute>
  );
}
