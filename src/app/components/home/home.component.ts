import { Component } from '@angular/core';
import { RegataComponent } from '../regata/regata.component';
import { HeaderComponent } from '../header/header.component';
import { EditRegataComponent } from '../edit-regata/edit-regata.component';
import Database from '@tauri-apps/plugin-sql';
import { invoke } from '@tauri-apps/api/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegataComponent, HeaderComponent, EditRegataComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  async ngOnInit() {

    // return await invoke("add_race", {
    //   name: 'arci',
    //   n: 8,
    //   e: 'DOUBLE',
    //   d: 'B'
    // });

    let races = await invoke('get_races') as Array<any>;
    races.forEach(el => {
      console.log(el);
    });
  }
}
