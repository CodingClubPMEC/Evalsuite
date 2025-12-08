import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Button({ className, variant = "primary", ...props }: any) {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50";
    const variants = {
        primary: "bg-black text-white hover:bg-zinc-800 shadow-sm px-4 py-2",
        outline: "border border-border bg-transparent hover:bg-surface text-foreground px-4 py-2",
        ghost: "hover:bg-surface text-foreground px-3 py-2",
        link: "text-zinc-600 hover:text-black underline-offset-4 hover:underline px-0 py-0"
    };
    return <button className={cn(base, variants[variant as keyof typeof variants], className)} {...props} />;
}

export function Badge({ children, className }: any) {
    return <span className={cn("inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-semibold text-foreground", className)}>{children}</span>
}

export function Card({ className, children }: any) {
    return <div className={cn("rounded-xl border border-border bg-white text-foreground shadow-sm", className)}>{children}</div>
}
