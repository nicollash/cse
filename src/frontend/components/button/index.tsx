import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FunctionComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { theme } from '~/frontend/styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string
  rounded?: boolean
  buttonType?: 'outline' | 'default' | 'secondary' | 'danger' | 'black'
  nowrap?: boolean
}

const getBorderColorByType = (type = 'default') => {
  switch (type) {
    case 'outline':
      return theme.borderColor
    case 'default':
      return theme.color.primary
    case 'secondary':
      return theme.color.secondary
    case 'danger':
      return theme.color.danger
    case 'black':
      return '#3c3c3c'
    default:
      return 'white'
  }
}

const getBackgroundColorByType = (type = 'default') => {
  switch (type) {
    case 'outline':
      return 'white'
    case 'default':
      return theme.color.primary
    case 'secondary':
      return theme.color.secondary
    case 'danger':
      return theme.color.danger
    case 'black':
      return '#3c3c3c'
    case 'disabled':
      return 'darkgray'
    default:
      return 'white'
  }
}

const getColorByType = (type = 'default') => {
  switch (type) {
    case 'outline':
      return theme.color.default
    case 'default':
      return 'white'
    case 'secondary':
      return 'white'
    case 'danger':
      return 'white'
    default:
      return 'white'
  }
}

export const Button = styled.button<ButtonProps>`
  font-size: 1em;
  padding: 1em 2em;

  display: flex;
  align-items: center;
  justify-content: space-around;

  border-radius: ${({ rounded = true }) => (rounded ? '4px' : '0px')};
  border: 1px solid ${({ buttonType }) => getBorderColorByType(buttonType)};
  background-color: ${({ buttonType, disabled }) =>
    getBackgroundColorByType(disabled ? 'disabled' : buttonType)};
  box-shadow: 5px 5px 10px 0px ${theme.boxShadowColor};
  position: relative;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  color: ${({ buttonType }) => getColorByType(buttonType)};
  font-weight: bold;
  white-space: ${({ nowrap }) => (nowrap ? 'nowrap' : 'normal')};
  width: ${({ width }) => width};
  height: fit-content;

  &:focus {
    outline: none;
  }

  // &:hover {
  //   opacity: 0.9;
  // }
`

interface DeleteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const DeleteButtonWrapper = styled.button`
  outline: none;
  background: transparent;
  padding: 1em 0;
  border: none;
  color: ${theme.color.error};
`
const DeleteButtonText = styled.span`
  text-decoration: underline;
  font-weight: bold;
  margin-left: 0.5em;
`

export const DeleteButton: FunctionComponent<DeleteButtonProps> = ({
  children,
  type = 'button',
  ...props
}) => (
  <DeleteButtonWrapper {...props} type={type}>
    <FontAwesomeIcon icon={faTrashAlt} fontSize={24} />
    <DeleteButtonText>{children}</DeleteButtonText>
  </DeleteButtonWrapper>
)
