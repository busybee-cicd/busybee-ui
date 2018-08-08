import { connect } from 'react-redux'
import { Root } from '../components/Root'
import { fetchDb, listenForBusybeeMessages, navigate, setCurrentTestRunId } from '../actions';
import { ThunkDispatch } from 'redux-thunk';
import { NavLocation } from '../../shared/enums/NavLocation';
import { RootState } from '../reducers';

​const mapStateToProps = (state:RootState) => {
  return {
    db: state.app.db,
    runId: state.testRun.currentRunId,
    navLocation: state.app.currentNavLocation
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    fetchDb: () => dispatch(fetchDb()),
    listenForBusybeeMessages: () => dispatch(listenForBusybeeMessages()),
    navigate: (navLocation:NavLocation) => dispatch(navigate(navLocation)),
    setCurrentTestRunId: (runId: string|null) => dispatch(setCurrentTestRunId(runId))
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root)
