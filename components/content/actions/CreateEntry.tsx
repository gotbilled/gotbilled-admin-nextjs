// Base
import dynamic from 'next/dynamic'

// Components
import Information from '@components/content/form/Information'
import Placeholder from '@components/app/Placeholder'

// Packages
import { Box, TwoColsLayout } from '@strapi/design-system'

// Redux
import { useAppSelector } from '@redux/hooks'

// Dynamic Components
const FormData = dynamic(() => import('@components/content/form/FormData'), {
  ssr: false,
  loading: () => (
    <Placeholder
      template={{
        width: '100%',
        height: 283
      }}
    />
  )
})
const Relation = dynamic(() => import('@components/content/form/Relation'), {
  ssr: false,
  loading: () => (
    <Placeholder
      template={{
        width: 'calc(100% - 48px)',
        height: 62,
        margin: { top: 24, bottom: 24 }
      }}
    />
  )
})
const Localization = dynamic(
  () => import('@components/content/form/Localization'),
  {
    ssr: false,
    loading: () => (
      <Placeholder
        template={{
          width: 'calc(100% - 48px)',
          height: 100,
          margin: { top: 24, bottom: 24 }
        }}
      />
    )
  }
)

const CreateEntry = () => {
  const {
    details: { i18n }
  } = useAppSelector((state) => state.staticProps)

  return (
    <Box paddingLeft={6} paddingRight={6} paddingTop={4} paddingBottom={4}>
      <TwoColsLayout
        startCol={<FormData />}
        endCol={
          <div className="content-column">
            <Information />
            {i18n && <Localization />}
            <Relation />
          </div>
        }
      />
    </Box>
  )
}

export default CreateEntry
