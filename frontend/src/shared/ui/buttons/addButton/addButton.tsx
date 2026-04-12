import s from './addButton.module.scss'
import PlusIcon from './assets/plus.svg?react';
export const AddButton = () => {

  return ( 
    <button className={s.root}>
      <PlusIcon className={s.icon} />
    </button>
  )
}
