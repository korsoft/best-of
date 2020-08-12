
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'upload' | 'download';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private nativeHttp: HTTP,
    private platform: Platform,
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': 'pIqZvpXE50vizxFoHosy2gbJgcB2IDKuQY8hgoaF',
      },
    });
    if (!this.platform.is('cordova')) { return next.handle(request); }

    return from(this.handleNativeRequest(request));
  }

  private async handleNativeRequest(request: HttpRequest<any>): Promise<HttpResponse<any>> {
    const headerKeys = request.headers.keys();
    const header = {};
    
    headerKeys.forEach((key) => {
      header[key] = request.headers.get(key);
    });

    try {
      await this.platform.ready();

      const method = <HttpMethod> request.method.toLowerCase();
      let params={};
      if(request.params.has("filters")){
         params["filters"]=request.params.get("filters");
      }
      //alert(request.url+" "+JSON.stringify(params));
      const nativeHttpResponse = await this.nativeHttp.sendRequest(request.url, {
        method: method,
        data: request.body,
        params: params,
        headers: header,
        serializer: 'json',
      });

      let body;

      try {
        // alert(nativeHttpResponse.data);
        body = JSON.parse(nativeHttpResponse.data);
      } catch (error) {
        body = { response: nativeHttpResponse.data };
      }

      const response = new HttpResponse({
        body: body,
        status: nativeHttpResponse.status,
        headers: null,//nativeHttpResponse.headers,
        url: nativeHttpResponse.url,
      });

      return Promise.resolve(response);
    } catch (error) {
      if (!error.status) { return Promise.reject(error); }

      const response = new HttpResponse({
        body: JSON.parse(error.error),
        status: error.status,
        headers: error.headers,
        url: error.url,
      });

      return Promise.reject(response);
    }
  }
}