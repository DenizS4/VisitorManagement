import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-secondary">
      <div className="w-full max-w-md">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Account Created</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Your security guard account has been created successfully. Please check your email to verify your account.
            </p>
            <p className="text-sm text-muted-foreground">
              Once verified, you can sign in and start managing visitor access.
            </p>
            <Link href="/auth/login">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
