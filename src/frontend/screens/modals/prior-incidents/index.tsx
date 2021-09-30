
import { jsx } from '@emotion/react'
import { FunctionComponent } from 'react'

import { Button, Modal, Text } from '~/frontend/components'
import { useLocale } from '~/frontend/hooks'
import { utils } from '~/frontend/styles'

interface Props {
  isOpen: boolean
  onCloseModal: () => any
  onConfirm: () => any
}

export const PriorIncidentsModal: FunctionComponent<Props> = ({
  isOpen,
  onCloseModal,
  onConfirm,
}) => {
  const { messages } = useLocale()

  return (
    <Modal
      title={messages.PriorIncidents.Heading}
      isOpen={isOpen}
      onCloseModal={onCloseModal}
      width="800px"
    >
      <div css={[utils.centerAlign, utils.flexDirection('column')]}>
        <Text size="1em" css={utils.mt(3)}>
          {messages.PriorIncidents.Description}
        </Text>
        <div css={[utils.centerAlign]}>
          <Button
            css={[utils.mt(5), utils.mx(3)]}
            buttonType="secondary"
            onClick={onCloseModal}
          >
            {messages.Common.No}
          </Button>
          <Button css={[utils.mt(5), utils.mx(3)]} onClick={onConfirm}>
            {messages.Common.Yes}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
