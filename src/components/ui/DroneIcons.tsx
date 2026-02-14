import React from "react";
import { LucideIcon } from "lucide-react";

interface DroneIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  fill?: string;
}

export function DroneIcon({ icon: Icon, size = 24, className, fill = "none" }: DroneIconProps) {
  return <Icon size={size} className={className} fill={fill} />;
}
