import React from 'react';
import TopNav from './TopNav';
import Layout from '../containers/Layout';
import DateRange from '../helpers/DateRange';

export default class DashApp extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <TopNav dateRange={this.props.dateRange} handleDateRangeChange={this.props.changeDateRange} />
        <Layout dateRange={this.props.dateRange} />
      </div>
    );
  }
}
