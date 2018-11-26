import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Platform, ViewController, Navbar} from 'ionic-angular';

import { OrderPage } from '../../pages/order/order'
import { OrderriwayatPage } from '../../pages/orderriwayat/orderriwayat'
/**
 * Generated class for the TabsorderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tabsorder',
  templateUrl: 'tabsorder.html',
})
export class TabsorderPage {

	@ViewChild(Navbar) navBar:Navbar;

	page1: any = OrderPage;
  page2: any = OrderriwayatPage;

  public unregisterBackButtonAction: any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams, 
  	public viewCtrl: ViewController,
  	public platform:Platform) {
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
