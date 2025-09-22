import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/server/actions";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing up..." : "Sign Up"}
    </Button>
  );
}

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction] = React.useActionState(signUp, { error: null, success: false });
  const [pending, setPending] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
    }
  }, [state.success, router]);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    await formAction(formData);
    setPending(false);
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-md", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              {state?.error && (
                <div className="text-red-500 text-sm">{state.error}</div>
              )}
              <div className="flex flex-col gap-3">
                <SubmitButton pending={pending} />
                <Button variant="outline" className="w-full">
                  Sign up with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/auth/sign-in" className="underline underline-offset-4">
                Log in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}