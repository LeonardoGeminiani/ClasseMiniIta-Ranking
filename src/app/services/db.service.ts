import { Injectable } from '@angular/core';
import { CrewCoef, DistanceCoef, Race } from '../models/race';
import { invoke } from '@tauri-apps/api/core';


@Injectable({
  providedIn: 'root'
})
export class DbService {
  raceList: Race[] = [];

  async get_races() {
    let races = await invoke('get_races') as Array<any>;

    this.raceList = [];
    races.forEach(el => {
      this.raceList.push({
        raceId: el.race_id,
        name: el.name,
        N: el.n,
        E: el.e,
        D: el.d
      })
    });
  }

  async add_race(name: string, n: number, e: CrewCoef, d: DistanceCoef) {
    let a = await invoke("add_race", {
      name,
      n,
      e,
      d
    });

    this.get_races();
  }

  constructor() {
    this.get_races()

  }
}
