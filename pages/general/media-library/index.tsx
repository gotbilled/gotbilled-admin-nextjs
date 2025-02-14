// Base
import { useState } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

// Packages
import { Button } from '@strapi/design-system'
import { Plus } from '@strapi/icons'

// Redux
import { useAppSelector, useAppDispatch } from 'redux/hooks'
import { showPopup } from '@redux/slices/utilitiesSlice'

// View
import mediaLibraryView from 'public/views/general/media-library.json'

// Interfaces
import { Item } from '@components/content/table/view/AssetData'

// Components
import Navigation from '@components/app/Navigation'
import UploadAssetPopup from '@components/media-library/UploadAssetPopup'
import BrowseAssets from '@components/media-library/BrowseAssets'
import EntryBox from '@components/content/table/EntryBox'
import RoleAllow from '@components/content/RoleAllow'
import Placeholder from '@components/app/Placeholder'
import Header from '@components/content/table/Header'

export default function ContentList() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const user = useAppSelector((state) => state.userData)

  const {
    details: { title }
  } = useAppSelector((state) => state.staticProps)

  const [selectedData, setSelectedData] = useState<Item[]>([])

  const openUploadAsset = () => {
    dispatch(
      showPopup({
        content: <UploadAssetPopup />
      })
    )
  }

  const updateSelected = (selected: Item[]) => {
    setSelectedData(selected)
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout">
        <Navigation />

        <main>
          <Header>
            <Placeholder
              loading={!user.role.name}
              template={{
                width: 115,
                height: 40
              }}
            >
              <RoleAllow role={user.role} content="assets" permission="write">
                <Button startIcon={<Plus />} onClick={openUploadAsset}>
                  Add Asset
                </Button>
              </RoleAllow>
            </Placeholder>
          </Header>
          <EntryBox>
            <BrowseAssets
              selected={selectedData}
              onSelect={updateSelected}
              openUploadAsset={openUploadAsset}
            />
          </EntryBox>
        </main>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      initialReduxState: {
        staticProps: {
          details: { title: 'Media Library', titleSingular: 'Asset' },
          listView: mediaLibraryView,
          searchFields: ['name']
        }
      }
    }
  }
}
