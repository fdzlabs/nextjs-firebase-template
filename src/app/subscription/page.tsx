'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

import { useAuth } from '@/components/auth-provider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

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

export default function SubscriptionPage() {
  const { user, loading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const currentPlan = useMemo(() => selectedPlan, [selectedPlan]);
  const canSelectPlan = !loading && !!user;

  return (
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

      {!canSelectPlan && (
        <Alert>
          <AlertDescription className="flex flex-wrap items-center gap-1">
            <span>Please</span>
            <Link className="underline" href={ROUTES.AUTH.SIGNIN}>
              sign in
            </Link>
            <span>before selecting a plan.</span>
          </AlertDescription>
        </Alert>
      )}

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
                  disabled={!canSelectPlan}
                >
                  {isCurrent ? 'Current plan' : 'Select plan'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
