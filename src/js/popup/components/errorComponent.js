/**
 * @file Component shows errors to the user
 */

export default class ErrorComponent {
  constructor() {
    this._errorText = document.querySelector("#errorText");
  }

  update(errorState) {
    this._errorText.innerText = errorState.text;
    this._errorText.style.display = errorState.text ? "" : "none";
  }
}
