import React from 'react';
import DateRangePicker from './DateRangePicker';

export default class TopNav extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-inverse">
        <a className="navbar-brand" href="#">ro-dash</a>
        <div className="btn-toolbar pull-right">
          <div className="btn-group">
            { this.props.appState.configMode
               ? <button className="btn btn-secondary-outline" onClick={this.props.leaveConfigMode}><span className="fa fa-stop" /></button>
               : <button className="btn btn-secondary-outline" onClick={this.props.enterConfigMode}><span className="fa fa-cogs" /></button>
            }
          </div>
          <DateRangePicker onChange={this.props.handleDateRangeChange} current={this.props.appState.dateRange} />
        </div>
      </nav>
    );
  }
}
