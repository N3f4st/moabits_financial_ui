import { Component, OnDestroy, OnInit } from "@angular/core";

import { NzTableQueryParams } from "ng-zorro-antd/table";
import { ManagementService } from "../../services/management.service";
import { CustomerTransactionsResponseInterface } from "../../types/CustomerTransactionResponse.interface";
import { CustomerTransactionsRequestInterface } from "../../types/CustomerTransactionsRequest.interface";
import { getISOWeek } from "date-fns";
import { forkJoin, Observable, Subscription } from "rxjs";
import { customerIdSubject$ } from "../CustomerList/customerlist.component";
import { SubjectManager } from "../../observers/SubjectManager";

@Component({
  selector: "mm-transactions-table",
  template: `
    <P style="display: inline; font-weight: 600; margin: 10px; color: #656161;"
      >Pick a transactions range date:</P
    >
    <nz-range-picker
      [(ngModel)]="transactionsRangeDate"
      (ngModelChange)="changeDateRange()"
    ></nz-range-picker>
    <nz-table
      nzShowSizeChanger
      [nzData]="customerTransactions"
      [nzFrontPagination]="false"
      [nzLoading]="loading"
      [nzTotal]="total"
      [nzPageSize]="pageSize"
      [nzPageIndex]="pageIndex"
      (nzQueryParams)="onQueryParamsChange($event)"
    >
      <thead>
        <tr>
          <th nzColumnKey="accountNumber" [nzSortFn]="false">Account Number</th>
          <th nzColumnKey="date" [nzSortFn]="false">Trans. Date</th>
          <th nzColumnKey="transactionType" [nzSortFn]="false">Trans. Type</th>
          <th nzColumnKey="amount" [nzSortFn]="false">Amount</th>
          <th nzColumnKey="balance" [nzSortFn]="false">Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let transaction of customerTransactions">
          <td>{{ transaction.accountnumber }}</td>
          <td>{{ transaction.transactiondate | date: "MM/dd/yyyy" }}</td>
          <td>{{ transaction.transactiontype }}</td>
          <td>{{ transaction.amount }}</td>
          <td>{{ transaction.balance }}</td>
        </tr>
      </tbody>
    </nz-table>
  `,
})
export class TransactionsTableComponent implements OnInit, OnDestroy {
  total = 1;
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  transactionsRangeDate: Date[]; // Transactions Range Date;
  customerTransactions: CustomerTransactionsResponseInterface[] = [];
  transactionsSubscription: Subscription;
  customerIdSelected$: Subscription;
  retrieveCalled$: Subscription;
  customerId: number;

  constructor(private managmentService: ManagementService) {
    const today = new Date();
    const endDate = new Date();
    today.setDate(endDate.getDate() - 30);

    this.transactionsRangeDate = [today, endDate];
  }

  loadDataFromServer(pageIndex: number, pageSize: number): void {
    const customerTransactionsRequest: CustomerTransactionsRequestInterface = {
      customerId: this.customerId,
      fromDate: this.formatDate(this.transactionsRangeDate[0]),
      toDate: this.formatDate(this.transactionsRangeDate[1]),
      page: (pageIndex - 1) * pageSize,
      rowsQty: pageSize,
    };

    this.loading = true;
    this.transactionsSubscription = this.getTransactionData(
      customerTransactionsRequest
    ).subscribe((transactionData: any) => {
      // Transactions Table block
      this.loading = false;
      this.customerTransactions = transactionData[0];

      // pagination block
      this.total = transactionData[1]; // mock the total data here
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex } = params;
    this.loadDataFromServer(pageIndex, pageSize);
  }

  changeDateRange() {
    this.loadDataFromServer(this.pageIndex, this.pageSize);
  }

  getTransactionData(
    customerTransactionsRequest: CustomerTransactionsRequestInterface
  ): Observable<any[]> {
    const transactionsResp =
      this.managmentService.getTransactionsByCustomerAndDate(
        customerTransactionsRequest
      );
    const rowsQtyResp = this.managmentService.getRowsQtyByCustomerIdAndDates(
      customerTransactionsRequest
    );
    return forkJoin([transactionsResp, rowsQtyResp]);
  }

  ngOnInit(): void {
    this.customerIdSelected$ = customerIdSubject$
      .getSubject()
      .subscribe((customerId: number) => {
        this.customerId = customerId;
        this.loadDataFromServer(this.pageIndex, this.pageSize);
      });

    this.retrieveCalled$ = retrieveDataSubject$.getSubject().subscribe(() => {
      this.loadDataFromServer(this.pageIndex, this.pageSize);
    });
  }

  ngOnDestroy(): void {
    this.transactionsSubscription.unsubscribe();
    this.customerIdSelected$.unsubscribe();
    this.retrieveCalled$.unsubscribe();
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  formatDate(date: Date): Date {
    return new Date(
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join("-")
    );
  }
}
export const retrieveDataSubject$ = new SubjectManager<boolean>();
