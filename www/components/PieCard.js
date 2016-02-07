import React from 'react';
import DateRange from '../helpers/DateRange';

export default class PieCard extends React.Component {
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  renderChart() {
    let flotOptions = {
      series: {
        pie: {
          show: true
        }
      }
    };

    if (this.props.data && this.props.data.length > 0) {
      var chartDiv = $(this.refs.chart);
      $.plot(chartDiv, this.props.data, flotOptions);
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

PieCard.defaultProps = { colors: {} }
