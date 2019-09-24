/**
 * @file Main file for add-on options
 */

import "../css/options.css";
import "../css/lib/bootstrap.min.css";

import "../img/start-black-16.png";
import "../img/start-black-48.png";
import "../img/start-black-96.png";
import "../img/start-black-128.png";

class Options {
  constructor() {
    document.addEventListener("DOMContentLoaded", () => this._restoreOptions);
    const form = document.getElementsByClassName("options-container")[0];
    form.addEventListener("submit", e => this._saveOptions(e));
    this._statusElement = document.querySelector("#status");
  }

  async _saveOptions(e) {
    e.preventDefault();
    try {
      await browser.storage.sync.set({
        token: document.querySelector("#token").value,
        hostname: document.querySelector("#hostname").value
      });
      this._setStatusOk();
    } catch (error) {
      this._setStatusError(`Settings cannot be saved: ${error.toString()}`);
    }
  }

  async _restoreOptions() {
    try {
      var result = await browser.storage.sync.get(["token", "hostname"]);
      document.querySelector("#token").value = result.token || "";
      document.querySelector("#hostname").value = result.hostname || "";
    } catch (error) {
      this._setStatusError(`Settings cannot be retrieved: ${error.toString()}`);
    }
  }

  _setStatusOk() {
    this._setStatus("Saved!", true);
  }

  _setStatusError(errorText) {
    this._setStatus(errorText, false);
  }

  _setStatus(message, isSuccess) {
    this._statusElement.style.visibility = "visible";
    this._statusElement.textContent = message;

    if (isSuccess) {
      this._statusElement.classList.replace("alert-danger", "alert-success");
    } else {
      this._statusElement.classList.replace("alert-success", "alert-danger");
    }
    setTimeout(() => (this._statusElement.style.visibility = "collapse"), 1000);
  }
}

new Options();
