import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeXsmbBycategory } from './home-xsmb-bycategory';

@NgModule({
  declarations: [
    HomeXsmbBycategory,
  ],
  imports: [
    IonicPageModule.forChild(HomeXsmbBycategory),
  ],
  exports: [
    HomeXsmbBycategory
  ]
})
export class HomeXsmbBycategoryModule {}
