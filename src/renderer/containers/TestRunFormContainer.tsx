import { connect } from 'react-redux'
import { TestRunForm } from '../components/test/TestRunForm'
import { runTest } from '../actions';
import { ThunkDispatch } from 'redux-thunk';
import { TestRunConfig } from '../../shared/models/TestRunConfig';
import { RootState } from '../reducers';

​const mapStateToProps = (state:RootState) => {
  return {
    testDirPath: state.app.testDirPath,
    wsHost: state.app.wsHost,
    wsPort: state.app.wsPort
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
