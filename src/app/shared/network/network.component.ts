import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ConnectionStatus, Network} from '@capacitor/network';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
})
export class NetworkComponent implements OnInit {

  status = '';

  constructor(private change: ChangeDetectorRef) { }

  ngOnInit() {
    this.getNetworkStatus();
  }


getNetworkStatus(){
    Network.getStatus().then(
      (status: ConnectionStatus) => {
        this.status = (status.connected) ? 'verbonden' : 'offline';
        this.onNetworkChanged();
      }
    );
    return this.status;
  }

  onNetworkChanged(){
    Network.addListener('networkStatusChange',(status) => {
      this.status = (status.connected) ? 'verbonden' : 'offline';
      this.change.detectChanges();
    });
  }

}
