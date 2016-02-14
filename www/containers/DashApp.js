import { connect } from 'react-redux';
import DashApp from '../components/DashApp';
import * as actions from '../actions/dashActions';

const mapStateToProps = (state, ownProps) => {
  return {
    appState: state.appState
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeDateRange: (range) => {
      dispatch(actions.changeDateRange(range));
    },

    enterConfigMode: () => {
      dispatch(actions.toggleConfigMode(true));
    },

    leaveConfigMode: () => {
      dispatch(actions.toggleConfigMode(false));
    },

    updateCardConfig: (id, changes) => {
      dispatch(actions.updateCardConfig(id, changes));
    }
  }
}

const DashAppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashApp);

export default DashAppContainer;

