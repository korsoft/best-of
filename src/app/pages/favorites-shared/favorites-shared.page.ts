import { Component, OnInit } from '@angular/core';
import { Device } from '@capacitor/core';
import { FcmService } from '../../services/fcm.service';
import { BookmarkService } from '../../services/bookmark.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-favorites-shared',
  templateUrl: './favorites-shared.page.html',
  styleUrls: ['./favorites-shared.page.scss'],
})
export class FavoritesSharedPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private fcmService: FcmService, 
    private bookmarkService: BookmarkService,
    private router: Router) { }

  public favorites: any[];

  async ngOnInit() {
    const queryParam = this.activatedRoute.snapshot.paramMap.get('fromFirebaseUID');
   
    let currentUser = await this.fcmService.getCurrentUser();
    let device = await Device.getInfo();

    if(queryParam){
      const params = queryParam.split("::")
      console.log("fromFirebaseUID: " + params[0]);
  
      await this.createBookmarkShared(device, currentUser, params[0], params[1]);
    }

    if(currentUser == null || !currentUser.uid){
      this.router.navigateByUrl('/');
      return;
    }

    const globalListFavorites = await this.bookmarkService.getBookMarkSharedByDevice(device.uuid).toPromise<any[]>();

    if(globalListFavorites && globalListFavorites.length>0){
      const favoritesToUpdate = globalListFavorites.filter((f) => !f.FirebaseUID || f.FirebaseUID == "");
      favoritesToUpdate.forEach( async (f) => {
        await this.bookmarkService.updateBookmarkShared(f.qpId, currentUser.uid);
      });
    }


    this.favorites = await this.bookmarkService.getBookMarkSharedByFirebaseUI(currentUser.uid).toPromise<any[]>();

    console.log(this.favorites);

   
  }

  async createBookmarkShared(device, currentUser, fromFirebaseUID, fromEmail){
    let uid = currentUser?.uid || device?.uuid;
    const bookmarksShared1 = await this.bookmarkService.getBookMarkSharedByDeviceAndFromFirebaseUID(uid,fromFirebaseUID).toPromise<any[]>();
    console.log("bookmarks",bookmarksShared1);
      if(!bookmarksShared1 || bookmarksShared1.length == 0){
        const bookmarksShared2 = await this.bookmarkService.getBookMarkSharedByFirebaseUIDAndFromFirebaseUID(uid,fromFirebaseUID).toPromise<any[]>();
          console.log("bookmarks",bookmarksShared2);
          if(!bookmarksShared2 || bookmarksShared2.length == 0){
            await this.bookmarkService.createBookmarkShared(device?.uuid, currentUser?.uid,fromFirebaseUID,fromEmail).toPromise();
          }
      }
  }

  public async gotoFavorites(favorite:any){
    console.log(favorite);
    this.router.navigateByUrl(`/favorites/${favorite.FromFirebaseUID}::${favorite.FromEmail}`);
  }

}
