import React from 'react';

import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import InvoiceComponent from '~/modules/_core/components/billingAndAccounting/InvoiceComponent';

const Invoice = () => {
  return (
    <LayoutArea>
      <InvoiceComponent />
    </LayoutArea>
  );
};

export default Invoice;
