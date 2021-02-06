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


@NgModule({
  declarations: [
    AppComponent,
    CentralDataComponent,
    AddKHFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    MatDialogModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
