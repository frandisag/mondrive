import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Platform, ViewController, Navbar, Events} from 'ionic-angular';

import { KehadiranPage } from '../../pages/kehadiran/kehadiran'
import { KehadiranriwayatPage } from '../../pages/kehadiranriwayat/kehadiranriwayat'

/**
 * Generated class for the TabskehadiranPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tabskehadiran',
  templateUrl: 'tabskehadiran.html',
})
export class TabskehadiranPage {

	@ViewChild(Navbar) navBar:Navbar;

	page1: any = KehadiranPage;
  page2: any = KehadiranriwayatPage;
  tabsIndex: number = 0;

  public unregisterBackButtonAction: any;

  constructor(
  	public navCtrl: NavController, 
  	public viewCtrl: ViewController,
    public events: Events,
  	public platform:Platform,
  	public navParams: NavParams) {
  }

  onTabSelect(ev: any) {
    this.tabsIndex = ev.index;
  }

  getMyLocation(){
    this.events.publish('getMylocation', this.tabsIndex);
  }

  ionViewDidLoad(){
    this.navBar.backButtonClick = (e:UIEvent) => {
      this.viewCtrl.dismiss({},"",{
        animate: true,
        animation: 'ios-transition'
      });
    };
  }

  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
        this.customHandleBackButton();
    }, 10);
  }

  private customHandleBackButton(): void {
    this.viewCtrl.dismiss({},"",{
    	animate: true,
    	animation: 'ios-transition'
    });
  }
}
