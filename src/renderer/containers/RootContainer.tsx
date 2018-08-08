import { connect } from 'react-redux'
import { Root } from '../components/Root'
import { fetchDb, listenForBusybeeMessages, navigate } from '../actions';
import { ThunkDispatch } from 'redux-thunk';
import { NavLocation } from '../../shared/enums/NavLocation';
import { RootState } from '../reducers';

​const mapStateToProps = (state:RootState) => {
  return {
    db: state.app.db,
    navLocation: state.app.currentNavLocation
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    fetchDb: () => dispatch(fetchDb()),
    listenForBusybeeMessages: () => dispatch(listenForBusybeeMessages()),
    navigate: (navLocation:NavLocation) => dispatch(navigate(navLocation))
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root)
