import { useTable, usePagination } from 'react-table';
import { useEffect, useState } from 'react';
import { useTableContext } from 'context/table';

interface TableProps {
  columns: any;
  data: any;
  capitalize?: boolean;
  pageSize?: number;
  manualPagination?: boolean;
  controlledPageCount?: number;
  loading?: boolean;
}

export interface TableData {
  [key: string]: string | number | boolean | JSX.Element;
}

const Table = ({
  columns,
  data,
  capitalize = true,
  manualPagination = false,
  controlledPageCount = 0,
  loading = false,
}: TableProps) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      autoResetPage: false,
      manualPagination,
      ...(controlledPageCount ? { pageCount: controlledPageCount } : {}),
    },
    usePagination
  );

  const {
    currentPage,
    setCurrentPage,
    controlledPageSize,
    setControlledPageSize,
  } = useTableContext();

  const [pageNumberInput, setPageNumberInput] = useState<string>('');

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setPageSize(controlledPageSize);
  }, [controlledPageSize]);

  useEffect(() => {
    gotoPage(currentPage);
  }, [currentPage]);

  return (
    <div className='flex w-full flex-col'>
      <div className='self-end'>
        <label htmlFor='elements-per-page'>
          Rows per page:
          <select
            className='mx-2 bg-transparent outline-none'
            name='elements-per-page'
            value={controlledPageSize?.toString() ?? 10}
            onChange={(e) => {
              setControlledPageSize(parseInt(e.target.value, 10));
              setCurrentPage(0);
            }}
          >
            <option>10</option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
            <option>300</option>
          </select>
        </label>
      </div>
      <table
        className='text-bio-gray w-full  overflow-x-auto'
        {...getTableProps()}
      >
        <thead className='border-bio-green border-b-2'>
          {headerGroups.map((headerGroup) => (
            <tr
              className='font-montserrat'
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  className='min-w-[6rem] px-1 pb-2 text-center'
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          className={`${loading && 'hover:cursor-wait'}`}
          {...getTableBodyProps()}
        >
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr className='text-center' {...row.getRowProps()}>
                {row.cells.map((cell: any, idx: number) => (
                  <td
                    className={`px-2 py-3 ${
                      idx === 0 &&
                      `font-bold ${
                        capitalize ? 'capitalize' : ''
                      } text-bio-darkBlue  `
                    }`}
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        className={` ${
          pageOptions.length === 1 ? 'hidden' : 'flex'
        } my-10 w-full items-end justify-center space-x-2`}
      >
        <button
          type='button'
          onClick={() => changePage(0)}
          disabled={!canPreviousPage || loading}
        >
          <i className='fas fa-angle-double-left' />
        </button>
        <button
          type='button'
          onClick={() => changePage(currentPage - 1)}
          disabled={!canPreviousPage || loading}
        >
          <i className='fas fa-angle-left' />
        </button>
        <span className='px-4'>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <button
          type='button'
          onClick={() => changePage(currentPage + 1)}
          disabled={!canNextPage || loading}
        >
          <i className='fas fa-angle-right' />
        </button>
        <button
          type='button'
          onClick={() => changePage(pageCount - 1)}
          disabled={!canNextPage || loading}
        >
          <i className='fas fa-angle-double-right' />
        </button>
        <div className='flex items-start'>
          <input
            name='gotopage'
            placeholder='10'
            type='number'
            min={1}
            max={pageCount}
            disabled={loading}
            value={pageNumberInput}
            onChange={(e) => setPageNumberInput(e.target.value)}
          />
          {/* <button
              type='button'
              className=''
              onClick={() => changePage(parseInt(pageNumberInput, 10) - 1)}
              disabled={pageNumberInput === ''}
            >
              <i
                className='fas fa-arrow-right absolute right-2 top-2/3  rounded-md text-bio-gray'
                style={{ transform: 'translateY(-50%)' }}
              />
            </button>
          </input> */}
        </div>
      </div>
    </div>
  );
};

export default Table;
