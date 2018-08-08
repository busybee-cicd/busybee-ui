import { connect } from 'react-redux'
import { Root } from '../components/Root'
import { Actions } from '../actions';
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
    fetchDb: () => dispatch(Actions.app.fetchDb()),
    listenForBusybeeMessages: () => dispatch(Actions.app.listenForBusybeeMessages()),
    navigate: (navLocation:NavLocation) => dispatch(Actions.app.navigate(navLocation)),
    setCurrentTestRunId: (runId: string|null) => dispatch(Actions.testRun.setCurrentTestRunId(runId))
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root)
