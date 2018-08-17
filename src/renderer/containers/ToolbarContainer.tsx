import { connect } from 'react-redux'
import { Actions } from '../actions';
import { ThunkDispatch } from 'redux-thunk';
import { NavLocation } from '../../shared/enums/NavLocation';
import { RootState } from '../reducers';
import { ToolBar } from '../components/ToolBar';

​const mapStateToProps = (state:RootState) => {
  return {
    runId: state.testRun.currentRunId,
    navLocation: state.app.currentNavLocation,
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    navigate: (navLocation:NavLocation) => dispatch(Actions.app.navigate(navLocation)),
    setCurrentTestRunId: (runId: string|null) => dispatch(Actions.testRun.setCurrentTestRunId(runId)),
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolBar)
