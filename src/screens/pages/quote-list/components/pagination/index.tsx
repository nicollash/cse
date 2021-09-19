
import { jsx } from '@emotion/react'
import styled from '@emotion/styled'
import { FunctionComponent, useMemo } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

import { theme, utils } from '~/styles'
import { useLocale } from '~/hooks'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => any
}

const PaginationWrapper = styled.div``

const PaginationButton = styled.button<{ active?: boolean }>`
  border: none;
  background: white;
  padding: 1em;
  outline: none;
  color: ${({ active }) => (active ? theme.color.default : theme.color.disabled)};
  min-width: 52px;
`

export const Pagination: FunctionComponent<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,

  ...props
}) => {
  const { messages } = useLocale()

  const visiblePages = useMemo(() => {
    if (totalPages === 1) {
      return [1]
    } else if (totalPages === 2) {
      return [1, 2]
    } else if (currentPage === totalPages) {
      return [currentPage - 2, currentPage - 1, currentPage]
    } else if (currentPage === 1) {
      return [1, 2, 3]
    } else {
      return [currentPage - 1, currentPage, currentPage + 1]
    }
  }, [currentPage, totalPages])

  return (
    <PaginationWrapper {...props}>
      <PaginationButton
        data-testid="button-prev"
        active={currentPage > 1}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} css={utils.mr(2)} />
        {messages.Pagination.Prev}
      </PaginationButton>
      {visiblePages.map((page, index) => (
        <PaginationButton
          data-testid={`button-page${page}`}
          key={index}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PaginationButton>
      ))}
      <PaginationButton
        data-testid="button-next"
        active={currentPage < totalPages}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      >
        {messages.Pagination.Next}
        <FontAwesomeIcon icon={faArrowRight} css={utils.ml(2)} />
      </PaginationButton>
    </PaginationWrapper>
  )
}
