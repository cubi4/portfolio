import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Store only a hash here. This is NOT true security; it is obfuscation. */
const EXPECTED_SHA256 =
    "3c45dacbbd0b6625385aa00f03f5a3652acb32bee5a550ba53a2814247951bb6";

async function sha256(text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export function PasswordGate({ children }: { children: React.ReactNode }) {
    const [pw, setPw] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [unlocked, setUnlocked] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        // remember state within the session
        if (sessionStorage.getItem("unlocked") === "1") setUnlocked(true);
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const hash = await sha256(pw);
        if (hash === EXPECTED_SHA256) {
            sessionStorage.setItem("unlocked", "1");
            setUnlocked(true);
        } else {
            setError("Wrong password");
        }
        setBusy(false);
    }

    if (unlocked) return <>{children}</>;

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Welcome to ...</CardTitle>
                    <CardDescription>
                        Login with your special password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pw">Passwort</Label>
                            <Input
                                id="pw"
                                type="password"
                                value={pw}
                                onChange={(e) => setPw(e.target.value)}
                                autoComplete="current-password"
                                required
                                placeholder=""
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={busy}
                        >
                            {busy ? "Please wait…" : "Login"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        By clicking login, you agree to our Terms of Service and
                        Privacy Policy.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
