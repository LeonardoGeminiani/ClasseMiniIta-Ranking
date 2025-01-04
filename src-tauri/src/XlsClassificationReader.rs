use std::{array, fmt::format, vec};

use calamine::{open_workbook, DataType, Reader, Xlsx};
use tauri::AppHandle;

use crate::{dbInterfaces::{get_skippers, CrewCoef}, AppState};

#[tauri::command]
pub async fn XlsClassReadCeck(state: tauri::State<'_, AppState>, path: &str, e: CrewCoef) -> Result<(), String> {
    use calamine::{open_workbook, Reader, Xlsx};

    let mut excel: Xlsx<_> = open_workbook(path).expect("failed to find file");

    match excel.worksheet_range("Classifica") {
        Ok(r) => {
            let mut FoundSkipperList: Vec<i32> = Vec::new();

            for row in r.rows().skip(1) {
                let Some(skipperId) = row[0].clone().as_i64() else {
                    return Err("un elemento ha un Id non valido".to_owned());
                };

                let Some(result) = row[1].clone().as_i64() else {
                    return Err(format!("lo skipper {} ha un risultato non valido", skipperId));
                };

                if result < 1 {
                    return  Err(format!("lo skipper {} ha un risultato minore di 1", skipperId));
                }

                let skippers = get_skippers(state.clone()).await?;

                let mut found = false;
                for skipper in skippers {
                    if skipper.skipperId == skipperId as i32 {
                        found = true;
                        
                        if FoundSkipperList.contains(&skipper.skipperId) {
                            return Err("uno skipper partecipa più volte alla regata".to_owned());
                        }

                        FoundSkipperList.push(skipper.skipperId);
                        break;
                    }
                }

                if !found {
                    return Err(format!("skipper: {} non trovato nella lista degli skippers", skipperId));
                }
            }
        }
        Err(e) => {
            return Err(e.to_string());
        }
    }

    Ok(())
}
