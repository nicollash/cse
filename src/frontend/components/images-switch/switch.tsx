import { css, jsx } from '@emotion/react'
import styled from '@emotion/styled'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FunctionComponent } from 'react'
import { mediaBreakpointUp } from 'react-grid'

import { utils, theme } from '~/frontend/styles'
import { Text } from '..'


type Option = {
  label: string
  value: any
  icon?: IconProp
  url?: string
}

export interface Props {
  width?: string
  className?: string
  imgClassName?: string
  value?: any
  options?: Array<Option>
  helperText?: string
  iconsFontSize?: number
  onChange?: (value: any) => any
}

const styles = {
  img: css`
  max-width: 100%;
  max-height: 100%;
  width: 6em;
  `
}

const SwitchWrapper = styled.div<{ width?: string; hasError?: boolean }>`
  display: inline-block;
  width: ${({ width }) => (width ? width : 'auto')};

  margin: 0;
  padding: 0;
  position: relative;
`

const SwitchOptions = styled.div`
  /*display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;  
  ${mediaBreakpointUp('lg')} {
    justify-content: flex-start;
  }*/

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
  grid-auto-rows: 150px;
  grid-gap: 5px;
`

const SwitchOption = styled.button<{ selected?: boolean }>`
  border: 1px solid ${theme.borderColor};
  box-shadow: 5px 5px 16px ${theme.boxShadowColor};
  border-radius: 4px;
  padding: 0.5em;
  font-size: 1em;
  position: relative;
  outline: none;
  flex: 1;
  cursor:pointer;
  min-height: 100%;

  background-color: ${({ selected }) => (selected ? theme.color.primary : 'white')};
  color: ${({ selected }) => (selected ? 'white' : theme.color.default)};

  margin: 0.5em;
  /*
  &:not(:last-child) {
    margin-right: 1em;
  }*/
`



export const ImagesSwitch: FunctionComponent<Props> = ({
  width,
  className,
  iconsFontSize,
  imgClassName,
  value,
  options,
  helperText,
  onChange,
}) => {
  return (
    <SwitchWrapper width={width} className={className}>
      <SwitchOptions>
        {options.map((option, key) => {
    
          return (
            <SwitchOption
              type="button"
              key={key}
              onClick={() => onChange(option.value)}
              selected={option.value === value}
            >
              {
                <div css={[utils.mb(2)]}>
                  {option.icon ?
                  <Text size="4em">                    
                      <FontAwesomeIcon color={value == option.value ? 'white' : 'black'} icon={option.icon} />    
                  </Text>
                  :
                  <img css={styles.img} src={`./src/assets/images/${option.url}`} />
                  }
                  <br />
                </div>
              }

              {option.label}
            </SwitchOption>
          )
        })}
      </SwitchOptions>
      {!!helperText && (
        <Text css={utils.pt(1)} size="0.8em">
          {helperText}
        </Text>
      )}
    </SwitchWrapper>
  )
}
