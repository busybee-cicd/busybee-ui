import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
 
@Entity()
export class RunTestStatusEntity {
 
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column("date")
    runId!: Date
 
    @Column("datetime")
    timestamp!: Date
    
    @Column({
      type: "clob", 
      transformer: { 
        to: (input:any) => { JSON.stringify(input); }, 
        from: (out:string) => { JSON.parse(out); }
      }
    })
    data!: any
    
    constructor(status:any | null) {
      if (!status) { return }
      
      this.runId = status.runId;
      this.timestamp = new Date(status.timestamp);
      this.data = status;
    }
}