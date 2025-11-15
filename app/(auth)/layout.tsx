import { Navbar } from '@/components/ui/navbar'

export default function AuthLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center">{children}</main>
    </div>
  )
}
