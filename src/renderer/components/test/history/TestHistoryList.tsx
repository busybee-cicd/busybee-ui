import * as React from 'react';
import './TestHistoryList.scss';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TestRunStatusEntity } from '../../../entities/TestRunStatusEntity';

interface TestHistoryListProps {
    fetchTestRunHistory: () => void,
    setCurrentTestRunId: (runId:string) => void,
    testRunHistory: TestRunStatusEntity[] | null
}

export class TestHistoryList extends React.Component<TestHistoryListProps, any> {
    
    componentDidMount() {
        if (!this.props.testRunHistory) {
            this.props.fetchTestRunHistory();
        }   
    }
    
    render() {
        const LIs = _.map(this.props.testRunHistory, (rh, i) => {
            return (
             <li className="list-group-item" key={i} onClick={this.props.setCurrentTestRunId.bind(this, rh.runId)}>
                 {moment(rh.runTimestamp).format('MMMM DD YYYY, h:mm:ss a')}
             </li>
            ) 
         });
         
        return (
            <ul className="list-group">
                {LIs}
            </ul>
        )
    }

}