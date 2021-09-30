import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import { FunctionComponent, InputHTMLAttributes, useState } from 'react'

import { utils, theme } from '~/frontend/styles'
import { Text } from '..'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  width?: string
  hasError?: boolean
  helperText?: string
  disablePlaceholderPopup?: boolean
  'data-testid'?: string
}

const InputWrapper = styled.div<{ width?: string; hasError?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${({ width }) => (width ? width : 'auto')};
  margin: 0;
  padding: 0;

  color: ${({ hasError }) => (hasError ? theme.color.error : theme.color.default)};

  input:-internal-autofill-selected ~ label {
    transform: translate3d(0, 0.75em, 0);
    padding: 0 1.5em;
    font-size: 0.75em;

    & ~ fieldset {
      legend {
        max-width: 1000px;
      }
    }
  }
`

const FieldWrapper = styled.fieldset<{ hasError?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0em;
  right: 0;
  left: 0;
  padding: 0 0.5em;
  height: 3.25em;

  border: 1px solid
    ${({ hasError }) => (hasError ? theme.errorBorderColor : theme.borderColor)};
  box-shadow: 5px 5px 10px ${theme.boxShadowColor};
  border-radius: 5px;

  pointer-events: none;
`

const Legend = styled.legend<{ visible?: boolean }>`
  display: block;
  padding: 0;
  font-size: 0.75em;
  overflow: hidden;
  height: 0;

  max-width: ${({ visible }) => (visible ? '1000px' : '0px')};
  visibility: hidden;
  transition: max-width 50ms cubic-bezier(0, 0, 0.2, 1) 0ms;

  > span {
    padding: 0 0.5em;
  }
`

const InputControl = styled.input<InputProps>`
  font-size: 1em;
  width: 100%;

  margin: 0;
  padding: 1em;
  border: none;

  color: ${({ hasError }) => (hasError ? theme.color.error : theme.color.default)};
  border: 1px solid transparent;
  border-radius: 5px;

  &:active,
  &:focus {
    outline: none;
  }
`

export const Input: FunctionComponent<InputProps> = ({
  width,
  hasError,
  helperText,
  className,
  placeholder,
  disablePlaceholderPopup = false,
  onFocus,
  onBlur,
  'data-testid': dataTestId,
  ...props
}) => {
  const [focused, setFocused] = useState<boolean>(false)
  const transform = focused || props.value !== '' ? 'up' : 'down'

  return (
    <InputWrapper
      width={width}
      hasError={hasError}
      className={className}
      data-testid={dataTestId}
    >
      <InputControl
        data-testid="control-input"
        hasError={hasError}
        placeholder={disablePlaceholderPopup ? placeholder : ''}
        onFocus={(e) => {
          setFocused(true)
          onFocus && onFocus(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          onBlur && onBlur(e)
        }}
        {...props}
      />
      {!disablePlaceholderPopup && (
        <label
          css={[styles.label.container, styles.label.transform.container[transform]]}
        >
          <span data-content={placeholder} css={[styles.label.content]}>
            {placeholder}
          </span>
        </label>
      )}
      <FieldWrapper hasError={hasError}>
        {placeholder && (
          <Legend visible={transform === 'up'}>
            <span>{placeholder}</span>
          </Legend>
        )}
      </FieldWrapper>
      {!!helperText && (
        <Text
          data-testid="label-error"
          css={[utils.pt(1), utils.pl(2)]}
          color={hasError ? theme.color.error : theme.color.default}
        >
          {helperText}
        </Text>
      )}
    </InputWrapper>
  )
}

const styles = {
  label: {
    container: css`
      display: inline-block;
      position: absolute;
      width: 100%;
      bottom: 100%;
      text-align: left;
      color: #6d7d84;
      user-select: none;
      pointer-events: none;
      overflow: hidden;
      transform: translate3d(0, 2.5em, 0);
      transition: all 0.3s;
      transition-timing-function: ease-in-out;
    `,

    content: css`
      position: relative;
      display: block;
      width: 100%;
      color: #6d7d84;
      white-space: nowrap;
      text-overflow: ellipsis;
      transition-timing-function: ease-in-out;
    `,

    transform: {
      container: {
        up: css`
          transform: translate3d(0, 0.75em, 0);
          padding: 0 1.5em;
          font-size: 0.75em;
        `,
        down: css`
          font-size: 1em;
          padding: 0 1em;
        `,
      },
    },
  },
}
