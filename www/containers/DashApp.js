import { connect } from 'react-redux';
import DashApp from '../components/DashApp';
import * as actions from '../actions/dashActions';

const mapStateToProps = (state, ownProps) => {
  return {
    dateRange: state.dateRange
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeDateRange: (range) => {
      dispatch(actions.changeDateRange(range));
    }
  }
}

const DashAppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashApp);

export default DashAppContainer;

