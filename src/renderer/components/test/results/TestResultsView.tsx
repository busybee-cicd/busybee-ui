import * as React from 'react';
import './TestResultsView.scss';
import TestHistoryListContainer from '../../../containers/test/history/TestHistoryListContainer';
import { SyncLoader } from 'react-spinners';
import BusybeeTestResultsComponent, { BusybeeTestResults } from '../../../../../../busybee-result-react/dist';
import { TestRunStatusEntity } from '../../../entities/TestRunStatusEntity';

interface TestResultsViewProps {
    fetchTestResults: (runId: string) => void,
    fetching: boolean,
    testRunHistory: TestRunStatusEntity[] | null, // used as a fallback
    testResults: BusybeeTestResults | null,
    runId: string | null
}

export default class TestResultsView extends React.Component<TestResultsViewProps, any> {
    componentDidMount() {
        let runId;
        if (!this.props.testResults && this.props.runId) {
            runId = this.props.runId;
        } else if (
            !this.props.runId 
            && this.props.testRunHistory !== null
            && this.props.testRunHistory.length > 0) {
            // default to the latest run in the history
            runId = this.props.testRunHistory[0].runId;
        }

        if (runId) {
            this.props.fetchTestResults(runId);
        }
    }

    componentDidUpdate(prevProps: TestResultsViewProps) {
        if (prevProps.runId !== this.props.runId && this.props.runId) {
            this.props.fetchTestResults(this.props.runId);
        }
    }

    render() {
        let Content;
        if (this.props.fetching) {
            Content = <SyncLoader loading={true} />
        } else if (!this.props.testResults) {
            Content = <div>No results found for this Test Run</div>
        } else {
            Content = <BusybeeTestResultsComponent results={this.props.testResults} />
        }

        return (
            <div id="TestRunView" className="w-100 h-100">
                <div className="pane-group">
                    <div className="pane-sm sidebar">
                        <div className="text-center"><b>Test Run History</b></div>
                        <TestHistoryListContainer />
                    </div>
                    <div className="pane d-flex flex-column">
                        {Content}
                    </div>
                </div>
            </div>
            
        )
    }
}