import AbstractView from "./abstract";

const createFilterItemTemplate = ({title, count}, isChecked) =>
  ` <input
    type="radio"
    id="filter__${title}"
    class="filter__input visually-hidden"
    name="filter"
    ${isChecked ? `checked` : ``}
    ${count === 0 ? `disabled` : ``}
  />
  <label for="filter__${title}" class="filter__label">
      ${title} <span class="filter__${title}-count">${count}</span></label
    >`;

export default class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  _getTemplate() {
    return this._createTemplate(this._filters);
  }

  _createTemplate(filterItems) {
    const filterItemsTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join(``);
    return (
      `<section class="main__filter filter container">
      ${filterItemsTemplate}
    </section>`);
  }
}
