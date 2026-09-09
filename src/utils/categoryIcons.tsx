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
  Briefcase,
  Cable,
  Camera,
  Car,
  HardDrive,
  HeartPulse,
  Lightbulb,
  Wrench,
  Utensils,
  Mic,
  Maximize,
  CircleDot,
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
  'smartwatches-accessories': Watch,
  Gamepad2: Gamepad2,
  gaming: Gamepad2,
  CircleDot: CircleDot,
  'racing-wheel': CircleDot,
  'racing-wheels': CircleDot,
  'Racing Wheel': CircleDot,
  Zap: Zap,
  power: Zap,
  Home: Home,
  'smart-home': Home,
  Briefcase: Briefcase,
  'bags-cases': Briefcase,
  Cable: Cable,
  cables: Cable,
  Camera: Camera,
  'cameras-projectors': Camera,
  Car: Car,
  'car-accessories': Car,
  HardDrive: HardDrive,
  'flash-card-memory': HardDrive,
  HeartPulse: HeartPulse,
  'personal-health-care': HeartPulse,
  Lightbulb: Lightbulb,
  'home-lighting': Lightbulb,
  Wrench: Wrench,
  tools: Wrench,
  Utensils: Utensils,
  'kitchen-tools': Utensils,
  Mic: Mic,
  microphones: Mic,
  Maximize: Maximize,
  'stands-holders': Maximize,
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
