import { connect } from 'react-redux'
import { RunTestView } from '../components/test/RunTestView'
import { ThunkDispatch } from 'redux-thunk';

​const mapStateToProps = (state:any) => {
  return {
    runData: state.timeSeriesTreeTestRunData
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
)(RunTestView)
