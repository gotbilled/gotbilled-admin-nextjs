// Base
import { useEffect, useState } from 'react'

// Redux
import { useAppDispatch } from '@redux/hooks'
import { hidePopup, showPopup } from '@redux/slices/utilitiesSlice'

// Packages
import {
  Button,
  Typography,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  TabGroup,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  Flex
} from '@strapi/design-system'

// View
import mediaLibraryView from 'public/views/general/media-library.json'

// Interfaces
import { Item } from '@components/content/table/view/AssetData'
import { ListView } from '@components/content/actions/ListEntries'

// Components
import BrowseAssets from './BrowseAssets'
import AssetItem from '@components/content/table/items/AssetItem'
import SortableList from '@components/custom/SortableList'
import UploadAssetPopup from '@components/media-library/UploadAssetPopup'

const SelectAssetPopup = ({
  selectedAssets,
  mimetype,
  relation,
  onChange
}: {
  selectedAssets: Item[]
  mimetype?: string
  relation?: 'single' | 'multi'
  onChange: Function
}) => {
  const dispatch = useAppDispatch()

  const [assets, setAssets] = useState<Item[]>(selectedAssets)
  const [tabIndex, setTabIndex] = useState(0)

  const closePopup = () => {
    dispatch(hidePopup())
  }

  const saveAndClose = () => {
    switch (relation) {
      case 'single':
        onChange(assets.length > 0 ? assets[0] : undefined)
        break
      case 'multi':
        onChange(assets, true)
        break
    }
    dispatch(hidePopup())
  }

  const updateAssets = (updatedAssets: Item[]) => {
    switch (relation) {
      case 'single':
        setAssets(
          updatedAssets.length > 0
            ? [updatedAssets[updatedAssets.length - 1]]
            : []
        )
        break
      case 'multi':
        setAssets(updatedAssets)
        break
    }
  }

  const updateAssetDetails = (updatedAsset: Item) => {
    updateAssets(
      assets.map((asset) =>
        asset._id == updatedAsset._id ? updatedAsset : asset
      )
    )
  }

  const deleteAsset = (deletedAsset: Item) => {
    const updatedAssets = assets.filter(
      (asset) => asset._id != deletedAsset._id
    )
    updateAssets(updatedAssets)
  }

  const selectUploadedAssets = (uploadedAssets: Item[]) => {
    if (mimetype) {
      uploadedAssets = uploadedAssets.filter((asset) =>
        asset.mimetype.includes(mimetype)
      )
    }
    updateAssets([...assets, ...uploadedAssets])
  }

  const openUploadPopup = () => {
    dispatch(
      showPopup({
        content: (
          <UploadAssetPopup
            onUploaded={selectUploadedAssets}
            mimetype={mimetype}
          />
        )
      })
    )
  }

  return (
    <ModalLayout onClose={closePopup} labelledBy="media">
      <ModalHeader>
        <Typography
          fontWeight="bold"
          textColor="neutral800"
          as="h2"
          id="details"
        >
          Browse and Select Assets
        </Typography>
      </ModalHeader>
      <ModalBody>
        <TabGroup
          label="Media library tabs"
          id="tabs"
          variant="simple"
          initialSelectedTabIndex={tabIndex}
          onTabChange={setTabIndex}
        >
          <Flex justifyContent="space-between">
            <Tabs>
              <Tab>Browse</Tab>
              <Tab>
                Selected{' '}
                <Badge size="S" active={false}>
                  {assets.length}
                </Badge>
              </Tab>
            </Tabs>
            <Button onClick={openUploadPopup}>Upload more asstes</Button>
          </Flex>
          <TabPanels>
            <TabPanel>
              <Box
                color="neutral800"
                paddingTop={4}
                paddingBottom={4}
                background="neutral0"
              >
                <BrowseAssets
                  info={{
                    details: { title: 'Media Library', titleSingular: 'Asset' },
                    listView: {
                      ...(mediaLibraryView as ListView),
                      filter: [
                        // ...mediaLibraryView.filter || [],
                        {
                          key: 'mimetype',
                          symbol: '^',
                          value: mimetype || ''
                        }
                      ]
                    },
                    searchFields: ['name']
                  }}
                  selected={assets}
                  openUploadAsset={openUploadPopup}
                  disableActions
                  disableQuery
                  onSelect={updateAssets}
                />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box color="neutral800" padding={4} background="neutral0">
                <Flex justifyContent="space-between">
                  <Box>
                    <Box>
                      <Typography variant="pi" fontWeight="bold">
                        {assets.length} assets selected
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="pi" textColor="neutral500">
                        Manage the assets before adding them to the Media
                        Library
                      </Typography>
                    </Box>
                  </Box>
                </Flex>
                <Flex gap={4} wrap="wrap" paddingTop={4}>
                  <SortableList
                    // handle=".drag"
                    list={assets}
                    onChange={updateAssets}
                    className="assets-list"
                  >
                    {assets.map((asset) => (
                      <AssetItem
                        item={asset}
                        onDelete={deleteAsset}
                        onUpdate={updateAssetDetails}
                        key={asset._id}
                      />
                    ))}
                  </SortableList>
                </Flex>
              </Box>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={closePopup} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={<Button onClick={saveAndClose}>Finish</Button>}
      />
    </ModalLayout>
  )
}

export default SelectAssetPopup
