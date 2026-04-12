import React from 'react';
import s from './RangeSection.module.scss';

type Rank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

interface CellData {
  id: string;
  display: string;
  selected: boolean;
  color: string | null;
}

export type RangeData = Record<string, { selected: boolean; color: string | null }>;

interface RangeSectionProps {
  selectedColor?: string;
  value?: RangeData;
  onChange?: (value: RangeData) => void;
  name?: string;
}

const RangeSection: React.FC<RangeSectionProps> = ({
  selectedColor = '#4CAF50',
  value = {},
  onChange,
}) => {
  const ranks: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  const getHandNotation = (rowIndex: number, colIndex: number): string => {
    const rank1 = ranks[rowIndex];
    const rank2 = ranks[colIndex];

    if (rowIndex === colIndex) {
      return `${rank1}${rank2}`;
    } else if (rowIndex < colIndex) {
      return `${rank1}${rank2}s`;
    } else {
      return `${rank2}${rank1}o`;
    }
  };

  const createGridFromValue = (): CellData[][] => {
    const grid: CellData[][] = [];

    for (let i = 0; i < 13; i++) {
      const row: CellData[] = [];
      for (let j = 0; j < 13; j++) {
        const handNotation = getHandNotation(i, j);
        const cellData = value[handNotation];

        row.push({
          id: handNotation,
          display: handNotation,
          selected: cellData?.selected || false,
          color: cellData?.color || null,
        });
      }
      grid.push(row);
    }
    return grid;
  };

  const grid = createGridFromValue();

  const handleCellClick = (rowIndex: number, colIndex: number): void => {
    const handNotation = getHandNotation(rowIndex, colIndex);
    const currentCell = value[handNotation];

    const rangeData: RangeData = { ...value };

    if (currentCell?.selected && currentCell?.color === selectedColor) {
      delete rangeData[handNotation];
    } else {
      rangeData[handNotation] = {
        selected: true,
        color: selectedColor,
      };
    }

    if (onChange) {
      onChange(rangeData);
    }
  };

  return (
    <div className={s.rangeGrid}>
      <div className={s.gridContainer}>
        {grid.map((row: CellData[], rowIndex: number) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((cell: CellData, colIndex: number) => {
              const isPair = rowIndex === colIndex;
              const isSuited = rowIndex < colIndex;

              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`${s.gridCell} ${cell.selected ? s.selected : ''} ${
                    isPair ? s.pair : isSuited ? s.suited : s.offsuit
                  }`}
                  style={{
                    backgroundColor: cell.selected && cell.color ? cell.color : undefined,
                  }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  title={cell.display}
                >
                  <span className={s.cellText}>{cell.display}</span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RangeSection;
