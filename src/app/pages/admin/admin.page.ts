import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  // Merge
  proObj:any={imgPath:"",proName:"",proDescription:"",category:"",price:"",status:0,shopId:""}
  keys:any[]=[];
  obj:any = {};
  base64:any;
  shop:any;
  shopDisabled:boolean = false;
  btnText:string="Add";
  token:any = {};

  constructor(
    public navCtrl: NavController,
    public global: GlobalService,
    public authService: AuthService,
    private activatedRoute:ActivatedRoute,
    private api:ApiService,
    private change:ChangeDetectorRef,
    private alertCtrl:AlertController,
    
    ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params)=>{
      let data = params["data"];

      if(data)
  {
    this.proObj = JSON.parse(data);

    this.shop = this.proObj.shopId;

    this.shopDisabled = true;
    this.btnText = "Update";
    this.base64 = this.proObj.imgPath;
  }
  else{
    this.shopDisabled = false;
    this.shop = undefined;
  this.proObj={imgPath:"",proName:"",proDescription:"",category:"",price:"",status:0,shopId:""}
  this.btnText="Add";
  }

    // this.getShops();
    this.change.detectChanges();

})

  }
  
  logout() {
    this.global.showLoader();
    this.authService.logout().then(() => {
      this.navCtrl.navigateRoot('/login');
      this.global.hideLoader();
    })
    .catch(e => {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast('Logout Failed! Check your internet connection');
    });
  }

  // getShops()
  // {
  //   let ref = this;
  //   // this.api.getShops(function(res:any)
  //   this.api.getShopsById(function(res:any)
  //   {

  //     if(res)
  //     {
  //     ref.keys = Object.keys(res);
  //     ref.obj = res;
  //     if(ref.keys.length>0 && ref.shop == undefined)
  //     {
  //     ref.shop = ref.keys[0];
  //     }
  //     }
  //     else{
  //       ref.keys = [];
  //     ref.obj = {};
  //     }
  //   })
  // }

  // shop-page
  ionViewWillEnter()
  {
    this.api.getToken().then((token:any)=>
    {
      this.token= token;
    this.getShops();
    })
  }

  getShops()
  {
    let ref = this;
    this.api.getShops(function(res:any)
    {
      console.log(res);
    

      if(ref.token.type == "admin")
      {
      if(res)
      {
      ref.keys = Object.keys(res);
      ref.obj = res;
      
      }
      else{
        ref.keys = [];
      ref.obj = {};
      }
    }
    else{
      if(res)
      {
        let k = Object.keys(res);
        let obj:any = {};
       for(var i = 0;i<k.length;i++)
       {
         let objtemp = res[k[i]];
         let ktemp = Object.keys(objtemp);
        for(let j = 0;j<ktemp.length;j++)
        {
          objtemp[ktemp[j]]["adminemail"] = k[i]
          obj[ktemp[j]] = objtemp[ktemp[j]];
        }
       }
       console.log(obj);
      ref.keys = Object.keys(obj);
      ref.obj = obj;
      
      }
      else{
        ref.keys = [];
      ref.obj = {};
      }
       
    }
    })
    
  }
 
  goto(url:any,data ?:any,key?:any)
  {
    if(data)
    {
      if(key)
      {
        data["shopId"] = key;
       
      }
    }
  this.api.goto(url,data);
  }

removeShop(obj:any,key:any)
{
  
  this.alertCtrl.create({
    message:"Do you want to delete?",
    backdropDismiss:false,
    buttons:[{
      text:"OK",
      handler:()=>{
        let ref = this;
  obj["status"] = "0";
        this.api.manageShops(obj, key, function ()
        {
           ref.api.showToast("successfully deleted");
           ref.getShops();

        })
      }
    },{
      text:"Cancel"
    }]
  }).then((ele)=>{
    ele.present();
  })
}
}
