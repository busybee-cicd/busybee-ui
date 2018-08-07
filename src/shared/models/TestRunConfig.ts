import { WSConnectionInfo } from "./WSConnectionInfo";

export class TestRunConfig {
  dirPath:string = '';
  wsConnectionInfo: WSConnectionInfo = new WSConnectionInfo('localhost', 8080);
  
  /**
   * 
   * @param dirPath  absolute path to busybee directory
   * @param wsPort  port to communicate via WebSockets on
   */
  constructor(dirPath:string, wsConnectionInfo:WSConnectionInfo|null = null) {
    this.dirPath = dirPath;
    if (wsConnectionInfo) {
      this.wsConnectionInfo = wsConnectionInfo;
    }
  }
}