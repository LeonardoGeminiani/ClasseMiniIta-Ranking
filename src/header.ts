import { invoke } from "@tauri-apps/api/core";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";


export function addRegata() {
    invoke('new_window')
    // const webview = new WebviewWindow('edit-race', {
    //     url: './edit-regata.html',
    //     title: "Aggiungi Regata"
    //   });
      
    //   webview.once('tauri://error', function (e) {
    //     // an error happened creating the webview
    //     console.error(e)
    //    });
}

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addRegata")?.addEventListener('click', addRegata)
});