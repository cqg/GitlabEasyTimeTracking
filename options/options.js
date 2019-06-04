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

