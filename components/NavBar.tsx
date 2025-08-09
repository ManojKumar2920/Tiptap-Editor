"use client"

import Link from "next/link"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Navbar() {
  return (
    <div className="fixed inset-x-0 top-4 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <nav
          aria-label="Primary"
          className="flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/70 px-3 py-2 shadow-lg shadow-zinc-900/5 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800/80 dark:bg-zinc-950/60 dark:shadow-black/20"
        >
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-2 py-1 focus:outline-none0"
          >
            <Image src={'/vettam-logo-color.svg'} alt="Vettam AI" width={100} height={100} />
          </Link>

          {/* Links */}
          <div className="mx-auto hidden items-center gap-1 sm:flex">
            <Link
              href="#editor"
              className="rounded-full px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-white"
            >
              Editor
            </Link>
            <Link
              href="#features"
              className="rounded-full px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#docs"
              className="rounded-full px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-white"
            >
              Docs
            </Link>
          </div>

          <div className="ml-auto flex items-center">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-white"
            >
              <a href="https://github.com/ManojKumar2920/Tiptap-Editor" target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              className="ml-1 hidden rounded-full bg-primary cursor-pointer text-white  sm:inline-flex"
            >
              <Link href="/dashboard">Start editing</Link>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  )
}
