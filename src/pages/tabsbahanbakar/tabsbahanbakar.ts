import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Platform, ViewController, Navbar} from 'ionic-angular';

import { BahanbakarPage } from '../../pages/bahanbakar/bahanbakar';
import { BahanbakarriwayatPage } from '../../pages/bahanbakarriwayat/bahanbakarriwayat';

/**
 * Generated class for the TabsbahanbakarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tabsbahanbakar',
  templateUrl: 'tabsbahanbakar.html',
})
export class TabsbahanbakarPage {

	@ViewChild(Navbar) navBar:Navbar;

	page1: any = BahanbakarPage;
  page2: any = BahanbakarriwayatPage;

  public unregisterBackButtonAction: any;

  constructor(
  	public navCtrl: NavController, 
  	public viewCtrl: ViewController,
  	public platform:Platform,
  	public navParams: NavParams) {
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
