import React from 'react';
import DateRange from '../helpers/DateRange';

export default class DateRangePicker extends React.Component {
  constructor() {
    super();

    this.state = {
      isOpen: false
    };
  }

  handleMainButtonClick(event) {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handlePresetClick(rangeId, event) {
    var range = new DateRange(rangeId);

    this.setState({
      isOpen: !this.state.isOpen
    });

    if (!DateRange.areSame(this.props.range, range))
      this.props.onChange(range);
  }

  render() {
    var classes = this.state.isOpen ? 'btn-group open' : 'btn-group';

    var currentRange = '';

    if (this.props.current) {
      if (this.props.current.getId() == 'all')
        currentRange = <span>All Time</span>;
      else
        currentRange = <span>{this.props.current.getStartDate().format("YYYY-MM-DD")} &ndash; {this.props.current.getEndDate().format("YYYY-MM-DD")}</span>;
    }

    return (
      <div className={classes}>
        <button type="button" className="btn btn-secondary-outline" onClick={::this.handleMainButtonClick}>
          <i className="fa fa-calendar-o" /> {currentRange}
        </button>
        <div className="dropdown-menu dropdown-menu-right">
          <a className="dropdown-item" href="#" onClick={::this.handlePresetClick.bind(this, 'all')}>All Time</a>
          <a className="dropdown-item" href="#" onClick={::this.handlePresetClick.bind(this, '-0d')}>Today</a>
          <a className="dropdown-item" href="#" onClick={::this.handlePresetClick.bind(this, '-7d')}>Last 7 days</a>
          <a className="dropdown-item" href="#" onClick={::this.handlePresetClick.bind(this, '-30d')}>Last 30 days</a>
        </div>
      </div>
    );
  }
}
