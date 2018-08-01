import * as React from 'react';
import './RunTestView.scss';
import Tree from 'react-d3-tree';
import * as _ from 'lodash';

interface RunTestViewProps {
    runData: AnyOfArrays
}

export class RunTestView extends React.Component<RunTestViewProps, any> {
        
    render() {
        if (_.isEmpty(this.props.runData)) { return <div></div> }
        
        let Content = _.map(
            this.props.runData, 
            (dataCollection:any[], runTimestamp:number) => {
               let id = `${runTimestamp}`;
               return (
                   <div id={id} key={runTimestamp}>
                       <Tree data={[dataCollection[dataCollection.length-1]]} />
                   </div>
                
               ) 
            });
        
        return (
            <div>
               {Content}
            </div>
        )
    }
}