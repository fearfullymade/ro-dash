import React from 'react';
import DateRange from '../helpers/DateRange';

export default class TimeGraphCard extends React.Component {

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  renderChart(range) {
    if (!range)
      range = this.props.range;

    var opts = {
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
    };

    var startDate = range.getStartDate();
    var endDate = range.getEndDate() || moment().startOf('day');

    //this might break at daylight savings time?
    if (startDate)
      startDate.subtract(16, 'hour');
    endDate.add(8, 'hour');

    opts.xaxis.min = startDate ? startDate.valueOf() : null;
    opts.xaxis.max = endDate.valueOf();

    if (this.props.data) {
      var chartDiv = $(this.refs.chart);
      $.plot(chartDiv, this.props.data, opts);
    }
  }
  
  render() {
    const isLoading = this.props.data == null;

    return (
      <div className="card card-inverse">
        <div className="card-block">
          <button type="button" className="btn btn-secondary-outline btn-sm pull-right" onClick={this.props.refresh}>
            <i className="fa fa-refresh"></i>
          </button>
          <h4 className="card-title">{this.props.title}</h4>
          { isLoading
            ? <div key="spinner" style={{height: '200px', paddingTop: '70px'}} className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-3x" /></div>
            : <div key="chart" ref="chart" style={{height: '200px'}}></div>
          }
        </div>
      </div>
    );
  }
}

TimeGraphCard.defaultProps = { colors: {} }
