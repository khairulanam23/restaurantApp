import React from "react";
import { cn } from "@/app/lib/utils"; // Optional: for classname merging

export interface SpinnerProps {
  /**
   * Size of the spinner
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";

  /**
   * Color variant of the spinner
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "white";

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Accessibility label for screen readers
   * @default "Loading"
   */
  label?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const variantClasses = {
  primary: "text-blue-600",
  secondary: "text-gray-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  error: "text-red-600",
  white: "text-white",
};

/**
 * A reusable loading spinner component
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  className,
  label = "Loading",
}) => {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};

/**
 * A spinner with centered container - useful for full page loading
 */
export const CenteredSpinner: React.FC<SpinnerProps> = (props) => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Spinner {...props} />
    </div>
  );
};

/**
 * A spinner with text label
 */
export const SpinnerWithText: React.FC<SpinnerProps & { text?: string }> = ({
  text = "Loading...",
  ...spinnerProps
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Spinner {...spinnerProps} />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
};

export default Spinner;
