use futures::TryStreamExt;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::AppState;

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
pub enum CrewCoef {
    SOLO,
    DOUBLE,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
pub enum DistanceCoef {
    A,
    B,
    C,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Race {
    race_id: i32,
    name: String,
    n: i32,
    e: CrewCoef,
    d: DistanceCoef,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct RaceDTO {
    raceId: i32,
    name: String,
    N: i32,
    E: i8,
    D: i8,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Skipper {
    pub skipperId: i32,
    pub name: String,
    pub surname: String,
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
            _ => CrewCoef::DOUBLE,
        };

        Race {
            race_id: item.raceId,
            name: item.name,
            n: item.N,
            e,
            d,
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
            D: item.d as i8,
        }
    }
}

#[tauri::command]
pub async fn add_race(
    state: tauri::State<'_, AppState>,
    name: &str,
    n: i32,
    e: CrewCoef,
    d: DistanceCoef,
) -> Result<i32 /*race id*/, String> {
    let db = &state.db;

    let inserted: Vec<RaceDTO> = sqlx::query_as::<_, RaceDTO>(
        "INSERT INTO races (name, N, E, D) VALUES (?1, ?2, ?3, ?4) RETURNING *",
    )
    .bind(name)
    .bind(n)
    .bind(e as i8)
    .bind(d as i8)
    .fetch(db)
    .try_collect()
    .await
    .map_err(|e| format!("Error saving todo: {}", e))?;
    Ok(inserted[0].raceId)
}

#[tauri::command]
pub async fn get_races(state: tauri::State<'_, AppState>) -> Result<Vec<Race>, String> {
    let db = &state.db;

    let races: Vec<RaceDTO> = sqlx::query_as::<_, RaceDTO>("SELECT * FROM races")
        .fetch(db)
        .try_collect()
        .await
        .map_err(|e| format!("Failed to get races {}", e))?;

    Ok(races
        .into_iter()
        .map(|el| -> Race {
            return el.into();
        })
        .collect())
}

#[tauri::command]
pub async fn add_skipper(
    state: tauri::State<'_, AppState>,
    name: &str,
    surname: &str,
) -> Result<i32 /*skipper Id */, String> {
    let db = &state.db;

    let inserted: Vec<Skipper> = sqlx::query_as::<_, Skipper>(
        "INSERT INTO skippers (name, surname) VALUES (?1, ?2) RETURNING *",
    )
    .bind(name)
    .bind(surname)
    .fetch(db)
    .try_collect()
    .await
    .map_err(|e| format!("Error saving todo: {}", e))?;
    Ok(inserted[0].skipperId)
}

#[tauri::command]
pub async fn get_skippers(state: tauri::State<'_, AppState>) -> Result<Vec<Skipper>, String> {
    let db = &state.db;

    let races: Vec<Skipper> = sqlx::query_as::<_, Skipper>("SELECT * FROM skippers")
        .fetch(db)
        .try_collect()
        .await
        .map_err(|e| format!("Failed to get races {}", e))?;

    Ok(races)
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct SoloRacePosition {
    raceId: i32,
    skipperId: i32,
    position: i32,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct DoubleRacePosition {
    raceId: i32,
    skipperId: i32,
    CoSkipperId: i32,
    position: i32,
}

#[tauri::command]
pub async fn add_soloSerie(
    state: tauri::State<'_, AppState>,
    raceId: i32,
    skipperId: i32,
    position: i32,
) -> Result<(), String> {
    let db = &state.db;

    sqlx::query("INSERT INTO soloSerie (raceId, skipperId, position) VALUES (?1, ?2, ?3)")
        .bind(raceId)
        .bind(skipperId)
        .bind(position)
        .execute(db)
        .await
        .map_err(|e| format!("Error saving todo: {}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn add_soloProto(
    state: tauri::State<'_, AppState>,
    raceId: i32,
    skipperId: i32,
    position: i32,
) -> Result<(), String> {
    let db = &state.db;

    sqlx::query("INSERT INTO soloProto (raceId, skipperId, position) VALUES (?1, ?2, ?3)")
        .bind(raceId)
        .bind(skipperId)
        .bind(position)
        .execute(db)
        .await
        .map_err(|e| format!("Error saving todo: {}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn add_doubleSerie(
    state: tauri::State<'_, AppState>,
    raceId: i32,
    skipperId: i32,
    coSkipperId: i32,
    position: i32,
) -> Result<(), String> {
    let db = &state.db;

    sqlx::query("INSERT INTO DoubleSerie (raceId, skipperId, CoSkipperId, position) VALUES (?1, ?2, ?3, ?4)")
        .bind(raceId)
        .bind(skipperId)
        .bind(coSkipperId)
        .bind(position)
        .execute(db)
        .await
        .map_err(|e| format!("Error saving todo: {}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn add_doubleProto(
    state: tauri::State<'_, AppState>,
    raceId: i32,
    skipperId: i32,
    coSkipperId: i32,
    position: i32,
) -> Result<(), String> {
    let db = &state.db;

    sqlx::query("INSERT INTO DoubleProto (raceId, skipperId, CoSkipperId, position) VALUES (?1, ?2, ?3, ?4)")
        .bind(raceId)
        .bind(skipperId)
        .bind(coSkipperId)
        .bind(position)
        .execute(db)
        .await
        .map_err(|e| format!("Error saving todo: {}", e))?;
    Ok(())
}
