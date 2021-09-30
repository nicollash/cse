
import { jsx } from '@emotion/react'
import { FunctionComponent, useCallback } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { Modal, Button, Hr, Text } from '~/frontend/components'
import { utils } from '~/frontend/styles'
import { VehicleInfo } from '~/types'
import { useLocale } from '~/frontend/hooks'

interface Props {
  isOpen: boolean
  onDeleteVehicle?: () => any
  onCloseModal?: () => any
  vehicle: VehicleInfo
}

export const DeleteVehicleModal: FunctionComponent<Props> = ({
  isOpen,
  vehicle,
  onDeleteVehicle,
  onCloseModal,
}) => {
  const { messages } = useLocale()

  const onDelete = useCallback(() => {
    onDeleteVehicle()
    onCloseModal()
  }, [vehicle])

  if (!vehicle) {
    return <div></div>
  }

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      title={messages.CarModal.DeleteCar}
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
          src='/assets/icons/delete-car.png'
          width="120px"
          css={utils.mb(4)}
        />
        <Text css={utils.mb(3)}>{messages.CarModal.DeleteCarConfirm}</Text>

        <div
          css={[
            utils.display('flex'),
            utils.alignItems('center'),
            utils.justifyContent('center'),
          ]}
        >
          <Text bold css={utils.mr(3)}>
            {messages.CarModal.Model} : {vehicle.model}
          </Text>
          <Text bold css={utils.mr(3)}>
            {messages.CarModal.Make} : {vehicle.make}
          </Text>
          <Text bold>
            {messages.CarModal.ModelYear} : {vehicle.year}
          </Text>
        </div>

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
