import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Home as HomeIcon } from "lucide-react";
import Chart from "./chart";

export default function Home() {
        const features = [      
                {
                        title: "Fast",
                        description: "Optimized, responsive UI built with Tailwind and shadcn/ui.",
                },
                {
                        title: "Composable",
                        description: "Reusable components with accessible defaults and variants.",
                },
                {
                        title: "Type-safe",
                        description: "End-to-end TypeScript for safer, predictable code.",
                },
        ]

        const projects = [
                { title: "Project One", description: "Short description goes here." },
                { title: "Project Two", description: "Short description goes here." },
                { title: "Project Three", description: "Short description goes here." },
        ]

        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
                    <div className="container mx-auto flex h-14 items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-primary" />
                            <span className="font-semibold">My Portfolio</span>
                        </div>
                        <nav className="hidden gap-1 md:flex">
                            <Button variant="ghost">Home</Button>
                            <Button variant="ghost">Projects</Button>
                            <Button variant="ghost">About</Button>
                            <Button variant="ghost">Contact</Button>
                        </nav>
                        <div className="flex items-center gap-2">
                            <Button>Primary Action</Button>
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
                    {/* Badge variants: default | secondary | destructive | outline */}
                    <Badge className="mb-4 inline-flex items-center gap-1 border-transparent bg-yellow-400 text-yellow-900">
                        <HomeIcon className="h-4 w-4" />
                        Welcome
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        A clean start for your portfolio
                    </h1>
                    <p className="mt-4 max-w-2xl text-muted-foreground">
                        Replace this text and the images below with your own
                        content. Keep it simple and focused.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button size="lg">Explore</Button>
                        <Button size="lg" variant="outline">
                            Learn More
                        </Button>
                    </div>
                </section>

                <Separator className="container mx-auto" />

                {/* Features */}
                <div className="px-4 py-6">
                    <div className="mx-auto w-full max-w-xl">
                        <Chart />
                    </div>
                </div>
                <Separator className="container mx-auto" />

                <section className="container mx-auto px-4 py-12">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((f) => (
                            <Card key={f.title} className="border-muted">
                                <CardHeader>
                                    <CardTitle>{f.title}</CardTitle>
                                    <CardDescription>
                                        {f.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-video overflow-hidden rounded-md bg-muted">
                                        <img
                                            src={`https://placehold.co/800x450/png?text=${encodeURIComponent(
                                                f.title
                                            )}`}
                                            alt={f.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Projects gallery */}
                <section className="container mx-auto px-4 pb-16">
                    <div className="grid gap-6 md:grid-cols-3">
                        {projects.map((p) => (
                            <Card key={p.title}>
                                <CardHeader>
                                    <CardTitle>{p.title}</CardTitle>
                                    <CardDescription>
                                        {p.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-video overflow-hidden rounded-md bg-muted">
                                        <img
                                            src={`https://placehold.co/800x450/png?text=${encodeURIComponent(
                                                p.title
                                            )}`}
                                            alt={p.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button size="sm" variant="secondary">
                                            View
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t">
                    <div className="container mx-auto flex h-14 items-center justify-between px-4 text-sm text-muted-foreground">
                        <span>© {new Date().getFullYear()} My Portfolio</span>
                        <div className="flex items-center gap-4">
                            <a className="hover:underline" href="#privacy">
                                Privacy
                            </a>
                            <a className="hover:underline" href="#terms">
                                Terms
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        );
}

