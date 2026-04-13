import s from './addButton.module.scss'
import PlusIcon from './assets/plus.svg?react';
import { useNavigate } from 'react-router';
export const AddButton = () => {

  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/range-editor')
  }

  return ( 
    <button className={s.root} onClick={handleClick}>
      <PlusIcon className={s.icon} />
    </button>
  )
}
