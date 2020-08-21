import AbstractView from "./abstract";

export default class LoadMoreButton extends AbstractView {
  _getTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }

}
