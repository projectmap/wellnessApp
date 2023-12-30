import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';

import { DownArrow, DownloadArrowIcon } from '~/icons';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';
import { InvoiceStyles } from '~/modules/_core/styles/BillingAndAccountingStyles';
import {
  useGetUserAllPaymentCardQuery,
  useGetUserInvoiceDetailByIdQuery,
  useGetUserSubscriptionsQuery,
  useSetDefaultPaymentCardMutation,
} from '@newstart-online/sdk';
import { PAY_NOW_OPTIONS } from '~/state/constants';
import PaymentMethodModal from './PaymentMethodModal';
import AddCardModal from '~/modules/onboarding/modals/AddCardModal';

export default function InvoiceComponent() {
  const router = useRouter();
  const invoiceId: any = router?.query?.invoiceId;

  const { data: invoiceIdData } = useGetUserInvoiceDetailByIdQuery(invoiceId, { skip: !invoiceId });
  const { data } = useGetUserSubscriptionsQuery();
  const subscriptionData = data as any;
  const invoiceDetails: any = invoiceIdData?.data;
  const { data: paymentData, isFetching: isPaymentDataLoading } = useGetUserAllPaymentCardQuery();
  const [setAsDefault] = useSetDefaultPaymentCardMutation();

  const [showCardOptions, setShowCardOptions] = useState(false);
  const [cardJustChanged, setCardJustChanged] = useState(false);
  const [showPaymentMethodChangeModal, setShowPaymentMethodChangeModal] = useState(false);

  const defaultCard = paymentData?.data?.find((item: any) => item?.isDefault)?.card?.brand;
  const defaultCardLast4 = paymentData?.data?.find((item: any) => item?.isDefault)?.card?.last4;
  const defaultCardExpYear = paymentData?.data?.find((item: any) => item?.isDefault)?.card?.exp_year;

  const handleCardChange = (id: any) => {
    setAsDefault(id);
    setShowCardOptions(false);
    setCardJustChanged(true);
    setTimeout(() => setCardJustChanged(false), 3000);
  };

  const handleMakePayment = () => {
    setShowPaymentMethodChangeModal(true);
  };

  const discountAmount =
    invoiceDetails?.invoice?.total_discount_amounts.find(
      (item: any) => item.discount === invoiceDetails.invoice.discount.id,
    )?.amount ?? 0;

  return (
    <Container maxWidth="xl" sx={InvoiceStyles.invoicePageWrapper}>
      <Box sx={InvoiceStyles.invoiceWrapper}>
        <Box sx={InvoiceStyles.invoiceDetailsContainer}>
          <Box>
            <Typography variant="h5">Invoice #101</Typography>
            <Box sx={InvoiceStyles.invoiceReceiverNsender}>
              <Box sx={InvoiceStyles.invoiceRScontainer}>
                <Typography variant="h6" sx={InvoiceStyles.invoiceRSTtitle}>
                  Pay To:
                </Typography>
                <Typography variant="body1">
                  NEWSTART 20601 W Paoli Lane, Weimar, CA 95736 PO Box 486 VAT Number: 12345678901
                </Typography>
              </Box>
              <Box sx={InvoiceStyles.invoiceRScontainer}>
                <Typography variant="h6" sx={InvoiceStyles.invoiceRSTtitle}>
                  Invoiced To:
                </Typography>
                <Typography variant="body1">
                  {invoiceDetails?.invoice?.customer_name} {invoiceDetails?.invoice?.customer_email},{' '}
                  {invoiceDetails?.invoice?.customer_address}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h5" sx={InvoiceStyles.invoiceItemTitle}>
              Invoice items
            </Typography>
            <Box>
              <Box sx={InvoiceStyles.invoiceHeader}>
                <Typography variant="h6"> Description</Typography>
                <Typography variant="h6"> Amount</Typography>
              </Box>
              <Box sx={InvoiceStyles.invoiceSubHeader}>
                <Typography variant="body1">
                  {
                    //@ts-ignore
                    invoiceDetails?.invoice?.lines?.data?.length
                      ? //@ts-ignore
                        invoiceDetails?.invoice?.description
                        ? invoiceDetails?.invoice?.description
                        : invoiceDetails?.invoice?.lines?.data[0]?.plan?.metadata?.title
                      : ''
                  }
                </Typography>
                <Typography variant="body1">
                  ${invoiceDetails?.invoice?.total && invoiceDetails?.invoice?.total / 100}
                </Typography>
              </Box>
              <Box sx={InvoiceStyles.billingDetailsContainer}>
                <Box sx={InvoiceStyles.billingDetailsItem}>
                  <Typography variant="body1"> Sub Total</Typography>
                  <Typography variant="body1">
                    ${invoiceDetails?.invoice?.subtotal && invoiceDetails?.invoice?.subtotal / 100}
                  </Typography>
                </Box>
                <Box sx={InvoiceStyles.billingDetailsItem}>
                  <Typography variant="body1"> Discount</Typography>
                  <Typography variant="body1"> ${discountAmount / 100}</Typography>
                </Box>
                <Box sx={InvoiceStyles.billingDetailsItem}>
                  <Typography variant="body1"> Shipping</Typography>
                  <Typography variant="body1"> 0</Typography>
                </Box>
                <Box sx={InvoiceStyles.billingDetailsItem}>
                  <Typography variant="body1"> Tax</Typography>
                  <Typography variant="body1"> {invoiceDetails?.invoice?.tax ?? 0}</Typography>
                </Box>
                <Box sx={InvoiceStyles.billingDetailsItem}>
                  <Typography variant="h6"> Total</Typography>
                  <Typography variant="h6">
                    ${invoiceDetails?.invoice?.total && invoiceDetails?.invoice?.total / 100}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={InvoiceStyles.invoiceActionsContainer}>
          {invoiceDetails?.invoice?.status === 'unpaid' ? (
            <Box sx={InvoiceStyles.invoiceActionsTitleNbtn}>
              <Typography variant="h4">
                Total Due {invoiceDetails?.invoice?.amount_due} {invoiceDetails?.invoice?.currency}
              </Typography>
              <Box>
                <Typography variant="body1" sx={InvoiceStyles.paymentMethodTitle}>
                  Payment Method:
                </Typography>
                <Box sx={{ position: 'relative' }}>
                  <Box sx={InvoiceStyles.paymentMethodDefaultCard}>
                    {isPaymentDataLoading || cardJustChanged ? (
                      'Card info loading...'
                    ) : (
                      <Typography variant="body1">
                        {defaultCard}
                        {' ' + defaultCardLast4}
                        {' ' + defaultCardExpYear}
                      </Typography>
                    )}

                    <DownArrow onClick={() => setShowCardOptions(true)} className="cursor-pointer" />
                  </Box>
                  {showCardOptions && (
                    <Box sx={InvoiceStyles.paymentOptionsContainer}>
                      {paymentData?.data?.map((item, idx) => {
                        return (
                          <Box sx={InvoiceStyles.paymentOption} key={idx}>
                            <Typography
                              variant="body1"
                              className="cursor-pointer"
                              onClick={() => {
                                handleCardChange(item?.id);
                              }}
                            >
                              {item?.card?.brand}
                              {' ' + item?.card?.last4}
                              {' ' + item?.card?.exp_year}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Box>
              <PrimaryButton onClick={handleMakePayment} sx={InvoiceStyles.makePayBtn}>
                Make Payment
              </PrimaryButton>
            </Box>
          ) : null}

          <Typography variant="h4" className="marginTop24">
            Actions
          </Typography>
          <a href={invoiceDetails?.invoice?.invoice_pdf}>
            <Box sx={InvoiceStyles.actionDownloadContainer}>
              <DownloadArrowIcon />
              <Typography variant="body1" sx={InvoiceStyles.downloadTitle}>
                Downloads
              </Typography>
            </Box>
          </a>
        </Box>
      </Box>
      <Box sx={InvoiceStyles.footerContainer}>
        <CommunityFooterLinks />
      </Box>
      {showCardOptions && (
        <Box onClick={() => setShowCardOptions(false)} sx={InvoiceStyles.paymentMethodModalBackdrop} />
      )}
      <PaymentMethodModal
        payNowOptions={PAY_NOW_OPTIONS.INVOICE_PAYMENT}
        showPaymentMethodChangeModal={showPaymentMethodChangeModal}
        setShowPaymentMethodChangeModal={setShowPaymentMethodChangeModal}
        invoiceId={invoiceId}
      />
      <AddCardModal />
    </Container>
  );
}
