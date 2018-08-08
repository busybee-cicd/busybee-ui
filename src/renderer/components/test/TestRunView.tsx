import * as React from 'react';
import './TestRunView.scss';
import * as _ from 'lodash';
import TestRunHistoryListContainer from '../../containers/test/TestRunHistoryListContainer';
import { SyncLoader } from 'react-spinners';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import TestRunTree from './TestRunTree';
import 'rc-slider/assets/index.css';
import * as moment from 'moment';
import * as classNames from 'classnames';
import TestRunFormContainer from '../../containers/test/TestRunFormContainer';

interface TestRunViewProps {
    setTestRunViewSliderIndex: (index:number) => void,
    runData: AnyOfArrays,
    runId: string | null,
    runViewSliderIndex: number,
    isRunning: boolean
}

const SliderWithTooltip = createSliderWithTooltip(Slider);

export default class TestRunView extends React.Component<TestRunViewProps, any> {
    
    sliderFormatter(v:number):string {
        if (!this.props.runId) { return `${v}`; }
        let ts = this.props.runData[this.props.runId][v].timestamp;
        return moment(ts).format('MMMM DD YYYY, h:mm:ss a')
    }

    render() {
        let Content;
        if (this.props.runId === null) {
            Content = this.props.isRunning ?
                <SyncLoader loading={true} />
                : <TestRunFormContainer />;
        } else {
            if (_.isEmpty(this.props.runData) || !this.props.runData[this.props.runId]) {
                Content = <SyncLoader loading={true} />;
            } else {
                const dataArr = this.props.runData[this.props.runId];
                const totalSteps = dataArr.length;
                const sliderClasses = classNames(
                    [
                        'p-2', 'justify-content-center', 'align-items-center'
                    ],
                    {
                        hide: totalSteps < 2 ? true: false,
                        'd-flex': totalSteps < 2 ? false : true 
                    }
                );
                Content = (
                    <div className="w-100 h-100">
                        <div className={sliderClasses}>
                            <SliderWithTooltip
                                dots
                                style={{
                                    width: '75%',
                                    marginTop: 25,
                                    marginBottom: 25
                                }}
                                step={1}
                                min={0}
                                max={totalSteps - 1}
                                value={this.props.runViewSliderIndex}
                                tipProps={{overlay: this.sliderFormatter.bind(this, this.props.runViewSliderIndex)}}
                                onChange={this.props.setTestRunViewSliderIndex.bind(this)}
                            />
                        </div>
                        <TestRunTree
                            runData={this.props.runData}
                            runId={this.props.runId}
                            dataIndex={this.props.runViewSliderIndex}
                        />                            
                    </div>
                ); 
            } 
        }

        return (
            <div className="w-100 h-100">
                <div className="pane-group">
                    <div className="pane-sm sidebar">
                        <div className="text-center"><b>Test Run History</b></div>
                        <TestRunHistoryListContainer />
                    </div>
                    <div className="pane d-flex justify-content-center align-items-center">
                        {Content}
                    </div>
                </div>
            </div>
            
        )
    }
}