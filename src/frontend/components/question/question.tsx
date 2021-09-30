import styled from '@emotion/styled'
import { FunctionComponent } from 'react'
import ReactSelect from 'react-select'

import { utils, theme } from '~/frontend/styles'
import { Text } from '..'
import { Row } from '../layout'

export interface Props {
  width?: string
  value?: any
  options?: Array<{ label: string; value: any }>
  description?: string
  subText?: string
  onChange?: (e: any) => any
  placeholder?: string
  className?: string
  multiple?: boolean
  disabled?: boolean
  searchable?: boolean
  loading?: boolean
  hasError?: boolean
  helperText?: string
  noOptionsMessage?: string
  boldDesciption?: boolean
  boldSubText?: boolean
}

const Wrapper = styled.div<Props>`
  display: inline-block;
  width: ${({ width }) => (width ? width : 'auto')};
  margin: 0;
  padding: 0;
  color: ${({ hasError }) => (hasError ? theme.color.error : theme.color.default)};
`

export const Question: FunctionComponent<Props> = ({
  width,
  value,
  options,
  description,
  subText,
  onChange,
  placeholder,
  className,
  multiple,
  disabled,
  searchable,
  loading,
  hasError,
  helperText,
  noOptionsMessage,
  boldDesciption,
  boldSubText,
}) => (
  <Wrapper width={width} hasError={hasError} className={className}>
    <Row>
      <div css={[utils.width('85%'), utils.display('flex'), utils.flexDirection('column')]}>
        <Text bold={boldDesciption}>
          {description}
        </Text>
        {
          subText &&
          <Text bold={boldSubText}>
            {subText}
          </Text>
        }
      </div>
      <div css={[utils.width('15%')]}>
        <ReactSelect
          value={
            multiple
              ? options.filter((option) => (value as Array<any>).includes(option.value || ''))
              : options.find((option) => option.value === (value || '')) || null
          }
          options={options}
          onChange={onChange}
          placeholder={placeholder}
          multiple={multiple}
          disabled={disabled}
          isDisabled={disabled}
          searchable={searchable}
          loading={loading}
          hasError={hasError}
          styles={customStyles}
          noOptionsMessage={() => noOptionsMessage}
        />
      </div>
    </Row>

    {!!helperText && (
      <Text
        css={utils.pt(1)}
        size="0.8em"
        color={hasError ? theme.color.error : theme.color.default}
      >
        {helperText}
      </Text>
    )}

  </Wrapper>
)

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    border: `1px solid
      ${state.selectProps.hasError ? theme.errorBorderColor : theme.borderColor}`,
    boxShadow: `5px 5px 10px ${theme.boxShadowColor}`,
    borderRadius: `5px`,
    backgroundColor: 'white',
  }),

  control: (provided) => ({
    ...provided,
    border: 'none',
    boxShadow: 'none',
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),

  indicatorsContainer: (provided, state) => ({
    ...provided,
    color: theme.color.primary,
  }),

  input: (provided) => ({
    ...provided,
    padding: '0',
    margin: '0',
    lineHeight: '1',
  }),

  valueContainer: (provided) => ({
    ...provided,
    padding: '1em',
    margin: '0',
  }),
}
