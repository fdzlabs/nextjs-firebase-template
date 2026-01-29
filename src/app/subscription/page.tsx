import {
  SubscriptionClient,
  type Plan,
} from '@/components/subscription/subscription-client';

const plans: Plan[] = [
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
      <SubscriptionClient plans={plans} />
    </main>
  );
}
