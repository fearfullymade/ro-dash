import { connect } from 'react-redux';
import TimeGraphCard from '../components/TimeGraphCard';
import ListCard from '../components/ListCard';
import PieCard from '../components/PieCard';
import * as actions from '../actions/dashActions';

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.cardConfig[ownProps.id].title,
    mapX: state.cardConfig[ownProps.id].mapX,
    colors: state.cardConfig[ownProps.id].colors,
    data: state.cardData[ownProps.id]
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
