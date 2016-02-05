import React from 'react';
import ListCard from './ListCard';
import PieCard from './PieCard';
import TimeGraphCard from './TimeGraphCard';

export default class Layout extends React.Component {
  render() {
    return (
      <div style={{marginTop:'30px'}}>
        <div className="row">
          <div className="col-lg-8">
            <TimeGraphCard title="Total Activity" range={this.props.dateRange} src="/api/metric/date/total?split=isTrial" />
            <TimeGraphCard title="Active Users" range={this.props.dateRange} src="/api/metric/date/count?group=userId&split=isTrial&userId!=null" />
          </div>
          <div className="col-lg-4">
            <ListCard title="Top Users" range={this.props.dateRange} src="/api/metric/userId/total?userId!=null&sort=-total&limit=10" mapX="user" />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              <div className="col-sm-6">
                <PieCard title="Response Code" range={this.props.dateRange} src="/api/metric/responseCode/total" colors={{200:3, 304:1, 401:0, 404:4, 500:2}} />
              </div>
              <div className="col-sm-6">
                <PieCard title="Method" range={this.props.dateRange} src="/api/metric/method/total" colors={{'DELETE':2, 'GET':3, 'POST':0, 'PUT':1}} />
              </div>
            </div>
            <TimeGraphCard title="Client Error Reports" range={this.props.dateRange} src="/api/metric/date/total?path=rest/reportError" colors={{0:2}} />
          </div>
          <div className="col-lg-4">
            <ListCard title="Top Paths" range={this.props.dateRange} src="/api/metric/path/total?sort=-total&limit=10" />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8">
            <TimeGraphCard title="Access Requests" range={this.props.dateRange} src="/api/accessRequests" colors={{'Accepted':1, 'Completed':3, 'Pending':2}} />
          </div>
        </div>
      </div>
    );
  }
}
