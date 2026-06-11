import * as React from "react"

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
          margin: "2px",
          textDecoration: variant === "link" ? "none" : undefined,
          background: variant === "link" || variant === "ghost" ? "none" : undefined,
          border: variant === "link" || variant === "ghost" ? "none" : undefined,
          padding: size === "sm" ? "4px 8px" : size === "lg" ? "10px 20px" : undefined,
          ...style
        }}
        className={className}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
