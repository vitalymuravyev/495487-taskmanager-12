import AbstractView from "./abstract";

export default class Board extends AbstractView {

  _getTemplate() {
    return `<section class="board container"></section>`;
  }
}
