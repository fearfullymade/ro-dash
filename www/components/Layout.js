import React from 'react';
import * as cards from '../containers/card';
import * as cardTypes from '../constants/CardTypes';
import CardSettings from './CardSettings';
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

      if (this.props.appState.configMode) {
        component = <CardSettings config={cardConfig} updateConfig={this.props.updateCardConfig} lookupTypes={this.props.lookupData.keySeq()} />;
      }
      else {
        let props = {
          id: item.cardId,
          range: this.props.appState.dateRange
        };

        props[cardConfig.mapX] = this.props.lookupData.get(cardConfig.mapX);

        switch (cardConfig.type) {
          case cardTypes.TIME_GRAPH: component = <cards.TimeGraph {...props} />; break;
          case cardTypes.LIST: component = <cards.List {...props} />; break;
          case cardTypes.PIE: component = <cards.Pie {...props} />; break;
        }
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
