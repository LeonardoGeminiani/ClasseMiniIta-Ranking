import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormsModule, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { event } from '@tauri-apps/api';
import { DbService } from '../../services/db.service';
import { NgFor, NgIf } from '@angular/common';
import { CrewCoef, DistanceCoef } from '../../models/race';

@Component({
  selector: 'app-edit-regata',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './edit-regata.component.html',
  styleUrl: './edit-regata.component.css'
})
export class EditRegataComponent {
  @ViewChild('collapseSerie')
  collapseSerie?: ElementRef;

  @ViewChild('collapseProto')
  collapseProto?: ElementRef;

  collapse(name: string) {
    let el: HTMLDivElement;
    switch (name) {
      case 'Serie':
        el = this.collapseSerie!.nativeElement;
        break;
      case 'Proto':
        el = this.collapseProto!.nativeElement;
        break;
      default:
        return;
    }

    if (el.classList.contains('show')) {
      el.classList.remove('show');
    }
    else {
      el.classList.add('show');
    }
  }

  constructor(public db: DbService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      N: ['', [this.numberValidator()]],
      name: ['', Validators.required]
    });
  }

  formData = {
    name: '',
    N: Number,
    E: CrewCoef,
    D: DistanceCoef
  }

  form: any;
  submitted: boolean = false;

  numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return { notANumber: true };
      }
      let isValidNumber = !isNaN(Number(value));
      if(isValidNumber && value <= 0) isValidNumber = false;
      return isValidNumber ? null : { notANumber: true };
    };
  }

  submitForm() {
    this.submitted = true;
    if (this.form?.valid) {

    } else {
      console.error("invalid form");
    }
  }
}
