// Packages
import { Divider, Typography, Flex } from '@strapi/design-system'

// Components
import EntryBox from '@components/content/form/entry/EntryBox'

// Redux
import { useAppSelector } from '@redux/hooks'

// Helpers
import { formatLongDate } from '@helpers/format/formatDate'

const Information = () => {
  const { information } = useAppSelector((state) => state.staticProps)

  return (
    <EntryBox>
      <Typography variant="pi" fontWeight="bold">
        Information
      </Typography>

      <InformationItem
        label="Created At"
        date={formatLongDate(information?.createdAt) || '-'}
      />
      <InformationItem
        label="Last Updated At"
        date={formatLongDate(information?.updatedAt) || '-'}
      />
    </EntryBox>
  )
}

const InformationItem = ({ label = '', date = '' }) => (
  <Flex justifyContent="space-between" gap={2}>
    <Typography variant="sigma" textColor="neutral400">
      {label}
    </Typography>
    <Typography variant="pi">{date}</Typography>
  </Flex>
)

export default Information
