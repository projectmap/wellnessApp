import Link from 'next/link';
import * as React from 'react';
import { Box } from '@mui/system';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { Modal, Typography } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import PaginationButton from './paginationButton';
import { PAY_NOW_OPTIONS } from '~/state/constants';
import PaymentMethodModal from './PaymentMethodModal';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { useGetUserInvoicesQuery, useListPlanQuery } from '@newstart-online/sdk';
import { BillingTableStyles } from '~/modules/_core/styles/BillingAndAccountingStyles';

export default function BillingTable() {
  const [showPaymentMethodChangeModal, setShowPaymentMethodChangeModal] = React.useState(false);
  const [invoiceIdToPay, setInvoiceIdToPay] = React.useState('');

  const [currentPage, setCurrentPage] = React.useState(1);
  const perPageInvoiceNumber = 6;

  const { data: getPrice } = useListPlanQuery(); // getprice id from backend
  const annualPriceIdForCEUCredits = getPrice?.data?.find((price) => price.metadata.isCEUPlan)?.id || '';

  const { data: invoiceData } = useGetUserInvoicesQuery({ page: currentPage, perPage: perPageInvoiceNumber });
  const invoices = invoiceData?.data;

  const { data: price } = useListPlanQuery();
  const handleInvoicePay = (id: string) => {
    setInvoiceIdToPay(id);
    setShowPaymentMethodChangeModal(true);
  };

  const [totalPage, setTotalPage] = React.useState(invoiceData?.totalPage || 0);
  React.useEffect(() => {
    invoiceData?.totalPage && setTotalPage(invoiceData?.totalPage);
  }, [invoiceData?.totalPage]);

  const _invoices = invoices?.filter((item) => {
    return Number(item.invoice.amount_paid) > 0 || Number(item.invoice.amount_due) > 0;
  });

  const invoiceCount = React.useMemo(() => {
    return currentPage === 1 ? 1 : perPageInvoiceNumber * (currentPage - 1) + 1;
  }, [currentPage]);

  enum invoiceStatus {
    active = 'paid',
    open = 'open',
    draft = 'draft',
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>SN #</TableCell>
            <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
              Membership
            </TableCell>
            <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
              Amount
            </TableCell>
            <TableCell align="left">Payment Status</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices?.map((row: any, idx) => {
            const date = new Date(row?.invoice?.created * 1000);

            const options = { day: 'numeric', month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions;
            const normalDate = date.toLocaleDateString('en-US', options);

            return (
              <TableRow
                key={row._id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  borderBottom: '1px solid #E7E7EB',
                }}
              >
                <TableCell component="th" scope="row" sx={{ color: 'secondary.s60' }}>
                  {idx + invoiceCount}
                </TableCell>
                <Link href={`/user/more/account/${row?.invoice?.id}`}>
                  <TableCell className="cursor-pointer" align="left" sx={{ color: 'secondary.secondary60' }}>
                    <>
                      {row?.invoice?.lines?.data?.length
                        ? row?.invoice?.description
                          ? row?.invoice?.description
                          : row?.invoice?.lines?.data[row?.invoice?.lines?.data?.length - 1]?.plan?.metadata?.title
                        : ''}
                    </>
                  </TableCell>
                </Link>
                <TableCell align="left" sx={{ color: 'secondary.secondary60' }}>
                  ${row?.invoice?.amount_due ? row?.invoice?.amount_due / 100 : row?.invoice?.amount_paid / 100} USD
                </TableCell>
                {row?.invoice?.status === invoiceStatus.active ? (
                  <TableCell align="left" sx={{ color: 'secondary.secondary60' }}>
                    <Typography sx={BillingTableStyles.paidStatusText}>Paid</Typography>
                  </TableCell>
                ) : row?.invoice?.status === invoiceStatus.open ? (
                  <TableCell align="left" sx={{ color: 'secondary.secondary60' }}>
                    <Typography sx={BillingTableStyles.dueStatusText}>Failed</Typography>
                  </TableCell>
                ) : (
                  <TableCell align="left" sx={{ color: 'secondary.secondary60' }}>
                    <Typography sx={BillingTableStyles.dueStatusText}>Due</Typography>
                  </TableCell>
                )}

                <TableCell align="left" sx={{ color: 'secondary.secondary60' }}>
                  {normalDate}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: 'primary.p120',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '& .link': { color: 'primary.p120' },
                    border: 'none',
                  }}
                >
                  {!row?.invoice?.paid ? (
                    <PrimaryButton
                      onClick={() => handleInvoicePay(row?.invoice?.id)}
                      sx={{ borderRadius: '42px', whiteSpace: 'nowrap', p: '10px 24px ' }}
                    >
                      Pay Now
                    </PrimaryButton>
                  ) : (
                    <a className="link" href={row?.invoice?.invoice_pdf}>
                      <Typography
                        sx={{ border: '1px solid #147AE9', borderRadius: '42px', padding: '8px 24px' }}
                        variant="subtitle2"
                      >
                        Download
                      </Typography>
                    </a>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <PaginationButton
        totalPage={_invoices?.length === 0 ? 0 : totalPage}
        currentPage={currentPage}
        totalData={invoiceData?.totalData}
        setCurrentPage={setCurrentPage}
        invoiceCount={invoiceCount}
        invoiceLength={invoices?.length}
      />

      <PaymentMethodModal
        payNowOptions={PAY_NOW_OPTIONS.INVOICE_PAYMENT}
        showPaymentMethodChangeModal={showPaymentMethodChangeModal}
        setShowPaymentMethodChangeModal={setShowPaymentMethodChangeModal}
        invoiceId={invoiceIdToPay}
        showGiftCertificateField={false}
      />
    </TableContainer>
  );
}
