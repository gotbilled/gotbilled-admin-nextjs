const CustomTextButton = ({
  children,
  onClick
}: {
  children: JSX.Element
  onClick: () => void
}) => {
  return (
    <div onClick={onClick} role="button" aria-label="link">
      {children}
    </div>
  )
}

export default CustomTextButton
