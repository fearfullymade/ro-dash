import React from 'react';
import DateRange from '../helpers/DateRange';

export default React.createClass({
  getDefaultProps: function () {
    return {
      colors: {}
    };
  },

  getInitialState: function () {
    return {
      refreshing: false,

      flotOptions: {
        series: {
          pie: {
            show: true
          }
        }
      }
    };
  },

  componentDidMount: function () {
    this.refreshData();
  },

  componentDidUpdate: function () {
    if (!this.state.refreshing && this.state.chartData) {
      var chartDiv = React.findDOMNode(this.refs.chart);
      $.plot(chartDiv, this.state.chartData, this.state.flotOptions);
    }
  },

  refreshData: function (src, range) {
    if (!src)
      src = this.props.src;
    if (!range)
      range = this.props.range;

    if (src) {
      this.setState({
        refreshing: true
      });

      var startDate = range.getStartDate();
      var endDate = range.getEndDate();

      if (startDate)
        src += (src.indexOf('?') >= 0 ? '&' : '?') + 'date>=' + startDate.format("YYYY-MM-DD");
      if (endDate)
        src += (src.indexOf('?') >= 0 ? '&' : '?') + 'date<=' + endDate.format("YYYY-MM-DD");

      $.getJSON(src, function (result) {
        var data = []; 

        result[0].sort(function (a, b) {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });

        for (var i = 0; i < result[0].length; i++) {
          var series = {
            label: result[0][i][0],
            data: result[0][i][1]
          };

          if (this.props.colors[series.label])
            series.color = this.props.colors[series.label];
          
          data.push(series);
        }

        if (this.isMounted()) {
          this.setState({
            refreshing: false,
            chartData: data
          });
        }
      }.bind(this));
    }
  },

  handleRefreshClick: function (e) {
    this.refreshData();
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.src != this.props.src || !DateRange.areSame(nextProps.range, this.props.range))
      this.refreshData(nextProps.src, nextProps.range);
  },

  render: function () {
    return (
      <div className="card card-inverse">
        <div className="card-block">
          <button type="button" className="btn btn-secondary-outline btn-sm pull-right" onClick={this.handleRefreshClick}>
            <i className="fa fa-refresh"></i>
          </button>
          <h4 className="card-title">{this.props.title}</h4>
          { this.state.refreshing 
            ? <div key="spinner" style={{height: '200px', paddingTop: '70px'}} className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-3x" /></div>
            : <div key="chart" ref="chart" style={{height: '200px'}}></div>
          }
        </div>
      </div>
    );
  }
});
