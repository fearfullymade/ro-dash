import React from 'react';
import TopNav from './TopNav';
import Layout from './Layout';
import DateRange from '../helpers/DateRange';

export default class DashApp extends React.Component {
  constructor() {
    super();

    this.state = {
      dateRange: new DateRange('-30d')
    };
  }

  handleDateRangeChange (range) {
    this.setState({
      dateRange: range
    });
  };

  render() {
    return (
      <div className="container-fluid">
        <TopNav dateRange={this.state.dateRange} handleDateRangeChange={::this.handleDateRangeChange} />
        <Layout dateRange={this.state.dateRange} />
      </div>
    );
  }
}
