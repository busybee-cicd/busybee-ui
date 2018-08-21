import { connect } from 'react-redux'
import { LogConsole } from '../components/LogConsole'
import { Actions } from '../actions';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';

​const mapStateToProps = (state:RootState) => {
  return {
    log: state.app.log
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    clearLog: () => dispatch(Actions.app.clearLog())
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogConsole)
