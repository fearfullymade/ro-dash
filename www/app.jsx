var DateRange = function DateRange(val) {
  function BuildGetter(val) {
    if (val.startsWith('-') || val.startsWith('+')) {
      var num = val.substring(0, val.length - 1);
      var type = val.substring(val.length - 1);

      return function () {
        return moment().startOf('day').add(num, type);
      };
    }
  }

  this.getId = function () { return val; };

  if (val == 'all') {
    this.getStartDate = function () { return null; };
    this.getEndDate = function () { return null; };
  }
  else {
    var parts = val.split(',');

    var start = parts[0];
    var end = parts.length > 1 ? parts[1] : '-0d';

    this.getStartDate = BuildGetter(start);
    this.getEndDate = BuildGetter(end);
  }
  /*this.getStartDate = function () {
    if (val == 'all')
      return null;

    var today = moment().startOf('day');

    switch (val) {
      case '-30d':
        return today.subtract(30, 'days');
    }
  };

  this.getEndDate = function () {
    if (val == 'all')
      return null;

    return moment().startOf('day');
  };*/
};

DateRange.areSame = function (r1, r2) {
  if (!r1 && !r2)
    return true;

  if (!r1 || !r2)
    return false;

  return r1.getId() == r2.getId();
};

var DateRangePicker = React.createClass({
  getInitialState: function () {
    return {
      isOpen: false
    };
  },

  handleMainButtonClick: function (event) {
    this.setState({
      isOpen: !this.state.isOpen
    });
  },

  handlePresetClick: function (rangeId, event) {
    var range = new DateRange(rangeId);

    this.setState({
      isOpen: !this.state.isOpen
    });

    if (!DateRange.areSame(this.props.range, range))
      this.props.onChange(range);
  },

  render: function () {
    var classes = this.state.isOpen ? 'btn-group open' : 'btn-group';

    var currentRange = '';

    if (this.props.current) {
      if (this.props.current.getId() == 'all')
        currentRange = <span>All Time</span>;
      else
        currentRange = <span>{this.props.current.getStartDate().format("YYYY-MM-DD")} &ndash; {this.props.current.getEndDate().format("YYYY-MM-DD")}</span>;
    }

    return (
      <div className={classes}>
        <button type="button" className="btn btn-secondary-outline" onClick={this.handleMainButtonClick}>
          <i className="fa fa-calendar-o" /> {currentRange}
        </button>
        <div className="dropdown-menu dropdown-menu-right">
          <a className="dropdown-item" href="#" onClick={this.handlePresetClick.bind(null, 'all')}>All Time</a>
          <a className="dropdown-item" href="#" onClick={this.handlePresetClick.bind(null, '-0d')}>Today</a>
          <a className="dropdown-item" href="#" onClick={this.handlePresetClick.bind(null, '-30d')}>Last 30 days</a>
        </div>
      </div>
    );
  }
});

var TopNav = React.createClass({
  render: function () {
    return (
      <nav className="navbar navbar-dark bg-inverse">
        <a className="navbar-brand" href="#">ReachOut Dashboard</a>
        <div className="pull-right">
          <DateRangePicker onChange={this.props.handleDateRangeChange} current={this.props.dateRange} />
        </div>
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

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.src != this.props.src || !DateRange.areSame(nextProps.range, this.props.range))
      this.refreshData(nextProps.src, nextProps.range);
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
            <TimeGraphCard title="Total Activity" range={this.props.dateRange} src="/api/metric/date/total?split=isTrial" />
            <TimeGraphCard title="Active Users" range={this.props.dateRange} src="/api/metric/date/count?group=userId&split=isTrial&userId!=null" />
          </div>
          <div className="col-lg-4">
            <ListCard title="Top Users" range={this.props.dateRange} src="/api/metric/userId/total?userId!=null&sort=-total" />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <PieCard title="Response Code" range={this.props.dateRange} src="/api/metric/responseCode/total" />
          </div>
          <div className="col-sm-4">
            <PieCard title="Method" range={this.props.dateRange} src="/api/metric/method/total" />
          </div>
        </div>
      </div>
    );
  }
});

var DashApp = React.createClass({
  getInitialState: function () {
    return {
      dateRange: new DateRange('all')
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

React.render(<DashApp></DashApp>, document.getElementById('dash-app'));
