import React from 'react';
import DateRangePicker from './DateRangePicker';

export default class TopNav extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-inverse">
        <a className="navbar-brand" href="#">ro-dash</a>
        <div className="pull-right">
          <DateRangePicker onChange={this.props.handleDateRangeChange} current={this.props.dateRange} />
        </div>
      </nav>
    );
  }
}
