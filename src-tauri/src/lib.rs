#![allow(non_snake_case)]

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use dbInterfaces::{
    add_doubleProto, add_doubleSerie, add_race, add_skipper, add_soloProto, add_soloSerie,
    get_races, get_skippers,
};
use sqlx::{migrate::MigrateDatabase, sqlite::SqlitePoolOptions, Pool, Sqlite};
use std::convert::From;
use tauri::{
    window, App, AppHandle, Emitter, EventTarget, Manager as _, WebviewUrl, WebviewWindow,
    WebviewWindowBuilder, Window,
};

mod dbInterfaces;

type Db = Pool<Sqlite>;

struct AppState {
    db: Db,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            add_race,
            add_skipper,
            get_races,
            get_skippers,
            add_soloSerie,
            add_soloProto,
            add_soloSerie,
            add_doubleSerie,
            add_doubleProto,
            edit_regata_window,
            sync_webviews
        ])
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                let db = setup_db(&app).await;
                app.manage(AppState { db })
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn edit_regata_window(app: AppHandle) -> tauri::Result<()> {
    let len = app.webview_windows().len();

    WebviewWindowBuilder::new(
        &app,
        format!("window-{}", len),
        WebviewUrl::App("edit-regata.html".into()),
    )
    .title("Modifica Regata")
    .build()?;

    Ok(())
}

#[tauri::command]
fn sync_webviews(app: AppHandle, window: Window) {
    println!("{}", window.label());

    let _ = app.emit_filter("sync_webviews", "sync", |target| match target {
        EventTarget::WebviewWindow { label } => label != window.label(),
        _ => true,
    });
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
