import { connect } from 'react-redux'
import { TestRunView } from '../components/test/TestRunView'
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { setTestRunViewSliderIndex } from '../actions';

​const mapStateToProps = (state:RootState) => {
  return {
    runData: state.testRun.timeSeriesData,
    runId: state.testRun.currentRunId,
    runViewSliderIndex: state.testRun.sliderIndex
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    setTestRunViewSliderIndex: (index:number) => {dispatch(setTestRunViewSliderIndex(index)); }
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestRunView)
