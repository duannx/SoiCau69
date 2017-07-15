import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotoVipPage } from './loto-vip';

@NgModule({
  declarations: [
    LotoVipPage,
  ],
  imports: [
    IonicPageModule.forChild(LotoVipPage),
  ],
  exports: [
    LotoVipPage
  ]
})
export class LotoVipPageModule { }
