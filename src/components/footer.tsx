import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer>
            <div className="container mx-auto flex h-14 items-center justify-between px-4 text-sm text-muted-foreground">
                <span>© {year} My Portfolio</span>
                <div className="flex items-center gap-4">
                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <a className="hover:underline" href="#privacy">
                                    Privacy
                                </a>
                            </DialogTrigger>
                            <DialogContent
                                className="sm:max-w-[425px]"
                                onInteractOutside={(e) => e.preventDefault()}
                            >
                                <DialogHeader>
                                    <DialogTitle>Privacy Policy</DialogTitle>
                                    <DialogDescription>
                                        <p>
                                            This is the privacy policy for My
                                            Portfolio.
                                        </p>
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>
                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <a className="hover:underline" href="#terms">
                                    Terms
                                </a>
                            </DialogTrigger>
                            <DialogContent
                                className="sm:max-w-[425px] animate-in fade-in-50 zoom-in-90 duration-500"
                                onInteractOutside={(e) => e.preventDefault()}
                            >
                                <DialogHeader>
                                    <DialogTitle>
                                        Terms and Conditions
                                    </DialogTitle>
                                    <DialogDescription>
                                        Please read and accept the terms and
                                        conditions.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>
                </div>
            </div>
        </footer>
    );
}
