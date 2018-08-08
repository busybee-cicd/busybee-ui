import { connect } from 'react-redux'
import { TestRunForm } from '../../components/test/TestRunForm'
import { runTest, connectToWs } from '../../actions';
import { ThunkDispatch } from 'redux-thunk';
import { TestRunConfig } from '../../../shared/models/TestRunConfig';
import { RootState } from '../../reducers';
import { WSConnectionInfo } from '../../../shared/models/WSConnectionInfo';

​const mapStateToProps = (state:RootState) => {
  return {
    defaultHost: state.testRun.defaultHost,
    defaultWsPort: state.testRun.defaultWsPort
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    connectToWs: (config:WSConnectionInfo) => dispatch(connectToWs(config)),
    runTest: (runTestConfig:TestRunConfig) => dispatch(runTest(runTestConfig))
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestRunForm)
