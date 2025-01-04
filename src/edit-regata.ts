import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';

async function onSubmit() {
    const RaceName = document.getElementById("RaceName") as HTMLInputElement;
    const N = document.getElementById("N") as HTMLInputElement;
    const E = document.getElementById("E") as HTMLSelectElement;
    const D = document.getElementById("D") as HTMLSelectElement;

    const ifSerie = (document.getElementById("flexSwitchSerie") as HTMLInputElement).checked;
    const ifProto = (document.getElementById("flexSwitchProto") as HTMLInputElement).checked;

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

    // TODO: error handling with colors
    if (!ifSerie && !ifProto) return;

    if (ifSerie) {
        if(SerieFile === "") {
            document.getElementById("SerieFileError")?.setHTMLUnsafe("File required");
            return;
        }

        try {
            await invoke("XlsClassReadCeck", {
                path: SerieFile,
                e: e
            })
            document.getElementById("SerieFileError")?.setHTMLUnsafe("");
        } catch (e: any) {
            document.getElementById("SerieFileError")?.setHTMLUnsafe(e);
            return;
        }
    }

    if (ifProto) {
        if(ProtoFile === "") {
            document.getElementById("ProtoFileError")?.setHTMLUnsafe("File required");
            return;
        }

        try {
            await invoke("XlsClassReadCeck", {
                path: ProtoFile,
                e: e
            })
            document.getElementById("ProtoFileError")?.setHTMLUnsafe("");
        } catch (e: any) {
            document.getElementById("ProtoFileError")?.setHTMLUnsafe(e);
            return;
        }
    }

    let raceId: number = await invoke("add_race", {
        name,
        n,
        e,
        d
    });

    await invoke("sync_webviews");
}

async function SelectFile(): Promise<string> {
    const file = await open({
        multiple: false,
        directory: false,
    });

    if (file === null) return "";
    return file;
}

let SerieFile: string = "";
let ProtoFile: string = "";

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("SerieFileSelect")?.addEventListener("click", async () => {
        SerieFile = await SelectFile();
        document.getElementById("SerieFile")?.setHTMLUnsafe(SerieFile);
    });
    document.getElementById("ProtoFileSelect")?.addEventListener("click", async () => {
        ProtoFile = await SelectFile();
        document.getElementById("ProtoFile")?.setHTMLUnsafe(ProtoFile);
    });

    document.getElementById("add-regata-submit")?.addEventListener("click", onSubmit)
});