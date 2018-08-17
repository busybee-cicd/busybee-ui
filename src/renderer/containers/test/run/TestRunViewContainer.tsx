import { connect } from 'react-redux'
import TestRunView from '../../../components/test/run/TestRunView'
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../../reducers';
import { Actions } from '../../../actions';
import { NavLocation } from '../../../../shared/enums/NavLocation';

​const mapStateToProps = (state:RootState) => {
  return {
    runData: state.testRun.timeSeriesData,
    runId: state.testRun.currentRunId,
    runViewSliderIndex: state.testRun.sliderIndex,
    isRunning: state.testRun.isRunning,
    remoteConnect: state.testRun.remoteConnect
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    cancelTest: () => dispatch(Actions.testRun.cancelTest()),
    navigate: (loc:NavLocation) => dispatch(Actions.app.navigate(loc)),
    setCurrentTestRunId: (runId: string | null) => dispatch(Actions.testRun.setCurrentTestRunId(runId)),
    setTestRunViewSliderIndex: (index:number) => dispatch(Actions.testRun.setTestRunViewSliderIndex(index))
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestRunView)
