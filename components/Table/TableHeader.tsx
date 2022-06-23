import { useOrdering } from 'context/ordering';
import React from 'react';

interface TableHeaderProps {
  title: string;
  field?: string;
  connect?: string;
  disableOrdering?: boolean;
}

const TableHeader = ({
  title,
  field = '',
  connect,
  disableOrdering = false,
}: TableHeaderProps) => {
  const { ordering, setOrdering } = useOrdering();

  return (
    <div className='flex gap-1 justify-center items-center'>
      {disableOrdering ? (
        <div>{title}</div>
      ) : (
        <>
          <div
            onKeyDown={() => {}}
            role='button'
            tabIndex={0}
            onClick={() => {
              setOrdering({
                field,
                asc: field === ordering.field ? !ordering.asc : false,
                ...(connect ? { connect } : {}),
              });
            }}
          >
            <span className='cursor-pointer'>{title}</span>
          </div>
          <div
            onKeyDown={() => {}}
            role='button'
            tabIndex={0}
            onClick={() =>
              setOrdering({
                ...ordering,
                ...(connect ? { connect } : {}),
                asc: !ordering.asc,
              })
            }
          >
            {field === ordering.field && connect === ordering.connect && (
              <i
                className={`fas fa-arrow-${
                  ordering.asc ? 'up' : 'down'
                } hover:text-bio-darkGreen cursor-pointer`}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TableHeader;
