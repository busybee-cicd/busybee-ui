import * as React from 'react';
import './TestRunView.scss';
import Tree from 'react-d3-tree';

interface TestRunTreeProps {
    runData: AnyOfArrays;
    runId: string;
    dataIndex: number;
}

export class TestRunTree extends React.Component<TestRunTreeProps, any> {
        
    render() {
        let dataArr = this.props.runData[this.props.runId];
        let data = dataArr[this.props.dataIndex].data.tree;
        
        return (
            <div id={data.runId} className="w-100 h-100">
                <Tree 
                    data={[data]} 
                    orientation='vertical'
                    translate={{
                        x: (window.innerWidth - 150) * .5,
                        y: 25
                    }}
                />
            </div>
        )
    }
}