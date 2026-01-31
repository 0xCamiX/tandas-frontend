import { redirect } from 'next/navigation'
import { AccountInfo } from '@/components/dashboard/account-info'
import { HeaderProfile } from '@/components/dashboard/header-profile'
import { getCurrentUserService } from '@/lib/services/user.service'

export default async function DashboardPage() {
  const userResponse = await getCurrentUserService()

  if (!userResponse.success) {
    redirect('/signin')
  }

  const user = userResponse.data

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <HeaderProfile email={user.email} image={user.image} name={user.name} />
      <AccountInfo user={user} />
    </div>
  )
}
