export interface Cells {
  id: number;
  title: string;
}

export interface PosiotionSectionProps {
  isActive: number | null;
  onChange: (id: number) => void;
  label?: string;
}
