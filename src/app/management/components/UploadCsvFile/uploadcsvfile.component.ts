import { Component } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";

import { NzUploadFile } from "ng-zorro-antd/upload";
import { ManagementService } from "../../services/management.service";
import { customerIdSubject$ } from "../CustomerList/customerlist.component";
import { retrieveDataSubject$ } from "../TransactionsTable/transactionsTable.component";

@Component({
  selector: "mm-uploadcsvfile",
  template: `
    <nz-upload
      style="display: inline-block; margin-top: 10px"
      [(nzFileList)]="fileList"
      [nzBeforeUpload]="beforeUpload"
    >
      <button nz-button>
        <i nz-icon nzType="upload"></i>
        Select an CSV file from you desktop.
      </button>
    </nz-upload>
    <button
      nz-button
      [nzType]="'primary'"
      [nzLoading]="uploading"
      (click)="handleUpload()"
      [disabled]="!fileList"
      style="margin-top: 16px"
    >
      {{ uploading ? "Uploading" : "Start Upload" }}
    </button>
  `,
})
export class UploadCSVFileComponent {
  uploading = false;
  fileList: NzUploadFile[] | null = null;

  constructor(
    private managementService: ManagementService,
    private notify: NzNotificationService
  ) {}

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
    return false;
  };

  handleUpload(): void {
    const file: any = this.fileList[0];
    if (file) {
      this.uploading = true;
      const formData = new FormData();
      formData.append("file", file);
      this.managementService.persistBatchFile(formData).subscribe((info) => {
        console.log(info);
        if (info === "FAILED") {
          this.notification(
            "error",
            "Error",
            "There was an error uploading the information."
          );
        } else {
          this.notification(
            "success",
            "Successfull uploaded data",
            "The csv file information was imported flawlessly."
          );
          retrieveDataSubject$.setSubject(true);
        }
        this.uploading = false;
        this.fileList = null;
      });
    }
  }
  notification(type: string, title: string, body: string) {
    this.notify.create(type, title, body, { nzDuration: 6000 });
  }
}
