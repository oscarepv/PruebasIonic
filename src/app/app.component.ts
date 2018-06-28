import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              private oneSignal: OneSignal) {
    platform.ready().then(() => {

      this.oneSignal.startInit("3cf179ba-99bd-4b48-b215-9f92c8ce2f31","ZmMzMTA5NzItNjZhOS00ODBkLTk4N2EtMGNjOTA2Y2YzMjRm");

       this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

       this.oneSignal.setSubscription(true);

      this.oneSignal.getIds().then(ids =>{
        let id = ids;
        alert(id.userId);
        console.log(id.userId);
        console.log(id.pushToken);
      }).catch(()=>{
        //alert('error de id');
      });

      /*this.oneSignal.handleNotificationReceived().subscribe(

      );

      this.oneSignal.handleNotificationOpened().subscribe(()=>{

      })*/

      this.oneSignal.endInit();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

