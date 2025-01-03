import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';

async function onSubmit() {
    const RaceName = document.getElementById("RaceName") as HTMLInputElement;
    const N = document.getElementById("N") as HTMLInputElement;
    const E = document.getElementById("E") as HTMLSelectElement;
    const D = document.getElementById("D") as HTMLSelectElement;

    let name = RaceName.value.trim();
    let n = Number(N.value);

    let e = E.value;
    let d = D.value;

    let errAlerts = document.getElementsByClassName("errorAlert");

    let haserror = false;

    if (name === '') {
        errAlerts[0].classList.remove("d-none")
        haserror = true;
    } else errAlerts[0].classList.add("d-none")

    if (Number.isNaN(n) || n < 1) {
        errAlerts[1].classList.remove("d-none")
        haserror = true;
    } else errAlerts[1].classList.add("d-none")

    if (haserror) return;

    let raceId: number = await invoke("add_race", {
        name,
        n,
        e,
        d
    });

    await invoke("sync_webviews");
}

async function SelectFile() {
    const file = await open({
        multiple: false,
        directory: false,
    });

    await invoke("XlsClassRead", {
        path: file
    });

    return file;
}



window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("SerieFileSelect")?.addEventListener("click", async () => {
        let SerieFileError = "";
        try {
            await SelectFile()
        } catch (err: any) {
            SerieFileError = err;
        }
        document.getElementById("SerieFileError")?.setHTMLUnsafe(SerieFileError);
    });
    document.getElementById("ProtoFileSelect")?.addEventListener("click", async () => {
        let ProtoFileError = "";
        try {
            await SelectFile()
        } catch (err: any) {
            ProtoFileError = err;
        }
        document.getElementById("ProtoFileError")?.setHTMLUnsafe(ProtoFileError);
    });

    document.getElementById("add-regata-submit")?.addEventListener("click", onSubmit)
});