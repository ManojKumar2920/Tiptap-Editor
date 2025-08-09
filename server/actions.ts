"use server";
import { z } from "zod";
import { auth } from "@/lib/auth";

const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export async function signIn(prevState: any, formData: FormData) {
  try {
    const data = SignInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });
    

    return { error: null, success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues.map((e) => e.message).join(", ") };
    }
    return { error: (error as Error).message || "Invalid email or password" };
  }
}

const SignUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  });

export async function signUp(prevState: any, formData: FormData) {
    try {
      const data = SignUpSchema.parse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      });
  
      await auth.api.signUpEmail({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
  
      return { error: null, success: true };
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return { error: error.issues.map((e) => e.message).join(", ") };
      }
      return { error: error.message || "Sign up failed", success: false };
    }
  }