/**
 * @file Defines MergeRequestSelectComponent, which allows displaying and changing a merge request for review.
 */

export default class MergeRequestSelectComponent {
  constructor(store) {
    this._store = store;
    this._rootContainerElement = document.querySelector(
      "#mergeRequestContainer"
    );
    this._displayContainerElement = document.querySelector(
      "#mergeRequestDisplayContainer"
    );
    this._changeContainerElement = document.querySelector(
      "#mergeRequestChangeContainer"
    );
    this._displayNameElement = document.querySelector(
      "#mergeRequestNameDisplay"
    );
    this._displayNameElement.addEventListener("click", () =>
      this._switchToEditMode()
    );
    this.saveMergeRequestChangeElement = document.querySelector(
      "#saveMergeRequestChange"
    );
    this.saveMergeRequestChangeElement.addEventListener("click", () =>
      this._onSaveMergeRequestChange()
    );
    this.discardMergeRequestChange = document.querySelector(
      "#discardMergeRequestChange"
    );
    this.discardMergeRequestChange.addEventListener("click", () =>
      this._switchToDisplayMode()
    );
  }

  setMergeRequestName(mergeRequestName) {
    this._displayNameElement.innerText = mergeRequestName;
  }

  _onSaveMergeRequestChange() {
    const input = document.querySelector("#mergeRequestIdChange");
    const mergeRequestId = input.value;

    let event = new CustomEvent("onMergeRequestChanged", {
      detail: { mergeRequestId },
      bubbles: true
    });
    input.dispatchEvent(event);
    this._switchToDisplayMode();
  }

  _switchToEditMode() {
    this._changeContainerElement.style.display = "";
    this._rootContainerElement.replaceChild(
      this._changeContainerElement,
      this._displayContainerElement
    );
    document.querySelector(
      "#mergeRequestIdChange"
    ).value = this._store.getState().mrInfo.mergeRequestId;
  }

  _switchToDisplayMode() {
    this._rootContainerElement.replaceChild(
      this._displayContainerElement,
      this._changeContainerElement
    );
    this._changeContainerElement.style.display = "none";
  }
}
