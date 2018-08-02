import * as React from 'react';
import './RunTestHistoryList.scss';
import * as _ from 'lodash';

interface RunTestHistoryListProps {
    runTestHistory: any[]
}

export class RunTestHistoryList extends React.Component<RunTestHistoryListProps, any> {
    
    render() {
        const LIs = _.map(this.props.runTestHistory, (rt, i) => {
            return (
             <li className="list-group-header" key={i}>
                 {rt.runId}
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