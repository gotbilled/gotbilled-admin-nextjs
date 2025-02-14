import dynamic from 'next/dynamic'

// Components
import Placeholder from '@components/app/Placeholder'
import Label from '@components/custom/Label'

// Dynamic Compoonents
const CKeditor = dynamic(() => import('@components/vendors/CKeditor'), {
  ssr: false,
  loading: () => (
    <Placeholder
      template={{
        width: '100%',
        height: 400
      }}
    />
  )
})

const RichText = ({
  label,
  value,
  onChange,
  localized,
  required = false,
  disabled = false
}: {
  label: string
  value: string
  onChange: Function
  localized?: boolean
  required?: boolean
  disabled?: boolean
}) => (
  <div>
    <Label label={label} localized={localized} required={required} />
    <CKeditor value={value} onChange={onChange} disabled={disabled} />
  </div>
)

export default RichText
