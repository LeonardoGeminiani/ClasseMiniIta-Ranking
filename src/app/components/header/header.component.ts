import { Component } from '@angular/core';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  newRegataClick()
  {
    const webview = new WebviewWindow('my-label', {
      url: 'edit-regata',
      title: "Aggiungi Regata"
    });
    
    webview.once('tauri://error', function (e) {
      // an error happened creating the webview
      console.error(e)
     });
  }
}
