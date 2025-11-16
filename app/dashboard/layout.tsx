import { DashboardNav } from '@/components/ui/dashboard-nav'
import { Footer } from '@/components/ui/footer'
import { getCurrentUserService } from '@/lib/services/user.service'

export default async function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const userResponse = await getCurrentUserService()
  const user = userResponse.success ? userResponse.data : null

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNav user={user} />
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 flex-1">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
