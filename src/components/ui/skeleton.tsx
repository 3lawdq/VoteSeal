
import { cn } from "@/lib/utils"
import React from "react"; // Import React

function Skeleton({
  className,
  children, // Add children prop
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) { // Define type for children
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)} // Let parent control size via className
      {...props}
    >
      {children} {/* Render children if provided */}
    </div>
  )
}

export { Skeleton }
