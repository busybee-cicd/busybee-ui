import * as React from 'react';
import './RunTestHistoryList.scss';
import * as _ from 'lodash';
import * as moment from 'moment';

interface RunTestHistoryListProps {
    runTestHistory: any[]
}

export class RunTestHistoryList extends React.Component<RunTestHistoryListProps, any> {
    
    render() {
        const LIs = _.map(this.props.runTestHistory, (rt, i) => {
            return (
             <li className="list-group-header" key={i}>
                 {moment(rt.runId).format('MMMM DD YYYY, h:mm:ss a')}
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