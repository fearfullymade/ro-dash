import React from 'react';
import * as cardTypes from '../constants/CardTypes';

export default class CardSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  onValueChange(field, event) {
    this.props.updateConfig(this.props.config.id, { [field]: event.target.value });
  }

  toTitleCase(str)
  {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  render() {
    return (
      <div className="card card-inverse">
        <div className="card-block">
          <form>
            <fieldset className="form-group">
              <label htmlFor="titleField">Title</label>
              <input type="text" className="form-control" id="titleField" placeholder="Enter a title for this card" value={this.props.config.title} onChange={this.onValueChange.bind(this, 'title')} />
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="typeField">Type</label>
              <select className="form-control" id="typeField" value={this.props.config.type} onChange={this.onValueChange.bind(this, 'type')}>
                <option value={cardTypes.TIME_GRAPH}>Time Graph</option>
                <option value={cardTypes.PIE}>Pie Chart</option>
                <option value={cardTypes.LIST}>List</option>
              </select>
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="srcField">Data Source</label>
              <input type="text" className="form-control" id="srcField" placeholder="Enter url to retrieve data" value={this.props.config.src} onChange={this.onValueChange.bind(this, 'src')} />
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="mapxField">Labels</label>
              <select className="form-control" id="mapxField" value={this.props.config.mapX} onChange={this.onValueChange.bind(this, 'mapX')}>
                <option value="">Default</option>
                { this.props.lookupTypes.map(x => <option key={x} value={x}>{this.toTitleCase(x)}</option>) }
              </select>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}
