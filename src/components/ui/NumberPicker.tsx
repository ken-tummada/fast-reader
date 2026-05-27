import * as React from "react";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/classname";
import Button from "@/components/ui/Button";

const numberPickerVariants = cva(
  "inline-flex items-center rounded-lg bg-background text-foreground",
  {
    variants: {
      size: {
        default: "h-10 text-sm",
        sm: "h-8 text-xs",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface NumberPickerProps
  extends
    Omit<React.ComponentPropsWithoutRef<"input">, "size" | "type" | "value" | "onChange">,
    VariantProps<typeof numberPickerVariants> {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
}

const NumberPicker = React.forwardRef<HTMLInputElement, NumberPickerProps>(
  ({ className, size, value = 0, min, max, step = 1, onValueChange, ...props }, ref) => {
    const clamp = (n: number) => {
      let v = n;
      if (min !== undefined) v = Math.max(min, v);
      if (max !== undefined) v = Math.min(max, v);
      return v;
    };

    const handleDecrement = () => onValueChange?.(clamp(value - step));
    const handleIncrement = () => onValueChange?.(clamp(value + step));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseFloat(e.target.value);
      if (!isNaN(parsed)) onValueChange?.(clamp(parsed));
    };

    return (
      <div className={cn(numberPickerVariants({ size }), className)}>
        <Button
          variant={"secondary"}
          size={"icon"}
          onClick={handleDecrement}
          disabled={min !== undefined && value <= min}
        >
          <MinusIcon weight="bold" size={14} />
        </Button>

        <input
          ref={ref}
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className="w-14 h-full bg-transparent text-center tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...props}
        />

        <Button
          variant={"secondary"}
          size={"icon"}
          onClick={handleIncrement}
          disabled={max !== undefined && value >= max}
        >
          <PlusIcon weight="bold" size={14} />
        </Button>
      </div>
    );
  }
);

NumberPicker.displayName = "NumberPicker";

export default NumberPicker;
