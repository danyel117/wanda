import { DocumentNode, useQuery, WatchQueryFetchPolicy } from '@apollo/client';
import { Ordering } from 'context/ordering';
import { useTableContext } from 'context/table';
import { useEffect, useState } from 'react';

interface ServerSidePaginationProps {
  countQuery: DocumentNode;
  dataQuery: DocumentNode;
  ordering: Ordering;
  where: any;
  nextFetchPolicy?: WatchQueryFetchPolicy;
}

const useServerSidePagination = ({
  countQuery,
  dataQuery,
  ordering,
  where,
  nextFetchPolicy = 'cache-first',
}: ServerSidePaginationProps) => {
  const { currentPage, setCurrentPage, controlledPageSize } = useTableContext();

  const [pageCount, setPageCount] = useState(0);

  const { data: count } = useQuery(countQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      where,
    },
  });

  const { data, loading, fetchMore } = useQuery(dataQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy,
    variables: {
      where,
      orderBy: {
        ...ordering,
      },
      take: controlledPageSize,
      skip: currentPage * controlledPageSize,
    },
  });

  useEffect(() => {
    if (data && controlledPageSize && count) {
      const cnt = Math.ceil(count[Object.keys(count)[0]] / controlledPageSize);
      if (cnt === 0) {
        setPageCount(1);
      } else {
        setPageCount(cnt);
      }
    }
  }, [data, controlledPageSize, count]);

  useEffect(() => {
    resetPagination();
  }, [where]);

  useEffect(() => {
    const fetch = async () => {
      fetchMore({
        variables: {
          where: { ...where },
          orderBy: {
            ...ordering,
          },
          take: controlledPageSize,
          skip: (currentPage + 1) * controlledPageSize,
        },
      });
    };
    if (data) {
      if (
        (currentPage + 1) * controlledPageSize <
        count[Object.keys(count)[0]]
      ) {
        fetch();
      }
    }
  }, [currentPage]);

  const resetPagination = () => {
    setCurrentPage(0);
  };

  return {
    data,
    count,
    loading,
    pageCount,
    resetPagination,
  };
};

export { useServerSidePagination };
