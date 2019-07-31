/**
 * @file Main file for add-on options
 */

import "../css/options.css";
import '../css/bootstrap.min.css';

import '../img/start-black-16.png';
import '../img/start-black-48.png';
import '../img/start-black-96.png';
import '../img/start-black-128.png';

function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    token: document.querySelector("#token").value,
    hostname: document.querySelector("#hostname").value
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#token").value = result.token || "";
    document.querySelector("#hostname").value = result.hostname || "";
  }

  function onError(error) {
    console.log(error);
  }

  browser.storage.sync.get(["token", "hostname"]).then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
