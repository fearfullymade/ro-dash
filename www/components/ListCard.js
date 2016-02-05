import React from 'react';
import DateRange from '../helpers/DateRange';

export default class ListCard extends React.Component {
  constructor() {
    super();

    this.state = {
      refreshing: false,
      listData: []
    };
  }

  componentDidMount() {
    $.getJSON('/api/users', function (result) {
      var users = { };

      for (var i = 0; i < result.length; i++)
        users[result[i]._id] = result[i].name;

      //if (this.isMounted()) {
        this.setState({
          users: users
        });
    
        this.refreshData();
      //}
    }.bind(this));
  }

  refreshData(src, range) {
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
        //if (this.isMounted()) {
          this.setState({
            refreshing: false,
            listData: result[0]
          });
        //}
      }.bind(this));
    }
  }

  handleRefreshClick(e) {
    this.refreshData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src != this.props.src || !DateRange.areSame(nextProps.range, this.props.range))
      this.refreshData(nextProps.src, nextProps.range);
  }

  render() {
    var mapX = this.props.mapX;
    var users = this.state.users;

    var total = this.state.listData.reduce(function (t, item) { return t + item[1]; }, 0);

    return (
      <div className="card card-inverse">
        <div className="card-block">
          <button type="button" className="btn btn-secondary-outline btn-sm pull-right" onClick={::this.handleRefreshClick}>
            <i className="fa fa-refresh"></i>
          </button>
          <h4 className="card-title">{this.props.title}</h4>
        </div>
        { this.state.refreshing 
          ? <div key="spinner" style={{height: '100px', paddingTop: '20px'}} className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-3x" /></div>
          : <ul className="list-group list-group-flush">
              {this.state.listData.map(function (item) {
                var percent =  100 * item[1] / total;

                var display = item[0];

                if (mapX == 'user')
                  display = users[item[0]];

                return (
                  <li key={item[0]} className="list-group-item" style={{background: 'linear-gradient(to right, #444 '+percent+'%, #373a3c '+percent+'%)'}}>
                    <span className="pull-right">{item[1]}</span>
                    {display}
                  </li>
                );
              })}
            </ul>
        }
      </div>
    );
  }
}
