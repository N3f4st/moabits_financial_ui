export interface CustomerTransactionsRequestInterface {
  customerId: number;
  fromDate: Date;
  toDate: Date;
  page: number;
  rowsQty: number;
}
