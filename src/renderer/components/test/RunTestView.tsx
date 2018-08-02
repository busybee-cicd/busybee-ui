import * as React from 'react';
import './RunTestView.scss';
import Tree from 'react-d3-tree';
import * as _ from 'lodash';
import RunTestHistoryListContainer from '../../containers/RunTestHistoryListContainer';

interface RunTestViewProps {
    runData: AnyOfArrays
}

export class RunTestView extends React.Component<RunTestViewProps, any> {
        
    render() {
        let Content;
        if (_.isEmpty(this.props.runData)) {
            Content = <div></div>;
        } else {
            Content = _.map(
                this.props.runData, 
                (dataCollection:any[], runTimestamp:number) => {
                let id = `${runTimestamp}`;
                return (
                    <div id={id} key={runTimestamp} className="w-100 h-100">
                        <Tree 
                                data={[dataCollection[dataCollection.length-1]]} 
                                orientation='vertical'
                                translate={{
                                    x: (window.innerWidth - 150) * .5,
                                    y: 25
                                }}
                            />
                    </div>
                    
                ) 
            }); 
        }
        
        return (
            <div className="w-100 h-100">
                <div className="pane-group">
                    <div className="pane-sm sidebar">
                        <div className="text-center"><b>Test Run History</b></div>
                        <RunTestHistoryListContainer />
                    </div>
                    <div className="pane">
                        {Content}
                    </div>
                </div>
            </div>
        )
    }
}