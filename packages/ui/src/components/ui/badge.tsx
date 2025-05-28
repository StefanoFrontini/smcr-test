import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "ui:inline-flex ui:items-center ui:justify-center ui:rounded-md ui:border ui:px-2 ui:py-0.5 ui:text-xs ui:font-medium ui:w-fit ui:whitespace-nowrap ui:shrink-0 [&>svg]:ui:size-3 ui:gap-1 [&>svg]:ui:pointer-events-none ui:focus-visible:border-ring ui:focus-visible:ring-ring/50 ui:focus-visible:ring-[3px] ui:aria-invalid:ring-destructive/20 ui:dark:aria-invalid:ring-destructive/40 ui:aria-invalid:border-destructive ui:transition-[color,box-shadow] ui:overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "ui:border-transparent ui:bg-primary ui:text-primary-foreground [a&]:ui:hover:bg-primary/90",
        secondary:
          "ui:border-transparent ui:bg-secondary ui:text-secondary-foreground [a&]:ui:hover:bg-secondary/90",
        destructive:
          "ui:border-transparent ui:bg-destructive ui:text-white [a&]:ui:hover:bg-destructive/90 ui:focus-visible:ring-destructive/20 ui:dark:focus-visible:ring-destructive/40 ui:dark:bg-destructive/60",
        outline:
          "ui:text-foreground [a&]:ui:hover:bg-accent [a&]:ui:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
