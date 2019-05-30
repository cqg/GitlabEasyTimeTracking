
function logWorkTime(projectId, mergeRequestId, spentTime) {
  // TODO: do URL encoding of projectId and send it via API
  console.log("spent " + spentTime + " on " + projectId + ": " + mergeRequestId);
}

function startTimer() {
  return new Date();
}

function stopTimer(start) {
  let end= new Date();
  let diff = end - start;
  let seconds = Math.round(diff / 1000);
  return seconds;
}

function updateIcons(started, timer) {
  if (started) {
    timer.className = "timer-button stop";
    browser.browserAction.setIcon({path: "../icons/stop.svg"});
  }
  else {
    timer.className = "timer-button start";
    browser.browserAction.setIcon({path: "../icons/play.svg"});
  }
}

function updateInterface(data) {
  let timer = document.getElementById("timer");
  updateIcons(data.startTime, timer);
  
  let projectEdit = document.getElementById("project-id");
  if (data.project != undefined) {
    projectEdit.value = data.project;
  }

  let mergeRequestEdit = document.getElementById("merge-request-id");
  if (data.mergeRequestId != undefined) {
    mergeRequestEdit.value = data.mergeRequestId;
  }
}

function initializeDataFromPage(data) {
  if (!data.startTime) {
    // TODO: initialize
    data.project = "";
    data.mergeRequestId = "";
  }
  return data;
}

function retrieveDataFromInterface(data) {
  let projectEdit = document.getElementById("project-id");
  let mergeRequestEdit = document.getElementById("merge-request-id");

  data.project = projectEdit.value;
  data.mergeRequestId = mergeRequestEdit.value;
  return data;
}

function onError(error) {
  console.log(error);
}

function updateData(data) {
  browser.storage.local.set(data).then(function() { updateInterface(data); }, onError);
}

function onTimerClick(target, data) {
  if (data.startTime) {
    let spent = stopTimer(data.startTime);
    data.startTime = false;
    logWorkTime(data.project, data.mergeRequestId, spent);
  }
  else {
    data = retrieveDataFromInterface(data);
    data.startTime = startTimer();
  }
  updateData(data);
}

function init(data) {
  let timer = document.getElementById("timer");
  timer.addEventListener("click", e => browser.storage.local.get(null).then(data => onTimerClick(e.target, data), onError), false);

  updateData(initializeDataFromPage(data))
}

browser.storage.local.get(null).then(data => init(data), onError);

