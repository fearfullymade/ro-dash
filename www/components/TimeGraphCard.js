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
          stack: true,
          bars: {
            show: true,
            barWidth: 24*60*60*1000,
            align: 'center'
          }
        },
        xaxis: {
          mode: 'time',
          timeformat: '%Y-%m-%d',
          minTickSize: [1, 'day'],
          tickLength: 0,
          font: {
            color: '#fff'
          }
        },
        yaxis: {
          tickColor: '#999',
          font: {
            color: '#fff'
          }
        }
      }
    };
  },

  componentDidMount: function () {
    this.configureGraph();
    this.refreshData();
  },

  componentDidUpdate: function () {
    if (!this.state.refreshing && this.state.chartData) {
      var chartDiv = React.findDOMNode(this.refs.chart);
      $.plot(chartDiv, this.state.chartData, this.state.flotOptions);
    }
  },

  configureGraph: function (range) {
    if (!range)
      range = this.props.range;

    var opts = this.state.flotOptions;

    var startDate = range.getStartDate();
    var endDate = range.getEndDate() || moment().startOf('day');

    //this might break at daylight savings time?
    if (startDate)
      startDate.subtract(16, 'hour');
    endDate.add(8, 'hour');

    opts.xaxis.min = startDate ? startDate.valueOf() : null;
    opts.xaxis.max = endDate.valueOf();

    this.setState({
      flotOptions: opts
    });
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

        for (var s in result) {
          var series = {
            label: s,
            data: result[s]
          };

          if (this.props.colors[series.label])
            series.color = this.props.colors[series.label];

          data.push(series);
        }

        if (data.length == 1)
          data[0].label = '';

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
    if (nextProps.src != this.props.src || !DateRange.areSame(nextProps.range, this.props.range)) {
      this.configureGraph(nextProps.range);
      this.refreshData(nextProps.src, nextProps.range);
    }
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

