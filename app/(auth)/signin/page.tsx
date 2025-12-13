import { SigninForm } from '@/components/ui/auth/sign-in-form'

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams
  return <SigninForm callbackUrl={callbackUrl} />
}
