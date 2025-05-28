import { LoginForm } from "@/components/auth/login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";

export default function Page() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className="md:w-1/4">
        <CardHeader>
          <CardTitle className="text-2xl">Log In</CardTitle>

          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/auth/signup" className="underline underline-offset-4">
              Sign Up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
