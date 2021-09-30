
import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import { FunctionComponent } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortAlphaDown, faSortAlphaUp, faSort } from '@fortawesome/free-solid-svg-icons'

import { theme, utils } from '~/frontend/styles'
import { useLocale } from '~/frontend/hooks'

export const QuoteTable = styled.table`
  width: 100%;
  border-spacing: 0;

  td,
  th {
    padding: 1rem;
    text-align: center;
  }
`
export const QuoteBody = styled.tbody``

interface HeaderProps {
  columns: { name: string; field: string; hiddenOnMobile: boolean }[]
  sortBy?: { column: string; direction: 'asc' | 'desc' }
  onSort?: (column: string, direction: 'asc' | 'desc') => any
}

export const QuoteHeader: FunctionComponent<HeaderProps> = ({
  columns,
  sortBy,
  onSort,
}) => {
  const { messages } = useLocale()

  return (
    <thead data-testid="header-row">
      <tr>
        {columns.map((column, index) => (
          <th
            data-testid={`header-${index}`}
            key={index}
            onClick={() =>
              onSort &&
              onSort(
                column.field,
                column.field === sortBy.column && sortBy.direction === 'asc'
                  ? 'desc'
                  : 'asc',
              )
            }
            css={[
              css`
                border-bottom: 2px solid ${theme.color.primary};
              `,
              column.hiddenOnMobile && utils.hideOnMobile,
            ]}
          >
            {messages.QuoteList[column.name]}
            {column.field === sortBy.column ? (
              <FontAwesomeIcon
                color={theme.color.primary}
                css={utils.ml(1)}
                icon={sortBy.direction === 'asc' ? faSortAlphaDown : faSortAlphaUp}
              />
            ) : (
              <FontAwesomeIcon
                color={theme.color.disabled}
                css={utils.ml(1)}
                icon={faSort}
              />
            )}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export const QuoteRow = styled.tr`
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  cursor:pointer;
`
