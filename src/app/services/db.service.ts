import { Injectable } from '@angular/core';
import { CrewCoef, DistanceCoef, Race } from '../models/race';
import { invoke } from '@tauri-apps/api/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private raceList = new BehaviorSubject<Race[]>([]);
  raceList$ = this.raceList.asObservable();

  private setRaceList(val: Race[]): void {
    this.raceList.next(val);
  }

  private getRaceList(): Race[] {
    return this.raceList.getValue();
  }

  async get_races() {
    let races = await invoke('get_races') as Array<any>;

    this.setRaceList([]);

    let tmp: Race[] = [];
    races.forEach(el => {
      tmp.push({
        raceId: el.race_id,
        name: el.name,
        N: el.n,
        E: el.e,
        D: el.d
      })
    });

    this.setRaceList(tmp);
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
