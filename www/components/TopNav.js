import React from 'react';
import DateRangePicker from './DateRangePicker';

export default React.createClass({
  render: function () {
    return (
      <nav className="navbar navbar-dark bg-inverse">
        <a className="navbar-brand" href="#">ReachOut Dashboard</a>
        <div className="pull-right">
          <DateRangePicker onChange={this.props.handleDateRangeChange} current={this.props.dateRange} />
        </div>
      </nav>
    );
  }
});
