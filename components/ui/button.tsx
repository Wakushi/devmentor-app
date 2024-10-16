import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex border items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white",
  {
    variants: {
      variant: {
        default:
          "bg-primary border-primary hover:bg-primary-shade hover:text-slate-50 active:bg-slate-50 active:text-primary shadow gap-2",
        secondary:
          "bg-secondary border border-secondary hover:bg-secondary-shade hover:border-secondary-shade hover:text-slate-50 active:bg-slate-50 active:text-secondary shadow gap-2",
        destructive:
          "bg-destructive border-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:text-destructive active:bg-white",
        accent:
          "bg-accent border-accent hover:bg-white hover:text-slate-50 active:bg-slate-50 active:text-accent shadow gap-2",
        outline: "border border-input bg-background shadow-sm hover:opacity-80",
        "outline-white":
          "border border-white bg-transparent text-white shadow-sm hover:opacity-80",
        "outline-brand":
          "border border-primary text-primary bg-transparent shadow-sm hover:bg-slate-100 hover:text-accent-foreground",
        ghost: "border-transparent hover:border-inherit",
        link: "text-primary underline-offset-4 hover:underline",
        white:
          "bg-white border-white hover:bg-slate-200 hover:text-primary active:bg-slate-50 active:text-primary shadow gap-2",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
