// src/components/home.tsx
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type Entry = {
    id: number;
    user_id: string;
    date: string; // yyyy-mm-dd
    calories: number;
    weight_kg: number | null;
    note: string | null;
    created_at: string;
};

// Raw type as returned by Supabase (numeric may be strings)
type RawEntry = {
    id: number;
    user_id: string;
    date: string;
    calories: number | string;
    weight_kg: number | string | null;
    note: string | null;
    created_at: string;
};

const PAGE_SIZE = 30;

export default function Home() {
    const user = useUser();
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // form state
    const [date, setDate] = useState<string>(
        new Date().toISOString().slice(0, 10)
    );
    const [calories, setCalories] = useState<string>("");
    const [weight, setWeight] = useState<string>("");

    // ---- helpers -------------------------------------------------------------
    function toNumberOrNull(v: string): number | null {
        if (v === "" || v === null || typeof v === "undefined") return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    }

    // ---- load entries --------------------------------------------------------
    async function loadEntries() {
        setLoading(true);

        const { data, error } = await supabase
            .from("entries")
            .select("*")
            .order("date", { ascending: false })
            .limit(PAGE_SIZE)
            .returns<RawEntry[]>(); // typed response, no 'any'

        if (!error && data) {
            // normalize numeric types
            const normalized: Entry[] = data.map((d) => ({
                ...d,
                calories: Number(d.calories),
                weight_kg: d.weight_kg === null ? null : Number(d.weight_kg),
            }));
            setEntries(normalized);
        }

        setLoading(false);
    }

    useEffect(() => {
        loadEntries();
    }, []);

    // ---- create entry --------------------------------------------------------
    async function addEntry() {
        if (!user) return;
        const cal = toNumberOrNull(calories);
        if (cal === null || cal < 0) return;

        setSaving(true);
        const { error } = await supabase.from("entries").insert({
            user_id: user.id,
            date,
            calories: cal,
            weight_kg: toNumberOrNull(weight),
            note: null,
        });
        setSaving(false);

        if (!error) {
            setCalories("");
            // setWeight(""); // optionally clear
            await loadEntries();
        }
    }

    // ---- delete entry --------------------------------------------------------
    async function removeEntry(id: number) {
        const { error } = await supabase.from("entries").delete().eq("id", id);
        if (!error) {
            setEntries((prev) => prev.filter((e) => e.id !== id));
        }
    }

    // ---- computed stats (last 7 days) ---------------------------------------
    const weekStats = useMemo(() => {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6); // include today

        const inRange = entries.filter((e) => {
            const d = new Date(e.date + "T00:00:00");
            return d >= new Date(sevenDaysAgo.toDateString());
        });

        const total = inRange.reduce((s, e) => s + (e.calories || 0), 0);
        const days = new Set(inRange.map((e) => e.date)).size || 1;
        const avgPerDay = Math.round(total / days);
        const latestWeight =
            entries.find((e) => e.weight_kg !== null)?.weight_kg ?? null;

        return { total, avgPerDay, latestWeight };
    }, [entries]);

    // ---- UI ------------------------------------------------------------------
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-10 space-y-10">
            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-3">
                <Card className="hover:shadow-md transition">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Avg Calories (7 Days)
                        </CardTitle>
                        <CardDescription>Average per day</CardDescription>
                    </CardHeader>
                    <CardContent className="text-3xl font-semibold">
                        {weekStats.avgPerDay} kcal
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Total (7 Days)
                        </CardTitle>
                        <CardDescription>All entries</CardDescription>
                    </CardHeader>
                    <CardContent className="text-3xl font-semibold">
                        {weekStats.total} kcal
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Latest Weight
                        </CardTitle>
                        <CardDescription>from your entries</CardDescription>
                    </CardHeader>
                    <CardContent className="text-3xl font-semibold">
                        {weekStats.latestWeight ?? "–"}
                        {weekStats.latestWeight ? " kg" : ""}
                    </CardContent>
                </Card>
            </section>

            <Separator />

            {/* Quick Add */}
            <section>
                <Card>
                    <CardHeader>
                        <CardTitle>Add Entry</CardTitle>
                        <CardDescription>
                            Date, calories and optional weight
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-5">
                            <div className="space-y-1 sm:col-span-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="cal">Calories</Label>
                                <Input
                                    id="cal"
                                    type="number"
                                    min={0}
                                    placeholder="e.g. 2100"
                                    value={calories}
                                    onChange={(e) =>
                                        setCalories(e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.01"
                                    placeholder="optional"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                            </div>

                            <div className="flex items-end">
                                <Button
                                    className="w-full"
                                    onClick={addEntry}
                                    disabled={saving}
                                >
                                    {saving ? "Saving…" : "Save"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Entries list */}
            <section>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Entries</CardTitle>
                        <CardDescription>
                            The latest {PAGE_SIZE} entries
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p className="text-sm text-muted-foreground">
                                Loading…
                            </p>
                        ) : entries.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No entries yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="min-w-[520px]">
                                    <div className="grid grid-cols-[1fr_1fr_1fr_auto] px-3 py-2 text-xs text-muted-foreground">
                                        <span>Date</span>
                                        <span>Calories</span>
                                        <span>Weight</span>
                                        <span className="text-right">
                                            Actions
                                        </span>
                                    </div>

                                    <div className="divide-y">
                                        {entries.map((e) => (
                                            <div
                                                key={e.id}
                                                className="grid grid-cols-[1fr_1fr_1fr_auto] items-center px-3 py-2 text-sm"
                                            >
                                                <span>{e.date}</span>
                                                <span>{e.calories} kcal</span>
                                                <span>
                                                    {e.weight_kg ?? "–"}
                                                    {e.weight_kg ? " kg" : ""}
                                                </span>
                                                <div className="flex justify-end">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeEntry(e.id)
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
