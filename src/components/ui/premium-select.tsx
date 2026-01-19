import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
// We will use standard HTML select for mobile accessibility if needed, or fully custom?
// The user asked for "shadcn ui dan tasarım olarak güzel lüks ve premium bir select".
// Since I cannot run "npx shadcn-ui@latest add select" easily without interaction, 
// I will implement a custom "Select" component using existing Popover if available, or just a custom implementation.
// Actually, I have `@radix-ui/react-popover` installed! usage: Root, Trigger, Content.

import * as PopoverPrimitive from "@radix-ui/react-popover"

interface Option {
    value: string;
    label: string;
}

interface PremiumSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    label?: string;
    className?: string; // Additional classes for the trigger
}

export function PremiumSelect({ value, onChange, options, placeholder = "Seçiniz", label, className }: PremiumSelectProps) {
    const [open, setOpen] = React.useState(false);
    const selected = options.find(o => o.value === value);

    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
                <PopoverPrimitive.Trigger asChild>
                    <button
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full h-12 px-4 flex items-center justify-between bg-white border border-gray-200 rounded-xl text-left text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all hover:bg-gray-50",
                            open && "border-blue-500 ring-4 ring-blue-50",
                            !value && "text-gray-500",
                            className
                        )}
                    >
                        <span className="truncate font-medium">{selected ? selected.label : placeholder}</span>
                        <ChevronDown className={cn("ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200", open && "rotate-180")} />
                    </button>
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Content align="start" className="z-50 w-[var(--radix-popover-trigger-width)] p-1 rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2">
                    <div className="max-h-[300px] overflow-auto p-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        {options.length === 0 ? (
                            <div className="py-6 text-center text-sm text-gray-500">Seçenek yok</div>
                        ) : (
                            options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "relative flex cursor-pointer select-none items-center rounded-lg py-2.5 px-3 text-sm font-medium outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                        value === option.value ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <span className="flex-1 truncate">{option.label}</span>
                                    {value === option.value && (
                                        <Check className="ml-auto h-4 w-4 text-blue-600" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Root>
        </div>
    )
}
