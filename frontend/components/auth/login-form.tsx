"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { type LoginFormValues } from "@/lib/validations/auth";
import { login } from "@/lib/api/auth";
import { useAuth, User } from "@/lib/context/auth-context";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const { login: loginUser } = useAuth();

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setError("");
      setLoading(true);

      const response = await login(values);

      // set auth
      const { email, roles, token } = response;
      loginUser(token, { email, roles } as User);

      router.push("/profile");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your ZRun account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
