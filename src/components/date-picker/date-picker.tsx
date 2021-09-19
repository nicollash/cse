import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import { FunctionComponent, useRef } from 'react'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.min.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

import { theme, utils } from '~/styles'

import { Text } from '..'

export interface Props {
  minDate?: Date
  maxDate?: Date
  value?: Date
  onChange: (v: Date) => any
  disabled?: boolean
  width?: string
  className?: string
  hasError?: boolean
  locale?: string
  helperText?: string
}

const DatePickerWrapper = styled.div<{ width?: string }>`
  display: inline-block;
  width: ${({ width }) => (width ? width : 'auto')};

  margin: 0;
  padding: 0;
  position: relative;
  min-width: 160px;
`

const DatePickerControlWrapper = styled.div<{ hasError?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid
    ${({ hasError }) => (hasError ? theme.errorBorderColor : theme.borderColor)};
  background-color: 'white';
  box-shadow: 5px 5px 16px ${theme.boxShadowColor};
  border-radius: 4px;
`
const ActionIcon = styled.button`
  border: none;
  outline: none;
  padding: 1em;
  font-size: 1em;
  background-color: white;
`

export const DatePicker: FunctionComponent<Props> = ({
  minDate = null,
  maxDate = null,
  value,
  disabled,
  onChange,
  width,
  className,
  hasError,
  helperText,
  ...props
}) => {
  const ref = useRef(null)
  return (
    <DatePickerWrapper width={width} className={className}>
      <DatePickerControlWrapper hasError={hasError} css={utils.fullWidth}>
        <ReactDatePicker
          readOnly={disabled}
          css={[styles.input, styles.bgColor(disabled)]}
          minDate={minDate}
          maxDate={maxDate}
          selected={value}
          onChange={onChange}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          scrollableYearDropdown
          ref={ref}
          {...props}
        />


        <ActionIcon
          css={styles.visible(disabled)}
          type="button"
          onClick={() => {
            ref.current.setFocus()
          }}
        >
          <FontAwesomeIcon icon={faCalendarAlt} color={theme.color.primary} />
        </ActionIcon>

      </DatePickerControlWrapper>

      {!!helperText && (
        <Text
          css={utils.pt(1)}
          size="0.8em"
          color={hasError ? theme.color.error : theme.color.default}
        >
          {helperText}
        </Text>
      )}
    </DatePickerWrapper>
  )
}

const styles = {
  input: css`
    padding: 1em;
    border: none;
    outline: none;
    min-width: 0;
    width: 100%;
  `,
  bgColor: (disabled: boolean) => css`
    background-color: ${disabled ? '#f2f2f2' : 'white'};
    ${disabled && 'box-shadow: 5px 5px 10px rgb(57 57 57 / 22%);'}
  `,
  visible: (disabled: boolean) => css`
    ${disabled && 'visibility: hidden'}
  `
}
