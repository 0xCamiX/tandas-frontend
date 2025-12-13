import { SignupForm } from '@/components/ui/auth/sign-up-form'

type SignupPageProps = {
  searchParams: Promise<{
    callbackUrl?: string
  }>
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { callbackUrl } = await searchParams
  return <SignupForm callbackUrl={callbackUrl} />
}
