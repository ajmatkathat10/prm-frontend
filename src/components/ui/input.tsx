import * as React from "react"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, style, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        style={{
          display: "block",
          width: "100%",
          ...style
        }}
        className={className}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
