import styled from '@emotion/styled'
import { FunctionComponent } from 'react'
import { mediaBreakpointUp } from 'react-grid'

import { utils, theme } from '~/frontend/styles'
import { Text } from '..'

type Option = {
  label: string
  value: any
}

export interface Props {
  width?: string
  className?: string
  value?: any
  options?: Array<Option>
  helperText?: string

  onChange?: (value: any) => any
}

const SwitchWrapper = styled.div<{ width?: string; hasError?: boolean }>`
  display: inline-block;
  width: ${({ width }) => (width ? width : 'auto')};

  margin: 0;
  padding: 0;
  position: relative;
`

const SwitchOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mediaBreakpointUp('lg')} {
    justify-content: flex-start;
  }
`

const SwitchOption = styled.button<{ selected?: boolean }>`
  border: 1px solid ${theme.borderColor};
  box-shadow: 5px 5px 16px ${theme.boxShadowColor};
  border-radius: 4px;
  padding: 1em;
  font-size: 1em;
  position: relative;
  outline: none;
  flex: 1;

  background-color: ${({ selected }) => (selected ? theme.color.primary : 'white')};
  color: ${({ selected }) => (selected ? 'white' : theme.color.default)};

  &:not(:last-child) {
    margin-right: 1em;
  }
`

export const Switch: FunctionComponent<Props> = ({
  width,
  className,
  value,
  options,
  helperText,
  onChange,
}) => {
  return (
    <SwitchWrapper width={width} className={className}>
      <SwitchOptions>
        {options.map((option, key) => (
          <SwitchOption
            type="button"
            key={key}
            onClick={() => onChange(option.value)}
            selected={option.value === value}
          >
            {option.label}
          </SwitchOption>
        ))}
      </SwitchOptions>
      {!!helperText && (
        <Text css={utils.pt(1)} size="0.8em">
          {helperText}
        </Text>
      )}
    </SwitchWrapper>
  )
}
