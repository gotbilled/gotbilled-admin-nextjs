// Redux
import { useAppSelector } from '@redux/hooks'

const Popup = () => {
  const { popups } = useAppSelector((state) => state.utilities)

  return (
    <>
      {popups.map((popup, i) => (
        <div key={i}>{popup.content}</div>
      ))}
    </>
  )
}

export default Popup
