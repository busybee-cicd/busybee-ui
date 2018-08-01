import { connect } from 'react-redux'
import { RunTestForm } from '../components/test/RunTestForm'
import { runTest } from '../actions';
import { ThunkDispatch } from 'redux-thunk';
import { RunTestConfig } from '../../shared/models/RunTestConfig';

​const mapStateToProps = (state:any) => {
  return {
    testDirPath: state.testDirPath,
    wsHost: state.wsHost,
    wsPort: state.wsPort,
    testRunStatus: state.testRunStatus
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    runTest: (runTestConfig:RunTestConfig) => dispatch(runTest(runTestConfig))
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RunTestForm)
