'use client';

import { useEffect, useMemo, useState } from 'react';
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

export type Plan = {
  id: 'free' | 'pro' | 'ultra';
  name: string;
  price: string;
  description: string;
  badge?: string | null;
  features: string[];
};

export function SubscriptionClient({ plans }: { plans: Plan[] }) {
  const { user, loading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan['id'] | null>(null);
  const currentPlan = useMemo(() => selectedPlan, [selectedPlan]);
  const canSelectPlan = !loading && !!user;

  useEffect(() => {
    if (!loading && user && selectedPlan === null) {
      setSelectedPlan('free');
    }

    if (!loading && !user) {
      setSelectedPlan(null);
    }
  }, [loading, user, selectedPlan]);

  return (
    <>
      {!loading && !user && (
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
                  {plan.badge && (
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
    </>
  );
}
