import { connect } from 'react-redux'
import { Root } from '../components/Root'
import { fetchDb, listenForBusybeeMessages } from '../actions';
import { ThunkDispatch } from 'redux-thunk';

​const mapStateToProps = (state:any) => {
  return {
    db: state.db,
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    fetchDb: () => dispatch(fetchDb()),
    listenForBusybeeMessages: () => dispatch(listenForBusybeeMessages())
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root)
