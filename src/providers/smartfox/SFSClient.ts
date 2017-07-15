import { SFSEvent } from './SFSEvent.ts';

var SFS2X = window['SFS2X'];

export class SFSClient {
  mSFSClient: any;
  mDebugEnable: boolean = true;
  constructor() {

  }
  initialize() {

    return new Promise(
      (resolve, reject) => {
        if (this.mSFSClient) {
          resolve();
        }
        if (SFS2X == null || SFS2X == undefined) {
          SFS2X = window['SFS2X'];
        }
        else {
          this.mSFSClient = new SFS2X.SmartFox(true);
          resolve();
        }
        console.log("xxxx");
        
      }
    );
  }
  private addEventsListener() {
    this.mSFSClient.addEventListener(SFSEvent.CONNECTION, (eventParams) => {
      if (eventParams.success) {
        this.onConnection();
      }
    });

  }



  connect(host: string, port: number) {
    return new Promise(
      (resolve, reject) => {
        this.initialize().then(
          () => {
            this.mSFSClient.connect(host, port);
            this.mSFSClient.removeEventListener(SFSEvent.CONNECTION, () => { });
            this.mSFSClient.addEventListener(SFSEvent.CONNECTION_LOST, (eventParams) => {
              this.onConnectionLost(eventParams.reason);
            });
            this.mSFSClient.addEventListener(SFSEvent.CONNECTION, (eventParams) => {
              this.SFSLog("on connection " + JSON.stringify(eventParams));
              if (eventParams.success) {
                this.onConnection();
                resolve();
              }
              else reject();
            });

          }
        ).catch(
          () => { reject(); }
          );
      }
    );
  }

  disconnect() {

  }


  login(zone: string, username: string, password: string, params) {

  }
  logout() {

  }



  /**Khi thiết lập được kết nối, làm một số việc linh tinh ...*/
  private onConnection() {
    console.log(this.mSFSClient);
    this.SFSLog("on Connection success, now addEventsListener");
    this.mSFSClient.addEventListener(SFSEvent.CONNECTION_LOST, (eventParams) => {
      this.onConnectionLost(eventParams.reason);
    });
    this.mSFSClient.addEventListener(SFSEvent.CONNECTION_LOST, eventParams => { });
  }

  /**
   * Smartfox events
   */

  private onConnectionLost(reason: string) {
    this.SFSLog("on Connection Lost with reason " + reason);

  }

  public SFSLog(message) {
    if (!this.mDebugEnable) return;
    console.log("SFS : " + message);
  }
}
