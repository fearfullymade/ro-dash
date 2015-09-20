
var TopNav = React.createClass({
  render: function () {
    return (
      <nav className="navbar navbar-dark bg-inverse">
        <a className="navbar-brand" href="#">ReachOut Dashboard</a>
      </nav>
    );
  }
});

var TimeGraphCard = React.createClass({
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
    this.refreshData();
  },

  componentDidUpdate: function () {
    if (!this.state.refreshing && this.state.chartData) {
      var chartDiv = React.findDOMNode(this.refs.chart);
      $.plot(chartDiv, this.state.chartData, this.state.flotOptions);
    }
  },

  refreshData: function () {
    if (this.props.src) {
      this.setState({
        refreshing: true
      });

      $.getJSON(this.props.src, function (result) {
        var data = []; 

        for (var s in result) {
          data.push({
            label: s,
            data: result[s]
          });
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

var PieCard = React.createClass({
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

  refreshData: function () {
    if (this.props.src) {
      this.setState({
        refreshing: true
      });

      $.getJSON(this.props.src, function (result) {
        var data = []; 

        for (var i = 0; i < result[0].length; i++) {
          data.push({
            label: result[0][i][0],
            data: result[0][i][1]
          });
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

var ListCard = React.createClass({
  getInitialState: function () {
    return {
      refreshing: false,
      listData: []
    };
  },

  componentDidMount: function () {
    $.getJSON('/api/users', function (result) {
      var users = { };

      for (var i = 0; i < result.length; i++)
        users[result[i]._id] = result[i].name;

      if (this.isMounted()) {
        this.setState({
          users: users
        });
    
        this.refreshData();
      }
    }.bind(this));
  },

  refreshData: function () {
    if (this.props.src) {
      this.setState({
        refreshing: true
      });

      $.getJSON(this.props.src, function (result) {
        if (this.isMounted()) {
          this.setState({
            refreshing: false,
            listData: result[0]
          });
        }
      }.bind(this));
    }
  },

  handleRefreshClick: function (e) {
    this.refreshData();
  },

  render: function () {
    var users = this.state.users;

    var total = this.state.listData.reduce(function (t, item) { return t + item[1]; }, 0);

    return (
      <div className="card card-inverse">
        <div className="card-block">
          <button type="button" className="btn btn-secondary-outline btn-sm pull-right" onClick={this.handleRefreshClick}>
            <i className="fa fa-refresh"></i>
          </button>
          <h4 className="card-title">{this.props.title}</h4>
        </div>
        { this.state.refreshing 
          ? <div key="spinner" style={{height: '100px', paddingTop: '20px'}} className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-3x" /></div>
          : <ul className="list-group list-group-flush">
              {this.state.listData.map(function (item) {
                var percent =  100 * item[1] / total;

                return (
                  <li key={item[0]} className="list-group-item" style={{background: 'linear-gradient(to right, #444 '+percent+'%, #373a3c '+percent+'%)'}}>
                    <span className="pull-right">{item[1]}</span>
                    {users[item[0]]}
                  </li>
                );
              })}
            </ul>
        }
      </div>
    );
  }
});

var Layout = React.createClass({
  render: function () {
    return (
      <div style={{marginTop:'30px'}}>
        <div className="row">
          <div className="col-lg-8">
            <TimeGraphCard title="Total Activity" src="/api/metric/date/total?split=isTrial" />
            <TimeGraphCard title="Active Users" src="/api/metric/date/count?group=userId&split=isTrial&userId!=null" />
          </div>
          <div className="col-lg-4">
            <ListCard title="Top Users" src="/api/metric/userId/total?userId!=null&sort=-total" />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <PieCard title="Response Code" src="/api/metric/responseCode/total" />
          </div>
          <div className="col-sm-4">
            <PieCard title="Method" src="/api/metric/method/total" />
          </div>
        </div>
      </div>
    );
  }
});

var DashApp = React.createClass({
  render: function () {
    return (
      <div className="container-fluid">
        <TopNav />
        <Layout />
      </div>
    );
  }
});

React.render(<DashApp></DashApp>, document.getElementById('dash-app'));
