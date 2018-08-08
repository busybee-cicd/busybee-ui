import { connect } from 'react-redux'
import { TestRunHistoryList } from '../../components/test/TestRunHistoryList'
import { ThunkDispatch } from 'redux-thunk';
import { Actions } from '../../actions';
import { RootState } from '../../reducers';

​const mapStateToProps = (state:RootState) => {
  return {
    testRunHistory: state.testRun.history
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    fetchTestRunHistory: () => dispatch(Actions.testRun.fetchTestRunHistory()),
    setCurrentTestRunId: (runId:string) => dispatch(Actions.testRun.setCurrentTestRunId(runId))
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestRunHistoryList)
