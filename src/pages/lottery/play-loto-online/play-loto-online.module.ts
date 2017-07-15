import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayLotoOnlinePage } from './play-loto-online';

@NgModule({
  declarations: [
    PlayLotoOnlinePage,
  ],
  imports: [
    IonicPageModule.forChild(PlayLotoOnlinePage),
  ],
  exports: [
    PlayLotoOnlinePage
  ]
})
export class PlayLotoOnlinePageModule {}
