import * as React from 'react';
import './TestRunHistoryList.scss';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TestRunStatusEntity } from '../../entities/TestRunStatusEntity';

interface TestRunHistoryListProps {
    fetchTestRunHistory: () => void,
    setCurrentTestRunId: (runId:string) => void,
    testRunHistory: TestRunStatusEntity[]
}

export class TestRunHistoryList extends React.Component<TestRunHistoryListProps, any> {
    
    componentDidMount() {
        this.props.fetchTestRunHistory();
    }
    render() {
        const LIs = _.map(this.props.testRunHistory, (rh, i) => {
            return (
             <li className="list-group-header" key={i} onClick={this.props.setCurrentTestRunId.bind(this, rh.runId)}>
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