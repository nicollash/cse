import styled from '@emotion/styled'
import { faCheck, faSquareFull } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FunctionComponent } from 'react'

import { utils, theme } from '~/frontend/styles'
import { Text } from '..'

export interface Props {
  width?: string
  className?: string
  helperText?: string
  hasError?: boolean
  value?: boolean | null
  isNullable?: boolean
  label?: string

  onChange?: (value: boolean | null) => any
}

const CheckboxWrapper = styled.div<{ width?: string; hasError?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  width: ${({ width }) => (width ? width : 'auto')};

  margin: 0;
  padding: 0;
  position: relative;
`

const CheckboxControlWrapper = styled.div<{
  hasError?: boolean
  value?: boolean
}>`
  width: 16px;
  height: 16px;
  box-sizing: content-box;
  border-radius: 5px;
  border-style: solid;
  border-width: 3px;
  margin: 15px 0;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6em;

  background-color: ${({ value }) => (value ? theme.color.primary : 'white')};
  border-color: ${({ hasError }) => (hasError ? theme.color.error : theme.color.primary)};
`

export const Checkbox: FunctionComponent<Props> = ({
  label,
  width,
  className,
  value,
  hasError,
  helperText,
  isNullable,
  onChange,
}) => {
  return (
    <CheckboxWrapper width={width} className={className}>
      <div css={[utils.centerAlign]}>
        <CheckboxControlWrapper
          onClick={() => {
            if (isNullable) {
              if (value === true) {
                onChange(false)
              } else if (value === false) {
                onChange(null)
              } else {
                onChange(true)
              }
            } else {
              onChange(!value)
            }
          }}
          hasError={hasError}
          value={value}
        >
          {value && <FontAwesomeIcon icon={faCheck} color="white" />}
          {value === null && (
            <FontAwesomeIcon icon={faSquareFull} color={theme.color.primary} />
          )}
        </CheckboxControlWrapper>
        {label && <span css={utils.ml(3)}>{label}</span>}
      </div>
      {!!helperText && (
        <Text
          css={[utils.pt(1), utils.pl(5)]}
          color={hasError ? theme.color.error : theme.color.default}
        >
          {helperText}
        </Text>
      )}
    </CheckboxWrapper>
  )
}
