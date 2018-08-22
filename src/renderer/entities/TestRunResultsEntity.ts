import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import { BusybeeMessageI } from '../../shared/models/BusybeeMessageI';
import { BusybeeTestResults } from 'busybee-results-react';
 
@Entity()
export class TestRunResultsEntity {
 
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column("datetime")
    timestamp!: Date // timestamp of when the message was recieved

    @Column("datetime") // timestamp of when the test run was started (unique)
    runTimestamp!: Date

    @Column()
    runId!: string
 
    @Column("simple-json")
    data!: BusybeeTestResults
    
    constructor(msg:BusybeeMessageI) {
      if (!msg) { return }
      
      this.timestamp = new Date(msg.timestamp);
      this.runTimestamp = new Date(msg.data.runTimestamp);
      this.runId = msg.data.runId;
      this.data = msg.data;
    }
}