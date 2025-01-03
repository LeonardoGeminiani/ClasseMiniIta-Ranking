use calamine::{open_workbook, Reader, Xlsx};
use tauri::AppHandle;

#[tauri::command]
pub fn XlsClassRead(path: &str) -> Result<(), String> {
    use calamine::{open_workbook, Reader, Xlsx};

    let mut excel: Xlsx<_> = open_workbook(path).expect("failed to find file");

    match excel.worksheet_range("Classifica"){
        Ok(r) => {
            for row in r.rows() {
                println!("row={:?}, row[0]={:?}", row, row[0]);
            }
        },
        Err(e) => {
            return Err(e.to_string());
        }
    }

    Ok(())
}
