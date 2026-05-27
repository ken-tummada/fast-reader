import * as React from "react";
import { Slider as BaseSlider } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/classname";

const sliderVariants = cva("relative flex items-center select-none touch-none", {
  variants: {
    size: {
      default: "w-64 h-6",
      sm: "w-48 h-5",
      lg: "w-80 h-7",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface SliderProps
  extends
    React.ComponentPropsWithoutRef<typeof BaseSlider.Root>,
    VariantProps<typeof sliderVariants> {}

const Slider = React.forwardRef<React.ComponentRef<typeof BaseSlider.Root>, SliderProps>(
  ({ className, size, ...props }, ref) => (
    <BaseSlider.Root className={cn(sliderVariants({ size }), className)} ref={ref} {...props}>
      <BaseSlider.Track className="relative bg-background grow rounded-full h-1">
        <BaseSlider.Range className="absolute bg-foreground rounded-full h-full" />
      </BaseSlider.Track>
      <BaseSlider.Thumb className="block size-4 bg-primary-foreground rounded-full hover:opacity-90" />
    </BaseSlider.Root>
  )
);

Slider.displayName = "Slider";

export default Slider;
