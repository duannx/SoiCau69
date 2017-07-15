import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecialPrizeTablePage } from './special-prize-table';

@NgModule({
  declarations: [
    SpecialPrizeTablePage,
  ],
  imports: [
    IonicPageModule.forChild(SpecialPrizeTablePage),
  ],
  exports: [
    SpecialPrizeTablePage
  ]
})
export class SpecialPrizeTablePageModule {}
