import { Component } from '@angular/core';
import { RegataComponent } from '../regata/regata.component';
import { HeaderComponent } from '../header/header.component';
import { EditRegataComponent } from '../edit-regata/edit-regata.component';
import Database from '@tauri-apps/plugin-sql';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegataComponent, HeaderComponent, EditRegataComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  async ngOnInit() {
    // when using `"withGlobalTauri": true`, you may use
    // const Database = window.__TAURI__.sql;
    
    const db = await Database.load('sqlite:data.db');

    await db.select("SELECT * from races");
    //db.execute('INSETS into users (id, name) VALUES ($1, $2)', [1,'2'])
  }
}
