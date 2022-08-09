import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import { CustomerResponseInterface } from "../types/CustomerResponse.interface";
import { CustomerTransactionsResponseInterface } from "../types/CustomerTransactionResponse.interface";
import { CustomerTransactionsRequestInterface } from "../types/CustomerTransactionsRequest.interface";

@Injectable()
export class ManagementService {
  apiUrl: String = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<CustomerResponseInterface[]> {
    const customersUrl = `${this.apiUrl}/customer/`;
    return this.http.get<CustomerResponseInterface[]>(customersUrl);
  }

  persistBatchFile(csvFile: any): Observable<any> {
    const persistBatchFileUrl = `${this.apiUrl}/customerTransaction/persist-batch-file`;
    return this.http.post<any>(persistBatchFileUrl, csvFile);
  }

  getTransactionsByCustomerAndDate(
    customerTransactionsRequestInterface: CustomerTransactionsRequestInterface
  ): Observable<CustomerTransactionsResponseInterface[]> {
    const customerTransactionsPath = `${this.apiUrl}/customerTransaction/transactionsByCustomerAndDate`;
    return this.http.post<CustomerTransactionsResponseInterface[]>(
      customerTransactionsPath,
      customerTransactionsRequestInterface
    );
  }

  getRowsQtyByCustomerIdAndDates(
    customerTransactionsRequestInterface: CustomerTransactionsRequestInterface
  ): Observable<number> {
    const customerTransactionsPath = `${this.apiUrl}/customerTransaction/rowsQtyByCustomerIdAndDates`;
    return this.http.post<number>(
      customerTransactionsPath,
      customerTransactionsRequestInterface
    );
  }

  formatDataForm(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value || value === false) formData.append(key, String(value));
    });
    return formData;
  }
}
