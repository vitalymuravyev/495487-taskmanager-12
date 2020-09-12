import AbstractView from "./abstract";

const createFilterItemTemplate = ({type, name, count}, currentFilterType) =>
  ` <input
    type="radio"
    id="filter__${name}"
    class="filter__input visually-hidden"
    name="filter"
    ${type === currentFilterType ? `checked` : ``}
    ${count === 0 ? `disabled` : ``}
    value="${type}"
  />
  <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span></label
    >`;

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
  }

  _getTemplate() {
    return this._createTemplate(this._filters, this._currentFilterType);
  }

  _createTemplate(filterItems, currentFilterType) {
    const filterItemsTemplate = filterItems.map((filter) =>
      createFilterItemTemplate(filter, currentFilterType)).join(``);
    return (
      `<section class="main__filter filter container">
      ${filterItemsTemplate}
    </section>`);
  }

  _onFilterTypeChange(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setOnFilterTypeChange(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._onFilterTypeChange);
  }
}
