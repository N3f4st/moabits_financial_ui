import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { SubjectManager } from "../../observers/SubjectManager";
import { ManagementService } from "../../services/management.service";
import { CustomerResponseInterface } from "../../types/CustomerResponse.interface";
@Component({
  selector: "mm-customer-list",
  template: `
    <nz-list nzBordered nzItemLayout="horizontal" [nzLoading]="!customers$">
      <nz-list-item *ngFor="let customer of customers$ | async">
        <nz-list-item-meta-title>
          <a href="javascript:void(0);" (click)="selectCustomer(customer.id)">{{
            customer.fullName
          }}</a>
        </nz-list-item-meta-title>
        <nz-list-item-meta [nzDescription]="customer.shortName">
        </nz-list-item-meta>
        <span>credit limit: {{ customer.creditLimit | currency: "USD" }}</span>
      </nz-list-item>
      <nz-list-empty *ngIf="!customers$"></nz-list-empty>
    </nz-list>
  `,
  styleUrls: ["./customerlist.component.scss"],
})
export class CustomerListComponent implements OnInit {
  customers$: Observable<CustomerResponseInterface[]>;
  constructor(private managementService: ManagementService) {}

  ngOnInit(): void {
    this.customers$ = this.managementService.getCustomers();
  }

  selectCustomer(customerId: number): void {
    customerIdSubject$.setSubject(customerId);
  }
}
export const customerIdSubject$ = new SubjectManager<number>();
