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
      let cardConfig = this.props.cardConfig.get(item.cardId);

      let props = {
        id: item.cardId,
        range: this.props.dateRange
      };

      props[cardConfig.mapX] = this.props.lookupData.get(cardConfig.mapX);

      switch (cardConfig.type) {
        case 'TimeGraph': component = <cards.TimeGraph {...props} />; break;
        case 'List': component = <cards.List {...props} />; break;
        case 'Pie': component = <cards.Pie {...props} />; break;
      }
    }

    return <div key={this.keyId++} className={item.width}>{component}</div>;
  }

  render() {
    this.keyId = 0;
    var ctrls = this.buildItem(this.props.layout);

    return (
      <div style={{marginTop:'30px'}}>
        <div className="row">
          {ctrls}
        </div>
      </div>
    );
  }
}
