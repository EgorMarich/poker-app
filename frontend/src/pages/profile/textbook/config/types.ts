export interface LocalizedString {
  ru: string | string[];
  en: string | string[];
  es: string | string[];
}

export interface TextSection {
  type: 'text';
  content: LocalizedString;
  title?: LocalizedString;
}

export interface FormulaSection {
  type: 'formula';
  title: LocalizedString;
  content: LocalizedString;
  latex_formula: string;
  example: LocalizedString;
}

export interface TableSection {
  type: 'table';
  title: LocalizedString;
  headers: LocalizedString;
  rows: LocalizedString[];
}

export interface ExampleHandSection {
  type: 'example_hand';
  title: LocalizedString;
  content: LocalizedString;
}

export type Section = TextSection | FormulaSection | TableSection | ExampleHandSection;

export interface Lesson {
  id: number;
  title: LocalizedString;
  short_desc: LocalizedString;
  sections: Section[];
}

export interface TextbookVersion {
  version: string;
  language: string;
  lessons: Lesson[];
}

export interface LessonCardProps {
  lesson: Lesson;
  completed?: boolean;
  className?: string;
}
