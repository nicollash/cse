
import { css, jsx } from '@emotion/react'
import styled from '@emotion/styled'
import { FunctionComponent } from 'react'

import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { IconButton } from '~/components'
import { utils, theme } from '~/styles'

interface Props {
  text: string
  className?: string
  textIcon?: any
  onDelete?: () => any
  onEdit?: () => any
}

const Wrapper = styled.div<{ leftIcon ?: any }>`
  display: flex;
  align-items: center;
  padding: 1em;
  padding-left: ${({ leftIcon }) => (leftIcon ? 0 : '1em')};
  flex-wrap: wrap;
  border-bottom: 1px solid ${theme.borderColor};
`

const editButtonStyle = css`
  cursor: pointer;
`

const deleteButtonStyle = css`
  cursor: pointer;
`

export const ListItem: FunctionComponent<Props> = ({
  text,
  className,
  textIcon,
  onDelete,
  onEdit,
  ...props
}) => (
  <Wrapper  leftIcon={textIcon} className={className} {...props}>
    <span data-testid="text-name" css={[utils.flex(1), utils.display('flex'), utils.alignItems('center')]}>
    {textIcon &&
        <div css={utils.mr('1px')}>
          {textIcon}
        </div>
      }
      {text}
    </span>
    {onDelete && (
      <IconButton
        data-testid="button-delete"
        css={[utils.ml(2), editButtonStyle]}
        icon={faTrashAlt}
        onClick={onDelete}
      />
    )}
    {onEdit && (
      <IconButton
        data-testid="button-edit"
        css={[utils.ml(2), editButtonStyle]}
        icon={faPen}
        onClick={onEdit}
      />
    )}
  </Wrapper>
)
