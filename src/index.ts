import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

async function get_races() {
  let tmp: string = "";

  let races = await invoke('get_races') as Array<any>;

  races.reverse().forEach(el => {
    tmp += `
      <div class="card regata mb-4">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <h3> ${el.name} </h3>
              <button type="button" class="btn btn-primary edit">Modifica</button>
            </div>
          </div>
          <div class="d-flex justify-content-center m-3">
            <div class="px-3">
              <b>N:</b> ${el.n}
            </div>
            <div class="px-3">
              <b>E:</b> ${el.e}
            </div>
            <div class="px-3">
              <b>D:</b> ${el.d}
            </div>
          </div>
        </div> 
      ` });

  document.getElementById("regataContainer")?.setHTMLUnsafe(tmp);
}

window.addEventListener("DOMContentLoaded", async () => {
  get_races();

  const unlisten = await listen('sync_webviews', (event) => {
    console.log("sync received");

    get_races();
  });

});
