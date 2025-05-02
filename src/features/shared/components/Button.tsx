import React, { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define button variants using class-variance-authority
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow-sm hover:bg-primary-600",
        destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
        outline: "border border-primary/30 bg-transparent hover:bg-primary/10 text-white",
        secondary: "bg-secondary text-white shadow-sm hover:bg-secondary-600",
        ghost: "bg-transparent text-text-secondary hover:bg-primary/10 hover:text-white",
        link: "bg-transparent text-primary underline-offset-4 hover:underline",
        subtle: "bg-primary/10 text-primary hover:bg-primary/20",
        dark: "bg-dark text-white border border-dark-600 hover:bg-dark-600",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-lg",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        xs: "h-7 rounded-md px-2 text-xs",
        "icon-xs": "h-7 w-7"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false, 
    children, 
    icon, 
    iconPosition = "left", 
    type = "button", 
    ...props 
  }, ref) => {
    // Determine whether the component has an icon-only size variant
    const isIconOnly = size === "icon" || size === "icon-sm" || size === "icon-xs";
    
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className })
        )}
        ref={ref}
        type={type}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        
        {/* Left-positioned icon */}
        {icon && iconPosition === "left" && !loading && (
          <div className={cn("flex-shrink-0", { "mr-2": !isIconOnly && children })}>
            {icon}
          </div>
        )}
        
        {/* Button text content */}
        {children}
        
        {/* Right-positioned icon */}
        {icon && iconPosition === "right" && !loading && (
          <div className={cn("flex-shrink-0", { "ml-2": !isIconOnly && children })}>
            {icon}
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button; 