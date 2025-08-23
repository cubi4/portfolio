import "./App.css";
import Home from "./components/home";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import AuthCard from "./components/AuthCard";

export default function App() {
    const session = useSession();

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
            <h1 className="text-4xl font-bold mb-6">Welcome to my Website</h1>

            {session ? (
                <>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            Eingeloggt als {session.user?.email}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => supabase.auth.signOut()}
                        >
                            Logout
                        </Button>
                    </div>
                    <Home />
                </>
            ) : (
                <AuthCard />
            )}
        </div>
    );
}
