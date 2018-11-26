import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, ViewController, Navbar } from 'ionic-angular';
import { LemburPage } from '../lembur/lembur'
import { LemburriwayatPage } from '../lemburriwayat/lemburriwayat'

/**
 * Generated class for the TabslemburPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tabslembur',
  templateUrl: 'tabslembur.html',
})
export class TabslemburPage {

  @ViewChild(Navbar) navBar:Navbar;

  page1: any = LemburPage;
  page2: any = LemburriwayatPage;
  tabsIndex: number = 0;

  public unregisterBackButtonAction: any;

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
  	public platform:Platform,
    public navParams: NavParams) {
  }

  onTabSelect(ev: any) {
    this.tabsIndex = ev.index;
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
