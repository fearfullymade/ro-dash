import React from 'react';
import TopNav from './TopNav';
import Layout from './Layout';
import DateRange from '../helpers/DateRange';

export default React.createClass({
  getInitialState: function () {
    return {
      dateRange: new DateRange('-30d')
    };
  },

  handleDateRangeChange: function (range) {
    this.setState({
      dateRange: range
    });
  },

  render: function () {
    return (
      <div className="container-fluid">
        <TopNav dateRange={this.state.dateRange} handleDateRangeChange={this.handleDateRangeChange} />
        <Layout dateRange={this.state.dateRange} />
      </div>
    );
  }
});


