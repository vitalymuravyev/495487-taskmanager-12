import AbstractView from "./abstract";
import {SortType} from "../const";

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  _getTemplate() {
    return this._createTemplate(this._currentSortType);
  }

  _createTemplate(currentSortType) {
    return (
      `<div class="board__filter-list">
        <a href="#" class="board__filter ${currentSortType === SortType.DEFAULT ? `board__filter--active` : ``}" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
        <a href="#" class="board__filter ${currentSortType === SortType.DATE_UP ? `board__filter--active` : ``}" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
        <a href="#" class="board__filter ${currentSortType === SortType.DATE_DOWN ? `board__filter--active` : ``}" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
      </div>`
    );
  }

  _onSortTypeChange(evt) {

    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setOnSortTypeChange(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._onSortTypeChange);
  }
}
