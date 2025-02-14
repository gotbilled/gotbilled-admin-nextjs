// Base
import dynamic from 'next/dynamic'

// Packages
import { Flex, Box } from '@strapi/design-system'

// Components
import ListEntries, { Info } from '@components/content/actions/ListEntries'
import AssetData from '@components/content/table/view/AssetData'
import Count from '@components/content/table/Count'
import Placeholder from '@components/app/Placeholder'

// Interfaces
import { Item } from '@components/content/table/view/AssetData'

// Dynamic Components
const ActionBar = dynamic(() => import('@components/content/table/ActionBar'), {
  ssr: false,
  loading: () => (
    <Placeholder
      template={{
        width: '100%',
        height: 52,
        margin: { top: 16, bottom: 16 }
      }}
    />
  )
})
const Limit = dynamic(() => import('@components/content/table/Limit'), {
  ssr: false,
  loading: () => (
    <Placeholder
      template={{
        width: 77,
        height: 38
      }}
    />
  )
})
const Pages = dynamic(() => import('@components/content/table/Pages'), {
  ssr: false,
  loading: () => (
    <Placeholder
      template={{
        width: 120,
        height: 36
      }}
    />
  )
})

const BrowseAssets = ({
  info,
  openUploadAsset,
  selected,
  disableActions,
  disableQuery,
  onSelect
}: {
  info?: Info
  openUploadAsset: Function
  selected: Item[]
  disableActions?: boolean
  disableQuery?: boolean
  onSelect: Function
}) => (
  <>
    <Count info={info} />
    <ActionBar info={info} disableQuery={disableQuery} />

    <ListEntries info={info} rawData addFirstItem={openUploadAsset}>
      <AssetData
        selected={selected}
        onSelect={onSelect}
        disableActions={disableActions}
      />
    </ListEntries>

    <Box>
      <Flex justifyContent="space-between">
        <Limit disableQuery={disableQuery} />
        <Pages disableQuery={disableQuery} />
      </Flex>
    </Box>
  </>
)

export default BrowseAssets
