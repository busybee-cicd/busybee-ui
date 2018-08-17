import { connect } from 'react-redux'
import { TestHistoryList } from '../../../components/test/history/TestHistoryList'
import { ThunkDispatch } from 'redux-thunk';
import { Actions } from '../../../actions';
import { RootState } from '../../../reducers';

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
)(TestHistoryList)
