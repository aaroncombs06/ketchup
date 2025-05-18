import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(({ className, children, ...props }, ref) => {
  // Convert children to array to manipulate them
  const childrenArray = React.Children.toArray(children)

  return (
    <div ref={ref} className={cn("flex -space-x-2", className)} {...props}>
      {childrenArray}
    </div>
  )
})

AvatarGroup.displayName = "AvatarGroup"

export { AvatarGroup }
