import { Component } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { Window } from "@tauri-apps/api/window"
import { Webview } from "@tauri-apps/api/webview"
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { RegataComponent } from '../regata/regata.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegataComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  clickFunc() {
    const webview = new WebviewWindow('my-label', {
      url: '#'
    });
    
    webview.once('tauri://error', function (e) {
      // an error happened creating the webview
      console.error(e)
     });
    //invoke("create_window");
  }
}
