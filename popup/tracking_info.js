
function logWorkTime(jiraId, spentTime) {
  console.log("spent " + spentTime + " on " + jiraId);
}

function startTimer() {
  return new Date()
}

function stopTimer(start) {
  let end= new Date();
  let diff = end - start;
  let seconds = Math.round(diff / 1000);
  return seconds
}

function updateIcons(started, timer) {
  if (started) {
    timer.className = "timer-button stop"
    browser.browserAction.setIcon({path: "../icons/stop.svg"});
  }
  else {
    timer.className = "timer-button start"
    browser.browserAction.setIcon({path: "../icons/play.svg"});
  }
}

function onError(error) {
  console.log(error);
}

function onTimerClick(target, startTime) {
  if (startTime) {
    let spent = stopTimer(startTime);
    startTime = false;
    logWorkTime(document.getElementById("jira-id").value, spent);
  }
  else {
    startTime = startTimer();
  }
  browser.storage.local.set({
    startTime: startTime
  }).then(function() { updateIcons(startTime, target); }, onError);
}

function init(startTime) {
  let timer = document.getElementById("timer");
  timer.addEventListener("click", e => browser.storage.local.get("startTime").then(item => onTimerClick(e.target, item.startTime), onError), false);
  updateIcons(startTime, timer);
}

browser.storage.local.get("startTime").then(item => init(item.startTime), onError);

