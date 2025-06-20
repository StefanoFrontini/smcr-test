import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "ui:bg-popover ui:text-popover-foreground data-[state=open]:ui:animate-in data-[state=closed]:ui:animate-out data-[state=closed]:ui:fade-out-0 data-[state=open]:ui:fade-in-0 data-[state=closed]:ui:zoom-out-95 data-[state=open]:ui:zoom-in-95 data-[side=bottom]:ui:slide-in-from-top-2 data-[side=left]:ui:slide-in-from-right-2 data-[side=right]:ui:slide-in-from-left-2 data-[side=top]:ui:slide-in-from-bottom-2 ui:z-50 ui:max-h-(--radix-dropdown-menu-content-available-height) ui:min-w-[8rem] ui:origin-(--radix-dropdown-menu-content-transform-origin) ui:overflow-x-hidden ui:overflow-y-auto ui:rounded-md ui:border ui:p-1 ui:shadow-md",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "ui:focus:bg-accent ui:focus:text-accent-foreground data-[variant=destructive]:ui:text-destructive data-[variant=destructive]:ui:focus:bg-destructive/10 dark:data-[variant=destructive]:ui:focus:bg-destructive/20 data-[variant=destructive]:ui:focus:text-destructive data-[variant=destructive]:*:[svg]:ui:!text-destructive [&_svg:not([class*=text-])]:ui:text-muted-foreground ui:relative ui:flex ui:cursor-default ui:items-center ui:gap-2 ui:rounded-sm ui:px-2 ui:py-1.5 ui:text-sm ui:outline-hidden ui:select-none data-[disabled]:ui:pointer-events-none data-[disabled]:ui:opacity-50 data-[inset]:ui:pl-8 [&_svg]:ui:pointer-events-none [&_svg]:ui:shrink-0 [&_svg:not([class*=size-])]:ui:size-4",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "ui:focus:bg-accent ui:focus:text-accent-foreground ui:relative ui:flex ui:cursor-default ui:items-center ui:gap-2 ui:rounded-sm ui:py-1.5 ui:pr-2 ui:pl-8 ui:text-sm ui:outline-hidden ui:select-none data-[disabled]:ui:pointer-events-none data-[disabled]:ui:opacity-50 [&_svg]:ui:pointer-events-none [&_svg]:ui:shrink-0 [&_svg:not([class*=size-])]:ui:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="ui:pointer-events-none ui:absolute ui:left-2 ui:flex ui:size-3.5 ui:items-center ui:justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="ui:size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "ui:focus:bg-accent ui:focus:text-accent-foreground ui:relative ui:flex ui:cursor-default ui:items-center ui:gap-2 ui:rounded-sm ui:py-1.5 ui:pr-2 ui:pl-8 ui:text-sm ui:outline-hidden ui:select-none data-[disabled]:ui:pointer-events-none data-[disabled]:ui:opacity-50 [&_svg]:ui:pointer-events-none [&_svg]:ui:shrink-0 [&_svg:not([class*=size-])]:ui:size-4",
        className
      )}
      {...props}
    >
      <span className="ui:pointer-events-none ui:absolute ui:left-2 ui:flex ui:size-3.5 ui:items-center ui:justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="ui:size-2 ui:fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "ui:px-2 ui:py-1.5 ui:text-sm ui:font-medium data-[inset]:ui:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("ui:bg-border ui:-mx-1 ui:my-1 ui:h-px", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ui:text-muted-foreground ui:ml-auto ui:text-xs ui:tracking-widest",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "ui:focus:bg-accent ui:focus:text-accent-foreground data-[state=open]:ui:bg-accent data-[state=open]:ui:text-accent-foreground ui:flex ui:cursor-default ui:items-center ui:rounded-sm ui:px-2 ui:py-1.5 ui:text-sm ui:outline-hidden ui:select-none data-[inset]:ui:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ui:ml-auto ui:size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "ui:bg-popover ui:text-popover-foreground data-[state=open]:ui:animate-in data-[state=closed]:ui:animate-out data-[state=closed]:ui:fade-out-0 data-[state=open]:ui:fade-in-0 data-[state=closed]:ui:zoom-out-95 data-[state=open]:ui:zoom-in-95 data-[side=bottom]:ui:slide-in-from-top-2 data-[side=left]:ui:slide-in-from-right-2 data-[side=right]:ui:slide-in-from-left-2 data-[side=top]:ui:slide-in-from-bottom-2 ui:z-50 ui:min-w-[8rem] ui:origin-(--radix-dropdown-menu-content-transform-origin) ui:overflow-hidden ui:rounded-md ui:border ui:p-1 ui:shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
