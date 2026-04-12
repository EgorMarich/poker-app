export interface Colors {
  id: number;
  color: string;
  hex: string;
}

export interface ColorSectionProps {
  isActive: string | null;
  onChange: (color: string) => void;
}
