import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { event } from '@tauri-apps/api';

@Component({
  selector: 'app-edit-regata',
  standalone: true,
  imports: [],
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
}
