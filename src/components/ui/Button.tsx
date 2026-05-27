import * as React from "react";
import { Tooltip } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/classname";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-lg",
    "text-sm font-medium transition-colors",
    "cursor-pointer select-none hover:opacity-90",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary-foreground text-background",
        secondary:
          "bg-background text-foreground hover:bg-primary-foreground hover:text-background",
        destructive: "bg-background text-foreground hover:bg-error-foreground hover:text-error",
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  tooltip?: string;
  tooltipSide?: Tooltip.TooltipContentProps["side"];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, tooltip, tooltipSide = "top", ...props }, ref) => {
    const button = (
      <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );

    if (!tooltip) return button;

    return (
      <Tooltip.Provider delayDuration={100}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              data-side={tooltipSide}
              side={tooltipSide}
              sideOffset={6}
              className={cn(
                "z-50 rounded-md px-3 py-1.5 text-xs",
                "bg-primary-foreground text-background duration-300 transition-all"
              )}
            >
              {tooltip}
              <Tooltip.Arrow className="fill-primary-foreground" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }
);

Button.displayName = "Button";

export default Button;
