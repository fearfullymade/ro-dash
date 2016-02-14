import React from 'react';
import TopNav from './TopNav';
import Layout from '../containers/Layout';
import DateRange from '../helpers/DateRange';

export default class DashApp extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <TopNav appState={this.props.appState} handleDateRangeChange={this.props.changeDateRange} enterConfigMode={this.props.enterConfigMode} leaveConfigMode={this.props.leaveConfigMode} />
        <Layout appState={this.props.appState} updateCardConfig={this.props.updateCardConfig} />
      </div>
    );
  }
}
