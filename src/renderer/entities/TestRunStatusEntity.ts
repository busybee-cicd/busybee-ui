import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import { BusybeeMessageI } from '../../shared/models/BusybeeMessageI';
import * as _ from "lodash";

@Entity()
export class TestRunStatusEntity {
 
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column("datetime")
    timestamp!: Date // timestamp of when the message was recieved

    @Column("datetime") // timestamp of when the test run was started (unique)
    runTimestamp!: Date

    @Column()
    runId!: string
 
    @Column("simple-json")
    data!: any
    
    constructor(msg:BusybeeMessageI) {
      if (!msg) { return }
      
      this.timestamp = new Date(msg.timestamp);
      this.runTimestamp = new Date(msg.data.runTimestamp);
      this.runId = msg.data.runId;
      this.data = {
        raw: msg.data,
        tree: this.convertToTree(msg.data)
      }
    }

    convertToTree(data:any):any {
      const hosts:any[] = [];
      const treeData = {
        name: `${data.runTimestamp}`,
        attributes: {
          runId: data.runId, 
          timestamp: `${new Date(data.runTimestamp).toUTCString()}`,
        },
        children: hosts
      };
      
      _.forEach(data.hosts, (hostData, hostName) => {
        
        // get en
        const environments:any[] = [];
        _.forEach(hostData.envs, (hostEnvData, envId) => {
          const envData = data.envs[envId];
          const testSets:string[] = _.map(envData.testSets, (data:any, testSetName) => {
            return testSetName;
          });
          let portOffset:number = hostEnvData.portOffset;
          const ports:number[] = hostEnvData.ports.map((p:number) => { return p + portOffset });
          environments.push({
            name: envData.suiteEnvID,
            attributes: {
              envId: `${envId.substr(0, 8)}...`,
              suiteID: envData.suiteID,
              testSets: testSets,
              ports: ports
            }
          });
        });
        
        // add each host
        treeData.children.push({
          name: hostName,
          attributes: {
            load: hostData.load,
            capacity: hostData.capacity
          },
          children: environments
        });
        
      });
      
      return treeData;
    }
}