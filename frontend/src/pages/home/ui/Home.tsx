import { color } from '$/shared/colors/colors';
import { typography } from '$/shared/typography/typography';
import s from './Home.module.scss';
import { RootLink } from '$/shared/ui/links/rootLink/RootLink';
import BookIcon from '../assets/book.svg?react';
import { useQuery } from '@tanstack/react-query';
import { useGetAllRanges } from '$/entities/range/api/useQueries';
import { Card } from './card/Card';
import { AddButton } from '$/shared/ui/buttons/addButton/addButton';

export const Home = () => {
  const { data, isError, isLoading } = useQuery(useGetAllRanges);

  if (isError) return <div>Ну тут ошибочка у вас</div>;
  if (isLoading) return <div>Загрузка вообще-то...</div>;

  return (
    <div className={s.root}>
      {data && data.length > 0 ? (
        <>
          {data.map(item => (
            <Card
              id={item.id}
              key={item.id}
              name={item.name}
              description={item.description}
              position={item.position}
              matrix={item.matrix}
              actionType={item.actionType}
            />
          ))}
          <AddButton />
        </>
      ) : (
        <div className={s.empty}>
          <div className={s.text}>
            <BookIcon />
            <h5 className={typography({ variant: 'bodySmSemiBold' })}>
              На данный момент у вас нет диапозонов
            </h5>
            <p className={color({ color: 'gray-500' })}>Создайте ваш первый диапозон</p>
          </div>
          <RootLink icon href="/range-editor">
            Создать
          </RootLink>
        </div>
      )}
    </div>
  );
};

export default Home;
