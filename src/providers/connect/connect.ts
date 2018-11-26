import { LoadingController } from 'ionic-angular/index';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

let apiUrl = "http://api.mondr1ve.com/mondrive/";
//let apiUrl = "http://localhost/mondrive/";
//let apiUrl = "http://10.0.2.2:8100/mondrive/";

@Injectable()
export class ConnectProvider {

  constructor(
    public http: Http,
    private loadingCtrl: LoadingController,
  ) {
  }

  postData(credentials, type){
  	return new Promise((resolve, reject) =>{
  		let headers = new Headers();
      // Create the popup
      if (type!='getListBahanBakar'
        && type!= 'getListRiwayatOrder'
        && type!= 'getListRiwayatLembur'
        && type!= 'saveToken' 
        && type!= 'updateOrder'
        && type!= 'updateLembur'
        && type!= 'login'
        && type!= 'getListOrder'
        && type!= 'getListLembur'
        && type!= 'getListOrderDev'
        && type!= 'getListKehadiran'
        && type!= 'createOrder'
        && type!= 'createLembur'
        && type!= 'completedOrder'
        && type!= 'getListUser') {
        let loadingPopup = this.loadingCtrl.create({
          content: 'Loading data...'
        });

        // Show the popup
        loadingPopup.present();
        this.http.post(apiUrl+type, JSON.stringify(credentials), {headers: headers}).subscribe(res =>{
          setTimeout(() => {
            resolve(res.json());
            loadingPopup.dismiss();
          }, 100);
        }, (err) =>{
          setTimeout(() => {
            reject(err);
            loadingPopup.dismiss();
          }, 100);
        });   
      }else{
        this.http.post(apiUrl+type, JSON.stringify(credentials), {headers: headers}).subscribe(res =>{
          resolve(res.json());
        }, (err) =>{
          reject(err);
        });
      }  	
  	});
  }

}
