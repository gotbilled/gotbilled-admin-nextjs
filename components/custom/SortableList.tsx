// Packages
import { ItemInterface, ReactSortable } from 'react-sortablejs'

// Helpers
import { moreArrayElement } from '@helpers/calc/arrays'

const SortableList = ({
  list,
  onChange,
  handle,
  className,
  children
}: {
  list: any[]
  onChange: Function
  handle?: string
  className?: string
  children: JSX.Element | JSX.Element[]
}) => {
  const updateList = (oldIndex?: number, newIndex?: number) => {
    if (oldIndex == undefined || newIndex == undefined) {
      return
    }

    onChange(moreArrayElement(list, oldIndex, newIndex), oldIndex, newIndex)
  }

  return (
    <ReactSortable
      handle={handle}
      list={list.map((item) => ({ ...item }))}
      setList={() => {}}
      onUpdate={(e) => updateList(e.oldIndex, e.newIndex)}
      animation={150}
      className={className}
    >
      {children}
    </ReactSortable>
  )
}

export default SortableList
