'use client';
import { LoginForm } from '@/components/Auth/login-form';

export default function SignInPage() {

  return (
    <div className=' flex flex-col items-center justify-center w-full min-h-screen py-10'>
      <div className="mb-8 flex flex-col items-center rounded-xl border border-zinc-200 bg-white/80 px-8 py-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900/70 max-w-md text-center">
        <h2 className="mb-2 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          Create a new account or use these demo credentials
        </h2>
        <div className="flex flex-col items-center gap-2 rounded-md bg-zinc-100 px-4 py-3 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          <div className="flex items-center gap-2">
            <span className="font-medium">Email:</span>
            <span className="select-all font-mono">demo@vettam.ai</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Password:</span>
            <span className="select-all font-mono">demo@1234</span>
          </div>
        </div>
      </div>
      <LoginForm />
    </div>
  );
}