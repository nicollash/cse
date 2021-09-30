import { FunctionComponent } from 'react'

import { styles } from './styles'

interface Tab {
  title: string
  Content: FunctionComponent
}

interface TabsProps {
  contents: Tab[]
  tabIndex: number
  className?: string
  onTabChange?: (number: number) => any
  centerHeaders?: boolean
  activeBar?: boolean
}

export const Tabs: FunctionComponent<TabsProps> = ({
  contents,
  tabIndex,
  className,
  onTabChange,
  centerHeaders,
  activeBar,
  ...props
}) => (
  <div css={[styles.container]} className={className} {...props}>
    <div css={[styles.header]}>
      {contents &&
        contents.map((item, index) => (
          <div
            key={index}
            data-testid={`tab-${index}`}
            css={[
              styles.tab,
              index === tabIndex && styles.active,
              index === tabIndex && activeBar && styles.activeBar,
              centerHeaders && styles.centerHeader,
            ]}
            onClick={() => {
              onTabChange(index)
            }}
          >
            {item.title}
          </div>
        ))}
    </div>
    {contents && contents[tabIndex] && (
      <div css={[styles.content]}>{contents[tabIndex].Content({})}</div>
    )}
  </div>
)
