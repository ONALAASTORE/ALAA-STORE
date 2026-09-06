import React from 'react';
import {
  LayoutGrid,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Watch,
  Gamepad2,
  Zap,
  Home,
  Layers,
  LucideIcon,
} from 'lucide-react';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Grid: LayoutGrid,
  all: LayoutGrid,
  Smartphone: Smartphone,
  smartphones: Smartphone,
  Laptop: Laptop,
  laptops: Laptop,
  Tablet: Tablet,
  tablets: Tablet,
  Headphones: Headphones,
  audio: Headphones,
  Watch: Watch,
  wearables: Watch,
  Gamepad2: Gamepad2,
  gaming: Gamepad2,
  Zap: Zap,
  power: Zap,
  Home: Home,
  'smart-home': Home,
};

export const getCategoryIcon = (iconOrCategoryId: string): LucideIcon => {
  return CATEGORY_ICONS[iconOrCategoryId] || Layers;
};

interface CategoryIconProps {
  nameOrId: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ nameOrId, className = 'w-3.5 h-3.5' }) => {
  const IconComponent = getCategoryIcon(nameOrId);
  return <IconComponent className={className} aria-hidden="true" />;
};
