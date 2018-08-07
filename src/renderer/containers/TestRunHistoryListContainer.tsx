import { connect } from 'react-redux'
import { TestRunHistoryList } from '../components/test/TestRunHistoryList'
import { ThunkDispatch } from 'redux-thunk';
import { fetchTestRunHistory, setCurrentTestRunId } from '../actions';
import { AppState } from '../reducers';

​const mapStateToProps = (state:AppState) => {
  return {
    testRunHistory: state.testRunHistory
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    fetchTestRunHistory: () => dispatch(fetchTestRunHistory()),
    setCurrentTestRunId: (runId:string) => dispatch(setCurrentTestRunId(runId))
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestRunHistoryList)
