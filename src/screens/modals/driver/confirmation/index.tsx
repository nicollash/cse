
import { jsx } from '@emotion/react'
import { FunctionComponent, useCallback } from 'react'

import { Modal, Button, Hr, Text } from '~/components'
import { utils } from '~/styles'
import { useLocale } from '~/hooks'

interface Props {
  isOpen: boolean
  infoMessage?: string
  confirmationButtonText?:string
  cancelButtonText?:string
  onCancel?: () => any
  onConfirm?: () => any
}

export const ConfirmationModal: FunctionComponent<Props> = ({
  isOpen,
  infoMessage,
  confirmationButtonText,
  cancelButtonText,
  onCancel,
  onConfirm,
}) => {
  const { messages } = useLocale()

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      title={'Confirmation'}
      onCloseModal={onCancel}
      width="580px"
      zIndex={1005}
    >
      <div
        css={[
          utils.display('flex'),
          utils.flexDirection('column'),
          utils.alignItems('center'),
        ]}
      >
        {/*<img
          src='/assets/icons/delete-driver.png'
          width="120px"
          css={utils.mb(4)}
        /> */}
        {infoMessage && <Text css={utils.mb(3)}>{infoMessage}</Text>}

        {infoMessage && <Hr css={[utils.fullWidth, utils.my(5)]} />}

        <div css={utils.centerAlign}>
          <Button css={utils.mr(4)} buttonType="secondary" onClick={onCancel}>
            <Text color="white">{cancelButtonText || messages.Common.No}</Text>
          </Button>

          <Button buttonType="default" onClick={onConfirm}>
            <Text color="white">
              {/*<FontAwesomeIcon icon={faTrashAlt} css={utils.mr(2)} />*/}
              {confirmationButtonText || messages.Common.Yes}
            </Text>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
