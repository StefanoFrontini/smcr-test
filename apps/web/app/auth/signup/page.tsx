import { SignupForm } from "@/components/auth/signup";
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
          <CardTitle className="text-2xl">Sign Up</CardTitle>

          <CardDescription>
            Enter your email address to create your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SignupForm />

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/auth/login" className="underline underline-offset-4">
              Log In
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
