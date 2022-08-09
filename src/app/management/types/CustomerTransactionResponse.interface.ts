export interface CustomerTransactionsResponseInterface {
  id: number;
  accountnumber: number;
  transactiondate: Date;
  transactiontype: string;
  amount: number;
  balance: number;
}
