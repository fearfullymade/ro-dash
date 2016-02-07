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
      //}
    }.bind(this));
  }

  render() {
    var mapX = this.props.mapX;
    var users = this.state.users;

    var total = !this.props.data ? 0 : this.props.data.reduce(function (t, item) { return t + item[1]; }, 0);

    const isLoading = this.props.data == null;

    return (
      <div className="card card-inverse">
        <div className="card-block">
          <button type="button" className="btn btn-secondary-outline btn-sm pull-right" onClick={this.props.refresh}>
            <i className="fa fa-refresh"></i>
          </button>
          <h4 className="card-title">{this.props.title}</h4>
        </div>
        { isLoading
          ? <div key="spinner" style={{height: '100px', paddingTop: '20px'}} className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-3x" /></div>
          : <ul className="list-group list-group-flush">
              {this.props.data.map(function (item) {
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
