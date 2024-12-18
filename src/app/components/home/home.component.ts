import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { EditRegataComponent } from '../edit-regata/edit-regata.component';
import Database from '@tauri-apps/plugin-sql';
import { invoke } from '@tauri-apps/api/core';
import { DbService } from '../../services/db.service';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';
import { Race } from '../../models/race';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, EditRegataComponent, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  /**
   *
   */
  constructor(public db: DbService) {
  }

  public raceList: Race[] = [];
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this.subscription = this.db.raceList$.subscribe(value => {
      this.raceList = value;
      console.log("value updated!!");
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  // async ngOnInit() {

  //   let a = await invoke("add_race", {
  //     name: 'arci',
  //     n: 15,
  //     e: 'DOUBLE',
  //     d: 'C'
  //   });

  //   console.log(a);

  //   // let races = await invoke('get_races') as Array<any>;
  //   // races.forEach(el => {
  //   //   console.log(el);
  //   // });
  // }
}
