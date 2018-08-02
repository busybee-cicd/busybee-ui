import { connect } from 'react-redux'
import { RunTestHistoryList } from '../components/test/RunTestHistoryList'
import { ThunkDispatch } from 'redux-thunk';

​const mapStateToProps = (state:any) => {
  return {
    runTestHistory: state.runTestHistory
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {}
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RunTestHistoryList)
