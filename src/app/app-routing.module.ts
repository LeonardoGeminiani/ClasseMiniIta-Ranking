import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { EditRegataComponent } from './components/edit-regata/edit-regata.component';


export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'edit-regata', component: EditRegataComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }