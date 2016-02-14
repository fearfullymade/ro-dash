import { connect } from 'react-redux';
import Layout from '../components/Layout';
import * as actions from '../actions/dashActions';

const mapStateToProps = (state, ownProps) => {
  return {
    layout: state.cardLayout,
    cardConfig: state.cardConfig,
    dateRange: state.appState.dateRange,
    lookupData: state.lookupData
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    refresh: (cardId) => {
      dispatch(actions.refreshDataAsync(cardId, ownProps.dateRange));
    }
  }
}

const LayoutContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);

export default LayoutContainer;
