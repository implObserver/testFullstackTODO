import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "#/services/lib"
   
  export function AvatarDemo() {
    return (
      <Avatar className="w-[80px]">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    )
  }