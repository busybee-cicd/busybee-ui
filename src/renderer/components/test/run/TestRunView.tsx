import * as React from 'react';
import './TestRunView.scss';
import TestHistoryListContainer from '../../../containers/test/history/TestHistoryListContainer';
import { SyncLoader } from 'react-spinners';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import TestRunTree from './TestRunTree';
import 'rc-slider/assets/index.css';
import * as moment from 'moment';
import * as classNames from 'classnames';
import TestRunFormContainer from '../../../containers/test/run/TestRunFormContainer';
import { NavLocation } from '../../../../shared/enums/NavLocation';

interface TestRunViewProps {
    cancelTest: () => void,
    navigate: (loc:NavLocation) => void,
    setCurrentTestRunId: (runId: string | null) => void,
    setTestRunViewSliderIndex: (index:number) => void,
    runData: AnyOfArrays,
    runId: string | null,
    runViewSliderIndex: number,
    isRunning: boolean,
    remoteConnect: boolean
}

const SliderWithTooltip = createSliderWithTooltip(Slider);

export default class TestRunView extends React.Component<TestRunViewProps, any> {
    
    sliderFormatter(v:number):string {
        if (!this.props.runId) { return `${v}`; }
        let ts = this.props.runData[this.props.runId][v].timestamp;
        return moment(ts).format('MMMM DD YYYY, h:mm:ss a')
    }

    getNewRunNavItem():JSX.Element|void {
        if (!this.props.isRunning) {
            return (
                <button 
                    onClick={this.props.setCurrentTestRunId.bind(this, null)} 
                    className='subnav-item btn btn-primary'>
                    New Test Run
                </button>
            ) 
        }   
    }

    getCancelNavItem():JSX.Element|void {
        if (this.props.isRunning) {
            const message = this.props.remoteConnect ? 'Disconnect' : 'Cancel';
            return (
                <button 
                    onClick={this.props.cancelTest.bind(this)} 
                    className='subnav-item btn btn-negative'>
                    {message}
                </button>
            )
        }   
}

    getViewResultNavItem():JSX.Element|void {
        if (!this.props.isRunning) {
            return (
                <button 
                    onClick={this.props.navigate.bind(this, NavLocation.TEST_RESULTS)} 
                    className='subnav-item btn btn-primary'>
                    View Result
                </button>
            )
        }   
    }

    getTestViewNav() {
        if (this.props.runId === null) return;

        const newRun = this.getNewRunNavItem();
        const cancel = this.getCancelNavItem();
        const viewResult = this.getViewResultNavItem();

        return (
            <div className='d-flex flex-row-reverse'>
                {newRun}
                {cancel}
                {viewResult}
            </div>
        )
    }

    render() {
        let Content;
        if (this.props.runId === null) { // no id is set so we're either waiting for events or the Form should be displayed
            let LoadingOrForm = this.props.isRunning ?
                <SyncLoader loading={true} />
                : <TestRunFormContainer />;
            
            Content = (
                <div className='d-flex h-100 justify-content-center align-items-center'>
                    {LoadingOrForm}
                </div>
            );
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

        return (
            <div id="TestRunView" className="w-100 h-100">
                <div className="pane-group">
                    <div className="pane-sm sidebar">
                        <div className="text-center"><b>Test Run History</b></div>
                        <TestHistoryListContainer />
                    </div>
                    <div className="pane d-flex flex-column">
                        {this.getTestViewNav()}
                        {Content}
                    </div>
                </div>
            </div>
            
        )
    }
}