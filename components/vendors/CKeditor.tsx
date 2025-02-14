import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

// CKEditor
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build'
import { FileLoader } from '@ckeditor/ckeditor5-upload/src/filerepository'

// Helpers
import { authCreate } from '@helpers/api/contentAPI'

const CKeditor = ({
  value,
  onChange,
  disabled = false
}: {
  value: string
  onChange: Function
  disabled?: boolean
}) => {
  const { data: session } = useSession()
  const [timer, setTimer] = useState<NodeJS.Timeout>()

  const uploadAdapter = (loader: FileLoader) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then(async (file) => {
            if (!file) {
              return
            }

            const formData = new FormData()
            formData.append('file', file)

            if (!session?.jwt) {
              throw Error('Missing session token')
            }

            const uploadedAsset = await authCreate({
              url: '/assets',
              body: formData,
              token: session.jwt
            })

            resolve({
              default: `${process.env.NEXT_PUBLIC_SERVER_URL}${
                uploadedAsset.image.size.large
                  ? uploadedAsset.image.size.large.url
                  : uploadedAsset.image.size.original.url
              }`
            })
          })
        })
      }
    }
  }

  function UploadPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (
      loader: FileLoader
    ) => {
      return uploadAdapter(loader)
    }
  }

  const delayChangeValue = (event: any, editor: any) => {
    clearTimeout(timer)
    setTimer(
      setTimeout(() => {
        changeValue(event, editor)
      }, 500)
    )
  }

  const changeValue = (event: any, editor: any) => {
    const data = editor.getData()
    onChange(data)
  }

  return (
    <CKEditor
      config={{
        extraPlugins: [UploadPlugin as any]
      }}
      editor={Editor}
      data={value}
      onBlur={changeValue}
      onChange={delayChangeValue}
      disabled={disabled}
    />
  )
}

export default CKeditor
