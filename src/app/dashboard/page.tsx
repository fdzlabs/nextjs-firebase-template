import { DashboardClient } from '@/components/dashboard/dashboard-client'

export default function Dashboard() {
  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <DashboardClient />
    </main>
  )
}
