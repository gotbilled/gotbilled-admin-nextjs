// Base
import dynamic from 'next/dynamic'

// Redux
import { useAppSelector } from '@redux/hooks'

// Components
import Information from '@components/content/form/Information'
import EntryBox from '@components/content/form/entry/EntryBox'
import Placeholder from '@components/app/Placeholder'

// Packages
import { Box, TwoColsLayout, Button } from '@strapi/design-system'

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

const UpdateEntry = () => {
  const {
    details: { i18n }
  } = useAppSelector((state) => state.staticProps)
  return (
    <Box paddingLeft={6} paddingRight={6} paddingTop={4} paddingBottom={4}>
      <TwoColsLayout
        startCol={
          <EntryBox padding={0}>
            <FormData />
          </EntryBox>
        }
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

export default UpdateEntry
