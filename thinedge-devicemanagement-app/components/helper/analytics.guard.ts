import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AnalyticsGuard implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const contextData = route.data.contextData || route.parent.data.contextData;          // 1.
  
    if (contextData["c8y_ThinEdge"] ) {
        return true;
    } else {
        return false;
    }
  }
}