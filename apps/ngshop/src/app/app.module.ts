import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { UiModule } from '@bluebits/ui';
import { AccordionModule } from 'primeng/accordion';
import { NavComponent } from './shared/nav/nav.component';
import { ProductsModule } from '@bluebits/products';
import { OrdersModule } from '@bluebits/orders';
import { MessagesComponent } from './shared/messages/messages.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

const routes: Routes = [
  { path: '', component: HomePageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NxWelcomeComponent,
    HomePageComponent,
    FooterComponent,
    HeaderComponent,
    NavComponent,
    MessagesComponent,
  ],
  imports: [
    ToastModule,
    BrowserModule, 
    RouterModule.forRoot(routes), 
    UiModule, 
    AccordionModule,
    ProductsModule,
    HttpClientModule,
    UiModule,
    OrdersModule,
    BrowserAnimationsModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
