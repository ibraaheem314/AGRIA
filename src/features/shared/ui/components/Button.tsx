import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-600 shadow-glow-sm",
        secondary: "bg-secondary text-white hover:bg-secondary-600 shadow-sm",
        accent: "bg-accent text-white hover:bg-accent-600 shadow-sm",
        outline: "border border-primary/30 text-text-secondary hover:bg-primary/5 hover:border-primary hover:text-white",
        ghost: "bg-transparent text-text-secondary hover:bg-primary/5 hover:text-white",
        light: "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 shadow-sm",
        subtle: "bg-primary/10 text-primary hover:bg-primary/20",
        danger: "bg-danger text-white hover:bg-danger-600 shadow-sm",
        success: "bg-success text-white hover:bg-success-600 shadow-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-400 p-0 h-auto",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-6",
        xl: "h-12 px-8 text-base",
        icon: "h-10 w-10 p-2",
        "icon-sm": "h-8 w-8 p-1.5",
      },
      fullWidth: {
        true: "w-full",
      },
      rounded: {
        true: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  className?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      fullWidth,
      rounded,
      loading = false,
      icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, rounded }), className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin" />
          </span>
        )}
        
        <span className={`flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
          {icon && iconPosition === "left" && <span>{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span>{icon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
