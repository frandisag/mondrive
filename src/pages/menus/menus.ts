import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Nav, MenuController, App, ToastController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { UbahsandiPage } from '../ubahsandi/ubahsandi';

import { ConnectProvider } from '../../providers/connect/connect';

@Component({
  selector: 'page-menus',
  templateUrl: 'menus.html',
})
export class MenusPage {

	@ViewChild(Nav) nav: Nav;
	pages: any;
	rootPage: any ;

  constructor(
  	public navCtrl: NavController, 
  	public menu: MenuController,
  	public app: App,
    public connect : ConnectProvider,
  	public toastController: ToastController,
  	public navParams: NavParams) {
    this.inIt();
  }

  inIt(){
  	this.rootPage = HomePage;
    this.pages = [
      {title: "Halaman Utama",component: HomePage,icon:"home"},
      {title: "Ubah Kata Sandi",component: UbahsandiPage,icon:"lock"},
      {title: "Keluar Aplikasi",component: LoginPage,icon:"exit_to_app"}
    ];
  }
  
  openPage(page) {
    if (page.title == 'Keluar Aplikasi') {
      const data =  JSON.parse(localStorage.getItem('userData'));
      this.connect.postData(data.userData, 'logout').then((result) => {
        localStorage.removeItem('userData');
        this.app.getRootNav().setRoot(LoginPage);
      }, (err) => {
        this.presentToast("Connection Problem");
      });
    }else{
      this.menu.close();
      this.nav.setRoot(page.component);
    }
  }

  presentToast(msg) {
    let toast = this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

}
