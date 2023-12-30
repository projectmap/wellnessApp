import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { LeftArrowPagination, RightArrowPagination } from '~/icons';

interface IPaginationButton {
  totalPage: number;
  currentPage: number;
  totalData: number | undefined;
  setCurrentPage: (status: any) => void;
  invoiceCount: number;
  invoiceLength: number | undefined;
}

export default function PaginationButton({
  totalPage,
  currentPage,
  totalData,
  setCurrentPage,
  invoiceCount,
  invoiceLength,
}: IPaginationButton) {
  const [navigationArray, setNavigationArray] = useState([1, 2]);

  if (totalPage === 0) {
    return <></>;
  }

  const handleNextPrevPage = (nextPrevType: string) => {
    if (nextPrevType === 'next') {
      if (totalPage !== currentPage) {
        setCurrentPage((prevState: number) => prevState + 1);
        if (navigationArray[1] !== totalPage - 1) {
          setNavigationArray((prevState) => prevState.map((item) => item + 1));
        } else {
          setNavigationArray((prevState) => prevState);
        }
      }
    } else {
      if (currentPage !== 1) {
        setCurrentPage((prevState: number) => prevState - 1);
        if (currentPage <= totalPage - 2) {
          navigationArray[0] !== 1 && setNavigationArray((prevState) => prevState.map((item) => item - 1));
        } else if (currentPage === totalPage) {
          setNavigationArray([totalPage - 2, totalPage - 1]);
        } else {
          setNavigationArray((prevState) => prevState);
        }
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {invoiceLength && (
        <Typography variant="body1" sx={{ color: '#717186' }}>
          Showing {invoiceCount} to {invoiceLength + invoiceCount - 1} of {totalData} entries
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '16px' }}>
        {totalPage > 1 && (
          <Box sx={{ cursor: 'pointer' }} onClick={() => handleNextPrevPage('prev')}>
            <LeftArrowPagination />
          </Box>
        )}

        {totalPage > 2 &&
          navigationArray?.length &&
          navigationArray.map((item, idx) => {
            return (
              <>
                <Box
                  onClick={() => setCurrentPage(navigationArray[idx])}
                  sx={{
                    backgroundColor: `${currentPage === navigationArray[idx] ? '#0C72E0' : '#FFFF'}`,
                    width: '24px',
                    height: '24px',
                    borderRadius: '2px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <Typography
                    variant="button"
                    sx={{ color: `${currentPage === navigationArray[idx] ? '#FFFF' : '#131336'}` }}
                  >
                    {navigationArray[idx]}
                  </Typography>
                </Box>
              </>
            );
          })}
        {totalPage > 3 && navigationArray[1] !== totalPage - 1 && (
          <Typography variant="button" sx={{ color: '#131336' }}>
            ...
          </Typography>
        )}

        {totalPage > 2 && (
          <Box
            onClick={() => setCurrentPage(totalPage)}
            sx={{
              backgroundColor: `${currentPage === totalPage ? '#0C72E0' : '#FFFF'}`,
              width: '24px',
              height: '24px',
              borderRadius: '2px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '4px',
              cursor: 'pointer',
            }}
          >
            <Typography variant="button" sx={{ color: `${currentPage === totalPage ? '#FFFF' : '#131336'}` }}>
              {totalPage}
            </Typography>
          </Box>
        )}
        {totalPage > 1 && (
          <Box sx={{ cursor: 'pointer' }} onClick={() => handleNextPrevPage('next')}>
            <RightArrowPagination />
          </Box>
        )}
      </Box>
    </Box>
  );
}
