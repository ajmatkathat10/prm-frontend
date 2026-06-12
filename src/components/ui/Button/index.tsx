import * as React from "react";
import { styles } from "./button.styles";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        style={{
          ...styles.button(variant, size),
          ...style
        }}
        className={className}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
