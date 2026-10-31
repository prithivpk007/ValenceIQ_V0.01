const pad = (n) => String(Math.floor(1000 + Math.random() * 9000));

export const generateSubscriptionNumber = () =>
  `SUB-BL-${new Date().getFullYear()}-${pad()}`;

export const generateInvoiceNumber = () =>
  `INV-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`;

export const generatePaymentNumber = () =>
  `PAY-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`;

export const generateQuotationNumber = () =>
  `QUO-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`;
