
export function collectCardIds(layout) {
  let cardIds = [];

  let searchFn = (item) => {
    if (item.cardId)
      cardIds.push(item.cardId);
    else if (item.children)
      item.children.map(searchFn);
  };

  layout.map(searchFn);

  return cardIds;
}

