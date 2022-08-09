import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { CustomerListComponent } from "./components/CustomerList/customerlist.component";
import { UploadCSVFileComponent } from "./components/UploadCsvFile/uploadcsvfile.component";
import { ManagementComponent } from "./management.component";

import { ManagementService } from "./services/management.service";
import { ManagementInterceptor } from "./interceptors/management.interceptor";
import { TransactionsTableComponent } from "./components/TransactionsTable/transactionsTable.component";

import { NzUploadModule } from "ng-zorro-antd/upload";
import { NzListModule } from "ng-zorro-antd/list";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzNotificationServiceModule } from "ng-zorro-antd/notification";
import { StatusInterceptor } from "./interceptors/status.interceptor";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";

const routes: Routes = [{ path: "", component: ManagementComponent }];
@NgModule({
  declarations: [
    ManagementComponent,
    CustomerListComponent,
    UploadCSVFileComponent,
    TransactionsTableComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NzListModule,
    NzUploadModule,
    NzButtonModule,
    NzNotificationServiceModule,
    NzTableModule,
    NzDatePickerModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ManagementService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ManagementInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: StatusInterceptor,
      multi: true,
    },
  ],
})
export default class ManagementModule {}
