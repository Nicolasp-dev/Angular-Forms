import { HttpClient, HttpEventType } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from "@angular/forms";
import { of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";

@Component({
  selector: "file-upload",
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileUploadComponent,
    },
    { provide: NG_VALIDATORS, multi: true, useExisting: FileUploadComponent },
  ],
})
export class FileUploadComponent implements ControlValueAccessor, Validator {
  @Input() requiredFileType: string;

  fileName: string = "";
  fileUploadError = false;
  uploadProgress: number;
  onChange = (file: string) => {};
  onTouched = () => {};
  disabled = false;
  fileUploadSuccess = false;
  onValidatorChange = () => {};

  constructor(private http: HttpClient) {}

  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);

      this.fileUploadError = false;

      this.http
        .post(`/api/thumbnail-upload`, formData, {
          reportProgress: true,
          observe: "events",
        })
        .pipe(
          catchError((error) => {
            this.fileUploadError = true;
            return of(error);
          }),
          finalize(() => (this.uploadProgress = null))
        )
        .subscribe((event) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(
              100 * (event.loaded / event.total)
            );
          } else if (event.type == HttpEventType.Response) {
            this.onChange(this.fileName);
            this.fileUploadSuccess = true;
            this.onValidatorChange();
          }
        });
    }
  }

  onClick(fileUpload: HTMLInputElement) {
    this.onTouched();
    fileUpload.click();
  }

  // ValueAccessor Methods
  writeValue(value: any) {
    this.fileName = value;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Validator method
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if (this.fileUploadSuccess) return null;

    let errors: any = {
      requiredFileType: this.requiredFileType,
    };

    if (this.fileUploadError) {
      errors.uploadFailed = true;
    }

    return errors;
  }

  registerOnValidatorChange(onValidatorChange: () => void): void {
    this.onValidatorChange = onValidatorChange;
  }
}
