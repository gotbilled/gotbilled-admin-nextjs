// Packages
import { Flex } from '@strapi/design-system'

interface PlaceholderProps {
  loading?: boolean
  template: {
    width: number | string
    height: number | string
    direction?: 'column' | 'row'
    repeat?: number
    gap?: number
    margin?: { top?: number; bottom?: number }
    alignContent?: 'center' | 'flex-start'
  }
  children?: JSX.Element | JSX.Element[] | string | string[]
}

const Placeholder = ({
  loading = true,
  template: {
    width,
    height,
    direction = 'column',
    repeat = 1,
    gap = 0,
    margin,
    alignContent = 'center'
  },
  children
}: PlaceholderProps) => {
  if (loading || !children) {
    return (
      <Flex
        alignItems={alignContent}
        justifyContent={alignContent}
        direction={direction}
        gap={gap}
        style={{ marginTop: margin?.top, marginBottom: margin?.bottom }}
      >
        {[...Array(repeat)].map((_, i) => (
          <div
            style={{
              width,
              height
            }}
            className="placeholder"
            key={i}
          />
        ))}
      </Flex>
    )
  }

  return <>{children}</>
}

export default Placeholder
