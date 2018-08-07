import { connect } from 'react-redux'
import { TestRunView } from '../components/test/TestRunView'
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../reducers';
import { setTestRunViewSliderIndex } from '../actions';

​const mapStateToProps = (state:AppState) => {
  return {
    runData: state.timeSeriesTestRunData,
    runId: state.currentTestRunId,
    runViewSliderIndex: state.runViewSliderIndex
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
