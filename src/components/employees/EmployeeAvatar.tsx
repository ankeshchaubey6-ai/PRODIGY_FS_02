import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, stringToColor, cn } from "@/lib/utils";

interface EmployeeAvatarProps {
  firstName: string;
  lastName: string;
  profileImage?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

export function EmployeeAvatar({
  firstName,
  lastName,
  profileImage,
  size = "md",
  className,
}: EmployeeAvatarProps) {
  const initials = getInitials(firstName, lastName);
  const colorClass = stringToColor(`${firstName}${lastName}`);

  return (
    <Avatar className={cn(sizeMap[size], className)}>
      <AvatarImage
        src={profileImage ?? undefined}
        alt={`${firstName} ${lastName}`}
      />
      <AvatarFallback
        className={cn("font-semibold border-0", colorClass)}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}