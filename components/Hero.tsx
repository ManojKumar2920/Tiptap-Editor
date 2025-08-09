"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Play } from "lucide-react"
import Link from "next/link"

export default function Hero() {


    return (
        <section className="relative bg-white dark:bg-zinc-950">


            <div className="mx-auto px-4 pb-12 pt-20 ">
                <div className="relative ">
                    <div className="pointer-events-none absolute inset-0 " />

                    <div className="relative grid items-center gap-10 p-8 md:grid-cols-2 md:p-12">
                        <div className="space-y-6">
                            <Badge
                                variant="secondary"
                                className="inline-flex items-center gap-1.5 border border-violet-500/30 bg-violet-600/10 text-primary dark:text-violet-200"
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                Automates the Mundane
                            </Badge>

                            <h1 className="text-balance bg-gradient-to-b from-zinc-900 to-zinc-700 bg-clip-text text-4xl font-bold tracking-tight leading-18 text-transparent dark:from-zinc-50 dark:to-zinc-300 md:text-5xl lg:text-6xl py-4">
                                Responsible AI for Responsible lawyers
                            </h1>

                            <p className="text-pretty text-zinc-600 dark:text-zinc-400 md:text-lg">
                                A secure, private, and accurate legal AI assistant tailored to the unique legal environment of India
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Link href={'/dashboard'}>

                                    <Button
                                        size="lg"
                                        className="group rounded-full bg-primary text-white cursor-pointer"
                                    >
                                        <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                        Start editing
                                    </Button>
                                </Link>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="rounded-full border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-900/80"
                                    asChild
                                >
                                    <a href="#editor">
                                        Explore features
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-600 dark:text-zinc-500">
                                <div>⌘B Bold</div>
                                <div>⌘I Italic</div>
                                <div>⌘Z Undo</div>
                                <div>⌘⇧Z Redo</div>
                            </div>
                        </div>

                        {/* Preview card */}
                        <div className="relative">
                            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgba(14,165,233,0.25),transparent)] blur-2xl" />
                            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900/50">
                                <Image
                                    src="/vettam-hero.avif"
                                    alt="Editor UI preview"
                                    width={800}
                                    height={420}
                                    className="h-auto w-full"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* bottom halo */}
                    <div className="pointer-events-none absolute inset-x-16 bottom-0 h-24 rounded-b-3xl bg-[radial-gradient(100%_60%_at_50%_100%,rgba(139,92,246,0.20)_0%,rgba(59,130,246,0.12)_40%,rgba(14,165,233,0.12)_60%,transparent_80%)] blur-2xl dark:bg-[radial-gradient(100%_60%_at_50%_100%,rgba(168,85,247,0.20)_0%,rgba(59,130,246,0.12)_40%,rgba(14,165,233,0.12)_60%,transparent_80%)]" />
                </div>
            </div>
        </section>
    )
}
