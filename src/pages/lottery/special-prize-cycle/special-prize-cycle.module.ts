import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecialPrizeCyclePage } from './special-prize-cycle';

@NgModule({
  declarations: [
    SpecialPrizeCyclePage,
  ],
  imports: [
    IonicPageModule.forChild(SpecialPrizeCyclePage),
  ],
  exports: [
    SpecialPrizeCyclePage
  ]
})
export class SpecialPrizeCyclePageModule {}
