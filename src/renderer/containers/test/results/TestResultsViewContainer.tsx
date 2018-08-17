import { connect } from 'react-redux'
import TestResultsView from '../../../components/test/results/TestResultsView'
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../../reducers';
import { Actions } from '../../../actions';

​const mapStateToProps = (state:RootState) => {
  return {
    fetching: state.testResult.fetching,
    testRunHistory: state.testRun.history,
    runId: state.testRun.currentRunId,
    testResults: state.testResult.currentTestResults
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    fetchTestResults: (runId: string) => dispatch(Actions.testResult.fetchTestResults(runId)),
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestResultsView)
