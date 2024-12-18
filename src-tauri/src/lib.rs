// use tauri::{utils::config::WindowConfig, window, Manager, WebviewUrl};

use sqlx::{migrate::MigrateDatabase, sqlite::SqlitePoolOptions, Pool, Sqlite};
use tauri::{App, Manager as _};

type Db = Pool<Sqlite>;

struct AppState {
    db: Db,
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            add_race, add_skipper
        ])
        .setup(|app| {
            tauri::async_runtime::block_on(
                async move {
                    let db = setup_db(&app).await;
                    app.manage(AppState {db})
                });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


async fn setup_db(app: &App) -> Db {
    
    let mut path = app.path().app_data_dir().expect("failed to get data_dir");

    // UNCOMMENT TO PRINT DB PATH
    // let tmp = path.clone();
    // println!("{}", tmp.into_os_string().into_string().unwrap());
    
    match std::fs::create_dir_all(path.clone()) {
        Ok(_) => {}
        Err(err) => {
            panic!("error creating directory {}", err);
        }
    };

    path.push("db.sqlite");

    Sqlite::create_database(
        format!(
            "sqlite:{}",
            path.to_str().expect("path should be something")
        )
        .as_str(),
    )
    .await
    .expect("failed to create database");

    let db = SqlitePoolOptions::new()
        .connect(path.to_str().unwrap())
        .await
        .unwrap();

    let res = sqlx::migrate!("./migrations").run(&db).await;

    if let Err(res) = res {
        println!("{}", res);
    }

    db
}


#[tauri::command]
async fn add_race(state: tauri::State<'_, AppState>, name: &str, n: i32, e: i32, d: i32) -> Result<(), String> {
    let db = &state.db;

    sqlx::query("INSERT INTO races (name, N, E, D) VALUES (?1, ?2, ?3, ?4)")
        .bind(name)
        .bind(n).bind(e).bind(d)
        .execute(db)
        .await
        .map_err(|e| format!("Error saving todo: {}", e))?;
    Ok(())
}

#[tauri::command]
async fn add_skipper(state: tauri::State<'_, AppState>, name: &str, surname: &str) -> Result<(), String> {
    let db = &state.db;

    sqlx::query("INSERT INTO skippers (name, surname) VALUES (?1, ?2)")
        .bind(name)
        .bind(surname)
        .execute(db)
        .await
        .map_err(|e| format!("Error saving todo: {}", e))?;
    Ok(())
}