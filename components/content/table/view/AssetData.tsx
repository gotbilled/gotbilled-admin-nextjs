// Base
import { useContext } from 'react'

// Packages
import { Box, Typography, Flex, Icon, Checkbox } from '@strapi/design-system'
import { Trash } from '@strapi/icons'

// Context
import { ListContext } from '@components/content/actions/ListEntries'

// Components
import AssetItem from '@components/content/table/items/AssetItem'
import CustomTextButton from '@components/custom/CustomTextButton'
import DeleteConfirmation from '@components/popups/DeleteConfirmation'

// Redux
import { useAppDispatch } from '@redux/hooks'
import { refreshData } from '@redux/slices/tableDataSlice'
import { showPopup } from '@redux/slices/utilitiesSlice'
import Placeholder from '@components/app/Placeholder'

export interface Image {
  height: number
  width: number
  url: string
  size: number
}

interface File {
  url: string
  size: number
}

export interface Item {
  _id: string
  name: string
  ext: string
  mimetype: string
  alt?: string
  image?: {
    size: {
      original: Image
      [key: string]: Image
    }
  }
  file?: File
  createdAt: string
  updatedAt: string
}

const AssetData = ({
  selected,
  onSelect,
  disableActions
}: {
  selected: Item[]
  onSelect: Function
  disableActions?: boolean
}) => {
  const dispatch = useAppDispatch()

  const { data, loading }: { data: Item[]; loading: boolean } =
    useContext(ListContext)

  const deleteCompleted = () => {
    dispatch(refreshData())
    onSelect([])
  }

  const updateSelected = (asset: Item) => {
    if (selected.some((selectedAsset) => selectedAsset._id == asset._id)) {
      onSelect(
        selected.filter((selectedAsset) => selectedAsset._id != asset._id)
      )
    } else {
      onSelect([...selected, asset])
    }
  }

  const selectAll = () => {
    onSelect(selected.length == data.length ? [] : data)
  }

  const isSelected = (asset: Item) => {
    return selected.some((selectedAsset) => selectedAsset._id == asset._id)
  }

  const deleteAssets = (assets: Item[]) => {
    dispatch(
      showPopup({
        content: (
          <DeleteConfirmation
            description="Are you sure you want to delete selected assets?"
            endpoint="/assets"
            ids={assets.map((asset) => asset._id)}
            onComplete={deleteCompleted}
          />
        )
      })
    )
  }

  // if (!data || loading)
  //   return (
  //     <>
  //       <Placeholder
  //         template={{
  //           width: 148,
  //           height: 36
  //         }}
  //       />
  // <Placeholder
  //   template={{
  //     width: '100%',
  //     height: 219
  //   }}
  // />
  //     </>
  //   )

  return (
    <Box>
      <Flex gap={4} paddingBottom={4}>
        {!disableActions && (
          <Placeholder
            loading={!data && loading}
            template={{
              width: 148,
              height: 36
            }}
          >
            <Flex
              background="neutral0"
              padding={2}
              gap={4}
              className="checkbox-singular"
            >
              <Checkbox
                indeterminate={
                  selected.length > 0 && selected.length < data?.length
                }
                value={selected.length == data?.length}
                onClick={selectAll}
              >
                {''}
              </Checkbox>
              {selected.length > 0 ? (
                <Flex>
                  <Typography variant="omega" fontWeight="bold">
                    {selected.length} assets selected
                  </Typography>
                  {' — '}
                  <CustomTextButton onClick={() => deleteAssets(selected)}>
                    <Typography
                      variant="omega"
                      fontWeight="bold"
                      textColor="danger600"
                    >
                      Delete selected &nbsp;
                      <Icon width={3} height={3} color="danger600" as={Trash} />
                    </Typography>
                  </CustomTextButton>
                </Flex>
              ) : (
                <Typography variant="omega" fontWeight="bold">
                  Select all assets
                </Typography>
              )}
            </Flex>
          </Placeholder>
        )}
      </Flex>
      <div className="assets">
        <Placeholder
          loading={!data || loading}
          template={{
            width: '100%',
            height: 219,
            repeat: 4,
            direction: 'row',
            gap: 4
          }}
        >
          <Flex gap={4} wrap="wrap">
            {data?.map((item) => (
              <AssetItem
                item={item}
                selected={isSelected(item)}
                onSelect={() => updateSelected(item)}
                onDelete={() => deleteAssets([item])}
                disableActions={disableActions}
                key={item._id}
              />
            ))}
          </Flex>
        </Placeholder>
      </div>
    </Box>
  )
}

export default AssetData
