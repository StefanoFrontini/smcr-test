import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../../lib/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "ui:bg-primary ui:text-primary-foreground ui:animate-in ui:fade-in-0 ui:zoom-in-95 data-[state=closed]:ui:animate-out data-[state=closed]:ui:fade-out-0 data-[state=closed]:ui:zoom-out-95 data-[side=bottom]:ui:slide-in-from-top-2 data-[side=left]:ui:slide-in-from-right-2 data-[side=right]:ui:slide-in-from-left-2 data-[side=top]:ui:slide-in-from-bottom-2 ui:z-50 ui:w-fit ui:origin-(--radix-tooltip-content-transform-origin) ui:rounded-md ui:px-3 ui:py-1.5 ui:text-xs ui:text-balance",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="ui:bg-primary ui:fill-primary ui:z-50 ui:size-2.5 ui:translate-y-[calc(-50%_-_2px)] ui:rotate-45 ui:rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
