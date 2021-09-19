import styled from '@emotion/styled'
import { FunctionComponent } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'

import { utils, theme } from '~/styles'

import { Text } from '..'

export interface Props {
  min?: number
  max?: number
  value?: number
  step?: number
  prefix?: string
  onChange: (v: number) => any

  width?: string
  className?: string
  hasError?: boolean
  helperText?: string
}

const SpinnerWrapper = styled.div<{ width?: string }>`
  display: inline-block;
  width: ${({ width }) => (width ? width : 'auto')};

  margin: 0;
  padding: 0;
  position: relative;
`

const SpinnerControlWrapper = styled.div<{ hasError?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid
    ${({ hasError }) => (hasError ? theme.errorBorderColor : theme.borderColor)};
  background-color: white;
  box-shadow: 5px 5px 16px ${theme.boxShadowColor};
  border-radius: 4px;
`

const SpinnerInput = styled.input`
  border: none;
  outline: none;
  padding: 1em;
  font-size: 1em;
  text-align: center;
  min-width: 0;
  width: 0;
  flex: 1;

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  -moz-appearance: textfield;
`

const SpinnerAction = styled.button`
  border: none;
  outline: none;
  padding: 1em;
  font-size: 1em;
  background-color: white;
`

export const Spinner: FunctionComponent<Props> = ({
  min = null,
  max = null,
  value,
  step = 1,
  prefix = '',
  onChange,
  width,
  className,
  hasError,
  helperText,
}) => {
  return (
    <SpinnerWrapper width={width} className={className}>
      <SpinnerControlWrapper hasError={hasError}>
        <SpinnerAction
          type="button"
          onClick={() => {
            if (min === null || value > min) {
              onChange(value - step)
            }
          }}
        >
          <FontAwesomeIcon icon={faMinus} color={theme.color.primary} />
        </SpinnerAction>
        <SpinnerInput
          type="string"
          value={`${prefix} ${value}`}
          onChange={(e) => {
            const v = +e.target.value.substr(prefix.length + 1)
            if (min !== null && v < min) {
              onChange(min)
            } else if (max !== null && v > max) {
              onChange(max)
            } else {
              onChange(v)
            }
          }}
        />
        <SpinnerAction
          type="button"
          onClick={() => {
            if (max === null || value < max) {
              onChange(value + step)
            }
          }}
        >
          <FontAwesomeIcon icon={faPlus} color={theme.color.primary} />
        </SpinnerAction>
      </SpinnerControlWrapper>

      {!!helperText && (
        <Text
          css={utils.pt(1)}
          size="0.8em"
          color={hasError ? theme.color.error : theme.color.default}
        >
          {helperText}
        </Text>
      )}
    </SpinnerWrapper>
  )
}
