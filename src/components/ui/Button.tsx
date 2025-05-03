import React, { ButtonHTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none", 
  {
    variants: {
      variant: {
        primary: "bg-primary hover:bg-primary-600 text-white shadow-sm hover:shadow-glow-sm font-medium",
        secondary: "bg-secondary hover:bg-secondary-600 text-white shadow-sm font-medium",
        accent: "bg-accent hover:bg-accent-600 text-white shadow-sm font-medium",
        outline: "bg-transparent border border-white/30 text-white hover:border-primary/60 hover:text-white",
        ghost: "bg-transparent hover:bg-white/10 text-white/80 hover:text-white",
        link: "bg-transparent underline-offset-4 hover:underline text-primary hover:text-primary-400 p-0 height-auto",
        season: "border border-season-autumn/40 bg-season-autumn/15 text-season-autumn hover:bg-season-autumn/25 hover:border-season-autumn/50 font-medium",
        danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm font-medium",
        success: "bg-success hover:bg-success-600 text-white shadow-sm font-medium",
      },
      size: {
        xs: "text-xs px-2 py-1 rounded",
        sm: "text-xs px-2.5 py-1.5 rounded",
        md: "text-sm px-4 py-2 rounded",
        lg: "text-base px-6 py-2.5 rounded-md",
        xl: "text-lg px-8 py-3 rounded-lg",
        icon: "p-2 rounded-md",
      },
      width: {
        auto: "w-auto",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      width: "auto",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  loading?: boolean;
  width?: "auto" | "full";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, width, type = "button", children, icon, loading, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, width, className }))}
        ref={ref}
        type={type}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : icon ? (
          <span className="mr-2 icon-highlight">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
