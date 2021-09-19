import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FunctionComponent } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

import { theme } from '~/styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconProp
}

const Button = styled.button`
  border: 1px solid ${theme.borderColor};
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 50%;
  background-color: transparent;
  box-shadow: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const IconButton: FunctionComponent<ButtonProps> = ({
  icon,
  className,
  children,
  ...props
}) => (
  <Button className={className} {...props}>
    <FontAwesomeIcon icon={icon} fontSize={18} />
  </Button>
)
