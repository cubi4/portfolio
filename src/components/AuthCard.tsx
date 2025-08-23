import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuthCard() {
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [msg, setMsg] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setMsg(null);

        let error;
        if (mode === "signin") {
            ({ error } = await supabase.auth.signInWithPassword({
                email,
                password: pw,
            }));
        } else {
            ({ error } = await supabase.auth.signUp({
                email,
                password: pw,
                options: {
                    emailRedirectTo: window.location.origin, // optional Redirect URL
                },
            }));
        }

        setBusy(false);
        setMsg(
            error
                ? error.message
                : mode === "signup"
                ? "Registered. (may confirm email)"
                : "Logged In."
        );
    }

    return (
        <div className="w-full max-w-sm">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {mode === "signin" ? "Log In" : "Create Account"}
                    </CardTitle>
                    <CardDescription>E-Mail & Password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-3">
                        <Input
                            type="email"
                            placeholder="E-Mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={busy}
                        >
                            {busy
                                ? "Please wait..."
                                : mode === "signin"
                                ? "Log In"
                                : "Sign Up"}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() =>
                                setMode((m) =>
                                    m === "signin" ? "signup" : "signin"
                                )
                            }
                        >
                            {mode === "signin"
                                ? "Don't have an Account?"
                                : "Already have an Account?"}
                        </Button>
                        {msg && (
                            <p className="text-sm text-muted-foreground">
                                {msg}
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
