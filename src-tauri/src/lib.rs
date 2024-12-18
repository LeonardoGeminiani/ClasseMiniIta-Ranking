#![allow(non_snake_case)]

// use tauri::{utils::config::WindowConfig, window, Manager, WebviewUrl};

use futures::TryStreamExt;
use serde::{Deserialize, Serialize};
use sqlx::{migrate::MigrateDatabase, prelude::FromRow, sqlite::SqlitePoolOptions, Pool, Sqlite};
use tauri::{App, Manager as _};
use std::convert::From;

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
            add_race, add_skipper, get_races
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

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
enum CrewCoef {
    SOLO,
    DOUBLE
}


#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
enum DistanceCoef {
    A,
    B,
    C
}


#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Race {
    race_id: i32,
    name: String,
    n: i32,
    e: CrewCoef,
    d: DistanceCoef
}

impl From<RaceDTO> for Race {
    fn from(item: RaceDTO) -> Self {

        let d = match item.D {
            0 => DistanceCoef::A,
            1 => DistanceCoef::B,
            _ => DistanceCoef::C,
        };

        let e = match item.E {
            0 => CrewCoef::SOLO,
            _ => CrewCoef::DOUBLE
        };

        Race {
            race_id: item.raceId,
            name: item.name,
            n: item.N,
            e,
            d
        }
    }
}

impl From<Race> for RaceDTO {
    fn from(item: Race) -> Self {
        
        RaceDTO {
            raceId: item.race_id,
            name: item.name,
            N: item.n,
            E: item.e as i8,
            D: item.d as i8
        }
    }
}



#[derive(Debug, Serialize, Deserialize, FromRow)]
struct RaceDTO {
    raceId: i32,
    name: String,
    N: i32,
    E: i8,
    D: i8
}

#[tauri::command]
async fn add_race(state: tauri::State<'_, AppState>, name: &str, n: i32, e: CrewCoef, d: DistanceCoef) -> Result<(), String> {
    let db = &state.db;

    sqlx::query("INSERT INTO races (name, N, E, D) VALUES (?1, ?2, ?3, ?4)")
        .bind(name)
        .bind(n).bind(e as i8).bind(d as i8)
        .execute(db)
        .await
        .map_err(|e| format!("Error saving todo: {}", e))?;
    Ok(())
}


#[tauri::command]
async fn get_races(state: tauri::State<'_, AppState>) -> Result<Vec<Race>, String> {
    let db = &state.db;

    let races: Vec<RaceDTO> = sqlx::query_as::<_, RaceDTO>("SELECT * FROM races")
        .fetch(db)
        .try_collect()
        .await
        .map_err(|e| format!("Failed to get races {}", e))?;

    Ok(races.into_iter().map(|el| -> Race { 
        return el.into();
    }).collect())
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