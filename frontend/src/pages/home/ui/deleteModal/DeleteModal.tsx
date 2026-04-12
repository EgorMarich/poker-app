import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';
import { SecondaryButton } from '$/shared/ui/buttons/secondaryButtons/SecondaryButtons';
import { useModal } from '$/shared/modal/ModalContext';
import s from './DeleteModal.module.scss';
import { typography } from '$/shared/typography/typography';
import { useDeleteRange } from '$/entities/range/api/useMutation';

// interface DeleteModalProps {
//   onConfirm?: () => void;
//   message?: string;
// }

export const DeleteModal = ({ rangeId }: { rangeId: number }) => {
  const { closeModal } = useModal();

  // const handleConfirm = () => {
  //   onConfirm?.();
  //   closeModal();
  // };

  const { mutate: deleteRange, isPending } = useDeleteRange();

  const handleConfirm = () => {
    deleteRange(String(rangeId), {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  return (
    <div className={s.root}>
      <p className={typography({ variant: 'bodyMd' })}>
        Вы действительно хотите удалить этот диапозон?
      </p>
      <div className={s.actions}>
        <PrimaryButton onClick={handleConfirm} disabled={isPending}>
          Удалить
        </PrimaryButton>
        <SecondaryButton onClick={closeModal}>Отмена</SecondaryButton>
      </div>
    </div>
  );
};
