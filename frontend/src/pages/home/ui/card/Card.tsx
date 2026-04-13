import React from 'react';
import s from './Card.module.scss';
import clsx from 'clsx';
import { typography } from '$/shared/typography/typography';
import EditIcon from './assets/edit.svg?react';
import TrashIcon from './assets/trash.svg?react';
import { DeleteModal } from '../deleteModal/DeleteModal';
import { useNavigate } from 'react-router';
import { useModal } from '$/shared/modal/ModalContext';

type Rank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

interface MatrixCell {
  color: string;
  selected: boolean;
}

interface MatrixData {
  [handNotation: string]: MatrixCell;
}

interface CardProps {
  id: number;
  name: string;
  description: string;
  position: string;
  matrix: MatrixData;
  actionType: string;
}

export const Card = ({ name, description, position, matrix, actionType, id }: CardProps) => {
  const { openModal } = useModal();
  const ranks: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/range-editor/${id}`);
  };

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

  const handleDeleteClick = () => {
    openModal({
      component: <DeleteModal rangeId={id} />,
      onClose: () => {},
      closeOnOverlayClick: true,
      closeOnEscape: true,
    });
  };

  const createGridFromMatrix = () => {
    const grid: Array<
      Array<{ id: string; display: string; selected: boolean; color: string | null }>
    > = [];

    for (let i = 0; i < 13; i++) {
      const row: Array<{ id: string; display: string; selected: boolean; color: string | null }> =
        [];
      for (let j = 0; j < 13; j++) {
        const handNotation = getHandNotation(i, j);
        const cellData = matrix[handNotation];

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

  const grid = createGridFromMatrix();

  return (
    <div className={s.root}>
      <div className={s.matrix}>
        <div className={s.gridContainer}>
          {grid.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((cell, colIndex) => {
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
      <div className={s.info}>
        <div className={s.infoHeading}>
          <h3 className={clsx(s.name, typography({ variant: 'headingSm' }))}>{name}</h3>
          <p className={clsx(s.description, typography({ variant: 'bodyMd' }))}>{description}</p>
        </div>
        <div className={s.infoFooter}>
          <div className={s.positionAction}>
            <p className={clsx(s.position, typography({ variant: 'caption', color: 'gray-600' }))}>
              {position}
            </p>
            <p className={clsx(s.action, typography({ variant: 'caption', color: 'gray-600' }))}>
              {actionType.toUpperCase()}
            </p>
          </div>
          <div className={s.infoActions}>
            <EditIcon className={s.editIcon} onClick={handleEditClick} />
            <TrashIcon className={s.trashIcon} onClick={handleDeleteClick} />
          </div>
        </div>
      </div>
    </div>
  );
};
