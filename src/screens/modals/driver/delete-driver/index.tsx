
import { jsx } from '@emotion/react'
import { FunctionComponent, useCallback } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { Modal, Button, Hr, Text } from '~/components'
import { utils } from '~/styles'
import { DriverInfo } from '~/types'
import { useLocale } from '~/hooks'

interface Props {
  isOpen: boolean
  driver: DriverInfo
  onCloseModal?: () => any
  onDeleteDriver?: () => any
}

export const DeleteDriverModal: FunctionComponent<Props> = ({
  isOpen,
  driver,
  onDeleteDriver,
  onCloseModal,
}) => {
  const { messages } = useLocale()

  const onDelete = useCallback(() => {
    onDeleteDriver()
    onCloseModal()
  }, [driver])

  if (!driver) {
    return <div></div>
  }

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      title={messages.DriverModal.DeleteDriver}
      onCloseModal={onCloseModal}
      width="580px"
    >
      <div
        css={[
          utils.display('flex'),
          utils.flexDirection('column'),
          utils.alignItems('center'),
        ]}
      >
        <img
          src='/assets/icons/delete-driver.png'
          width="120px"
          css={utils.mb(4)}
        />
        <Text css={utils.mb(3)}>{messages.DriverModal.DeleteDriverConfirm}</Text>

        <Text bold css={utils.mr(3)}>
          ({`${driver.firstName} ${driver.lastName}`})
        </Text>

        <Hr css={[utils.fullWidth, utils.my(5)]} />

        <div css={utils.centerAlign}>
          <Button css={utils.mr(4)} buttonType="secondary" onClick={onCloseModal}>
            <Text color="white">{messages.Common.Cancel}</Text>
          </Button>

          <Button buttonType="danger" onClick={onDelete}>
            <Text color="white">
              <FontAwesomeIcon icon={faTrashAlt} css={utils.mr(2)} />
              {messages.Common.Yes}
            </Text>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
