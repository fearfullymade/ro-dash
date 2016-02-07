import React from 'react';
import * as cards from '../containers/card';
import DateRange from '../helpers/DateRange';
import { collectCardIds } from '../helpers/layout';

export default class Layout extends React.Component {
  constructor() {
    super();
    this.keyId = 0;
  }

  buildItem(item) {
    let component = null;

    if (item.children) {
      component = (
        <div className="row">
          { item.children.map(this.buildItem, this) }
        </div>
      );
    }
    else {
      switch (this.props.cardConfig[item.cardId].type) {
        case 'TimeGraph': component = <cards.TimeGraph id={item.cardId} range={this.props.dateRange} />; break;
        case 'List': component = <cards.List id={item.cardId} range={this.props.dateRange} />; break;
        case 'Pie': component = <cards.Pie id={item.cardId} range={this.props.dateRange} />; break;
      }
    }

    let size = item.size || 'col-lg-12';

    return <div key={this.keyId++} className={size}>{component}</div>;
  }

  render() {
    this.keyId = 0;
    var ctrls = this.props.layout.map(this.buildItem, this);

    return (
      <div style={{marginTop:'30px'}}>
        <div className="row">
          {ctrls}
        </div>
      </div>
    );
  }
}
