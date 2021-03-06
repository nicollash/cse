import { FunctionComponent, useState, useEffect } from "react";

import { Screen, Container, Text } from "~/frontend/components";
import { theme, utils } from "~/frontend/styles";
import { useLocale } from "~/frontend/hooks";
import { QuickQuoteInfo } from "~/types";

import {
  Pagination,
  QuoteTable,
  QuoteHeader,
  QuoteBody,
  QuoteRow,
} from "~/frontend/screens/pages/quote-list";
import { useRouter } from "next/router";
import { getSession } from "~/backend/lib";
import { QuoteService } from "~/backend/services";
import { formRedirect } from "~/frontend/utils";

const QuoteListPage: FunctionComponent<any> = ({
  user,
  query,
  searchResult,
  lastError,
}) => {
  const router = useRouter();
  const { messages } = useLocale();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(2);
  const pageSize = 8;
  const [error, setLocalError] = useState<string>("");

  const [quotes, setQuotes] = useState<QuickQuoteInfo[]>([]);
  const [sortBy, setSortBy] = useState<{
    column: string;
    direction: "asc" | "desc";
  }>({
    column: "Name",
    direction: "asc",
  });

  useEffect(() => {
    (window as any).ga && (window as any).ga("send", "QuoteList Page View");
  }, []);

  useEffect(() => {
    let error = "";
    let filteredQuotes = [];
    if (searchResult.QuickQuoteInfo) {
      filteredQuotes = searchResult.QuickQuoteInfo.filter(
        (info) =>
          info.InsuredName.toLowerCase().includes(query.toLowerCase()) ||
          info.QuoteNumber.toLowerCase().includes(query.toLowerCase()) ||
          info.InsuredAddress.toLowerCase().includes(query.toLowerCase())
      );
      if (filteredQuotes.length === 0) {
        filteredQuotes = searchResult.QuickQuoteInfo.slice(0, 5);
        error = "NoSearchResult";
      }
      setTotalPages(Math.ceil(filteredQuotes.length / pageSize));
      setCurrentPage(1);
      setLocalError(error);
    } else {
      error = "NoSearchResult";
      setTotalPages(0);
      setCurrentPage(1);
      setLocalError(error);
    }
    setQuotes(filteredQuotes);
  }, [query, searchResult]);

  return (
    <Screen
      title={messages.MainTitle}
      breadCrumb={[{ link: "/quote", label: "Home" }, { label: "My Quotes" }]}
      css={[utils.flex(1), utils.flexDirection("column")]}
      user={user}
      lastError={lastError}
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
                  (sortBy.direction === "asc" ? 1 : -1) *
                  (a[sortBy.column] > b[sortBy.column]
                    ? 1
                    : a[sortBy.column] < b[sortBy.column]
                    ? -1
                    : 0)
              )
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((quote, index) => (
                <QuoteRow
                  data-testid={`result-${index}`}
                  key={index}
                  onClick={() => {
                    formRedirect(`/quote/${quote["QuoteNumber"]}/customize`);
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
          <div
            css={[
              utils.display("flex"),
              utils.justifyContent("center"),
              utils.mt(5),
            ]}
          >
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
  );
};

export async function getServerSideProps({ req, res, query }) {
  const session = await getSession(req, res);

  if (session.user) {
    const queryString = (query.query as string) || "";

    try {
      const searchResult = await QuoteService.getQuoteList(
        session.user,
        queryString
      );

      return {
        props: {
          user: session.user,
          searchResult: searchResult || {},
          query: queryString,
          lastError: null,
        },
      };
    } catch (e) {
      if (e.httpRes.status !== 401) {
        return {
          props: {
            user: session.user,
            lastError: e.data,
          },
        };
      }
    }
  }
  return {
    redirect: {
      destination: "/quote",
    },
  };
}

export default QuoteListPage;

const columns = [
  {
    name: "Name",
    field: "InsuredName",
    hiddenOnMobile: false,
  },
  {
    name: "EffectiveDate",
    field: "EffectiveDate",
    hiddenOnMobile: false,
  },
  {
    name: "LastUpdateDate",
    field: "UpdateDt",
    hiddenOnMobile: false,
  },
  {
    name: "QuoteNumber",
    field: "QuoteNumber",
    hiddenOnMobile: false,
  },
  {
    name: "StreetAddress",
    field: "InsuredAddress",
    hiddenOnMobile: true,
  },
];
