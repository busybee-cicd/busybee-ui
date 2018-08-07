import { connect } from 'react-redux'
import { TestRunForm } from '../components/test/TestRunForm'
import { runTest } from '../actions';
import { ThunkDispatch } from 'redux-thunk';
import { TestRunConfig } from '../../shared/models/TestRunConfig';
import { AppState } from '../reducers';

​const mapStateToProps = (state:AppState) => {
  return {
    testDirPath: state.testDirPath,
    wsHost: state.wsHost,
    wsPort: state.wsPort
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    runTest: (runTestConfig:TestRunConfig) => dispatch(runTest(runTestConfig))
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestRunForm)
