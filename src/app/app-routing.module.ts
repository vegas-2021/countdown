import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CountdownComponent} from "./countdown/countdown.component";

const routes: Routes = [
  {
    path: 'vegas',
    component: CountdownComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
