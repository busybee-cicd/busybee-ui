export class WSConnectionInfo {
  host:string;
  port:number;
  
  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }
}