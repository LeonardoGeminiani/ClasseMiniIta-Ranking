import { Injectable } from '@angular/core';
import { CrewCoef, DistanceCoef, Race } from '../models/race';
import { invoke } from '@tauri-apps/api/core';
import { BehaviorSubject } from 'rxjs';
import { emit, listen } from '@tauri-apps/api/event';
import { Window } from '@tauri-apps/api/window';

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
    // emit('raceList', { ciao: "ss"});
    invoke('syncMultipleWindows');
    //alert("emitted")

    this.get_only_races()
  }

  private async get_only_races(){
    let races = await invoke('get_races') as Array<any>;

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

  public async initializeApp(): Promise<void> {
    console.log('App Initialization Started');
    const unlisten = await listen('raceList', (event) => {
      const label = Window.getCurrent().label;
      if (label == event.payload) return;
      console.log("receivef")
      this.get_only_races();
      console.log(this.raceList)
    }) 
    console.log('App Initialization Finished');
  }

  constructor() {   
    this.get_races()
  }
}
