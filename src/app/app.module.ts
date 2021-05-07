import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CentralDataComponent } from './central-data/central-data.component';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import { AddKHFormComponent } from './add-khform/add-khform.component';
import {FormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { AddInsulinComponent } from './add-insulin/add-insulin.component';
import {MatSliderModule} from '@angular/material/slider';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    CentralDataComponent,
    AddKHFormComponent,
    AddInsulinComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSliderModule,
    ServiceWorkerModule.register('ngsw-worker.js',
      { enabled: environment.production,
        registrationStrategy: 'registerImmediately'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
