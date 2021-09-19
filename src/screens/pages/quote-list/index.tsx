
import { jsx } from '@emotion/react'
import { FunctionComponent, useState, useEffect } from 'react'
import { RouteProps, useHistory } from 'react-router-dom'
import queryString from 'query-string'

import { Screen, Container, Text } from '~/components'
import { theme, utils } from '~/styles'
import { getQuoteList } from '~/services'
import { useAuth, useError, useLocale, useQuote } from '~/hooks'
import { CustomError, QuickQuoteInfo } from '~/types'

import { Pagination, QuoteTable, QuoteHeader, QuoteBody, QuoteRow } from './components'

export const QuoteListScreen: FunctionComponent<RouteProps> = ({ location = {} }) => {
  const router = useRouter()
  const { messages } = useLocale()
  const { user } = useAuth()
  const { setError } = useError()

  const { getQuote } = useQuote()

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(2)
  const [loading, setLoading] = useState<boolean>(true)
  const pageSize = 8
  const [error, setLocalError] = useState<string>('')

  const [quotes, setQuotes] = useState<QuickQuoteInfo[]>([])
  const [sortBy, setSortBy] = useState<{
    column: string
    direction: 'asc' | 'desc'
  }>({
    column: 'Name',
    direction: 'asc',
  })

  useEffect(() => {
    (window as any).ga && (window as any).ga('send', 'QuoteList Page View')
  }, [])

  useEffect(() => {
    const query = (queryString.parse(location.search).query as string) || ''

    setLoading(true)
    getQuoteList(user.LoginId, query, user.DTOProvider.SystemId)
      .then((res) => {
        let error = ''
        let filteredQuotes = []
        if (res.QuickQuoteInfo) {
          filteredQuotes = res.QuickQuoteInfo.filter(
            (info) =>
            (info.InsuredName.toLowerCase().includes(query.toLowerCase()) ||
              info.QuoteNumber.toLowerCase().includes(query.toLowerCase()) ||
              info.InsuredAddress.toLowerCase().includes(query.toLowerCase())),
          )
          if (filteredQuotes.length === 0) {
            filteredQuotes = res.QuickQuoteInfo.slice(0, 5)
            error = 'NoSearchResult'
          }
          setTotalPages(Math.ceil(filteredQuotes.length / pageSize))
          setCurrentPage(1)
          setLocalError((location.state && (location.state as any).error) || error)
        } else {
          setTotalPages(0)
          setCurrentPage(1)
          setLocalError((location.state && (location.state as any).error) || error)
        }
        setQuotes(filteredQuotes)
      }).catch((e) => {
        setError(e)
      })
      .finally(() => setLoading(false))
  }, [location.search])

  return (
    <Screen
      title={messages.MainTitle}
      breadCrumb={[{ link: '/', label: 'Home' }, { label: 'My Quotes' }]}
      css={[utils.flex(1), utils.flexDirection('column')]}
      loading={loading}
    >
      <Container wide css={[utils.flex(1)]}>
        {error && (
          <Text
            size="30px"
            color={theme.color.error}
            textAlign="center"
            css={utils.mb(4)}
          >
            {messages.QuoteList.Error[error]}
          </Text>
        )}
        <QuoteTable data-testid="result-table">
          <QuoteHeader
            columns={columns}
            sortBy={sortBy}
            onSort={(column, direction) => setSortBy({ column, direction })}
          ></QuoteHeader>
          <QuoteBody>
            {quotes
              .sort(
                (a, b) =>
                  (sortBy.direction === 'asc' ? 1 : -1) *
                  (a[sortBy.column] > b[sortBy.column]
                    ? 1
                    : a[sortBy.column] < b[sortBy.column]
                      ? -1
                      : 0),
              )
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((quote, index) => (
                <QuoteRow
                  data-testid={`result-${index}`}
                  key={index}
                  onClick={() => {

                    setLoading(true)
                    getQuote(quote['QuoteNumber'])
                      .then(() => {
                        router.push(`/quote/${quote['QuoteNumber']}/customize`)
                      })
                      .catch((e: Array<CustomError>) => {
                        if (Array.isArray(e)) {
                          e.forEach(err => err.errorData.quoteNumber = quote['QuoteNumber'])
                          setError(e)
                        }
                      }).finally(() => setLoading(false))
                  }}
                >
                  <td data-testid="insured-name">{quote.InsuredName}</td>
                  <td data-testid="effective-date">{quote.EffectiveDate}</td>
                  <td data-testid="last-update-date">{quote.UpdateDt}</td>
                  <td data-testid="quote-number">{quote.QuoteNumber}</td>
                  <td data-testid="insured-address" css={utils.hideOnMobile}>
                    {quote.InsuredAddress}
                  </td>
                </QuoteRow>
              ))}
          </QuoteBody>
        </QuoteTable>
        {totalPages > 1 && (
          <div css={[utils.display('flex'), utils.justifyContent('center'), utils.mt(5)]}>
            <Pagination
              data-testid="pagination"
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Container>
    </Screen>
  )
}

const columns = [
  {
    name: 'Name',
    field: 'InsuredName',
    hiddenOnMobile: false,
  },
  {
    name: 'EffectiveDate',
    field: 'EffectiveDate',
    hiddenOnMobile: false,
  },
  {
    name: 'LastUpdateDate',
    field: 'UpdateDt',
    hiddenOnMobile: false,
  },
  {
    name: 'QuoteNumber',
    field: 'QuoteNumber',
    hiddenOnMobile: false,
  },
  {
    name: 'StreetAddress',
    field: 'InsuredAddress',
    hiddenOnMobile: true,
  },
]
