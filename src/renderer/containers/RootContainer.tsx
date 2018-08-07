import { connect } from 'react-redux'
import { Root } from '../components/Root'
import { fetchDb, listenForBusybeeMessages, navigate } from '../actions';
import { ThunkDispatch } from 'redux-thunk';
import { NavState } from '../../shared/enums/NavState';
import { AppState } from '../reducers';

​const mapStateToProps = (state:AppState) => {
  return {
    db: state.db,
    navState: state.currentNavState
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    fetchDb: () => dispatch(fetchDb()),
    listenForBusybeeMessages: () => dispatch(listenForBusybeeMessages()),
    navigate: (navState:NavState) => dispatch(navigate(navState))
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root)
