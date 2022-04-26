import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MyHammerConfig } from './hammer-config'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeModule } from './home/home.module';
import { MapViewModule } from './map-view/map-view.module';
import { BusinessDetailModule } from './business-detail/business-detail.module';
import { LocationSearchModule } from './location-search/location-search.module'
import { IonicStorageModule } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Device } from '@ionic-native/device/ngx';
import { HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { HTTP } from '@ionic-native/http/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';





@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCnT_vhNISZ6G1a-9rYM1ha_J8TJ6KSnyY'}),
    IonicStorageModule.forRoot({
      name: '__bestof',
     driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AppRoutingModule,
    HttpClientModule,
    HomeModule,
    MapViewModule,
    BusinessDetailModule,
    LocationSearchModule,
    HammerModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    GoogleMapsAPIWrapper,
    CallNumber,
    SocialSharing,
    EmailComposer,
    InAppBrowser,
    Device,
    HTTP,
    Clipboard,
    Deeplinks,
    LaunchNavigator,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
