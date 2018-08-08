import { connect } from 'react-redux'
import { TestRunForm } from '../../components/test/TestRunForm'
import { Actions } from '../../actions';
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
    connectToWs: (config:WSConnectionInfo) => dispatch(Actions.testRun.connectToWs(config)),
    runTest: (runTestConfig:TestRunConfig) => dispatch(Actions.testRun.runTest(runTestConfig))
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestRunForm)
