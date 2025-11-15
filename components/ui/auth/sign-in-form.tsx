'use client'

import Link from 'next/link'
import { useId } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const styles = {
  container: 'w-full max-w-md',
  header: 'space-y-1',
  title: 'text-3xl font-bold',
  content: 'space-y-4',
  fieldGroup: 'space-y-2',
  footer: 'flex flex-col',
  button: 'w-full',
  prompt: 'mt-4 text-center text-sm',
  link: 'ml-2 text-primary hover:underline',
}

export function SigninForm() {
  return (
    <div className={styles.container}>
      <form>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign In</CardTitle>
            <CardDescription>Enter your details to sign in to your account</CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Email</Label>
              <Input id={useId()} name="identifier" placeholder="username or email" type="text" />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <Input id={useId()} name="password" placeholder="password" type="password" />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button className={styles.button}>Sign In</Button>
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Don&apos;t have an account?
          <Link className={styles.link} href="signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  )
}
