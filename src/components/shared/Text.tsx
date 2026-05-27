import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/classname";

// Font sizes map to --text-* custom properties defined in @theme (index.css).
// Colors use the defined --color-* tokens via Tailwind utilities.
const textVariants = cva("", {
  variants: {
    variant: {
      // Main readable content
      body: "text-body text-foreground",
      // Secondary labels, metadata
      label: "text-label text-muted-foreground",
      // Section / page headers — all-caps + wide tracking
      header: "text-header text-muted-foreground tracking-widest uppercase",
      // De-emphasised helper text
      hint: "text-hint text-muted-foreground",
      // Validation / error messages
      error: "text-label text-red-400",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type As =
  | "p"
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "div"
  | "label"
  | "strong"
  | "em";

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: As;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant, as: Tag = "p", ...props }, ref) => {
    const Component = Tag as React.ElementType;
    return <Component ref={ref} className={cn(textVariants({ variant }), className)} {...props} />;
  }
);

Text.displayName = "Text";

export default Text;
