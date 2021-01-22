import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {first, map} from 'rxjs/operators';
import {LibreData} from './libre-data';
import {interval, Subscription, timer} from 'rxjs';


@Component({
  selector: 'app-central-data',
  templateUrl: './central-data.component.html',
  styleUrls: ['./central-data.component.css'],
  providers: [HttpClient]
})
export class CentralDataComponent implements OnInit, OnDestroy {
  libreData: LibreData;
  timerSubscription: Subscription;
  status: string;
  queue: number[] = [];
  average: string;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {

    const seconds = interval(30000);
    this.timerSubscription = timer(10, 10000).pipe(
      map(() => {
        this.loadData();
      })
    ).subscribe();

   // this.libreData = {glucose: '172', timestamp: '1611348527475', serial: '3MH003PDJ9H'};


  }

  loadData(): void {
    this.httpClient.get('http://env-4074176.jcloud-ver-jpc.ik-server.com/data')
      .pipe(
        first(),
        map( result => {
          console.log(result);
          this.libreData = result as LibreData;
          if (this.libreData.timestamp) {
            this.prepareLibreData();
          }
        })
      )
      .subscribe(data => {},
        error => console.log('mmo: error:', error)) ;
  }

  prepareLibreData(): void {
    this.libreData.glucoseMmol = (Math.round(parseInt(this.libreData.glucose, 10) / 18 * 100) / 100).toString();
    this.libreData.date = new Date(this.libreData.timestamp);
    const mmol = parseInt(this.libreData.glucoseMmol, 10);
    if (mmol > 9.5) {
      this.status = 'red';
    } else
    if (mmol > 4.0) {
      this.status = 'green';
    } else {
      this.status = 'red';
    }

    this.queue.push(mmol);
    if (this.queue.length > 5) {
      this.queue.shift();
    }
    const average = (array) => array.reduce((a, b) => a + b) / array.length;
    this.average = average(this.queue).toString();
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

}
