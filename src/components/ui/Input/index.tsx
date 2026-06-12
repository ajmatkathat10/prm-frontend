import * as React from "react";
import { styles } from "./input.styles";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, style, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        style={{
          ...styles.input,
          ...style
        }}
        className={className}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
