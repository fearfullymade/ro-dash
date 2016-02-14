import { connect } from 'react-redux';
import TimeGraphCard from '../components/TimeGraphCard';
import ListCard from '../components/ListCard';
import PieCard from '../components/PieCard';
import * as actions from '../actions/dashActions';

const mapStateToProps = (state, ownProps) => {
  let config = state.cardConfig.get(ownProps.id);

  return {
    title: config.title,
    mapX: config.mapX,
    colors: config.colors,
    data: state.cardData.get(ownProps.id)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    refresh: () => {
      dispatch(actions.refreshDataAsync(ownProps.id, ownProps.range));
    }
  }
}

const TimeGraph = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeGraphCard);

const List = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListCard);

const Pie = connect(
  mapStateToProps,
  mapDispatchToProps
)(PieCard);

export { TimeGraph, List, Pie };
