import { DashboardNav } from '@/components/ui/dashboard-nav'
import { Footer } from '@/components/ui/footer'

export default function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNav />
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 flex-1">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
