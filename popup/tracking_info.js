
hostname = ""
token = ""

function fillGitlabInfo(info) {
  hostname = info.hostname;
  token = info.token;
}

function reqListener() {
  console.log(this.responseText);
}

function logWorkTime(projectId, mergeRequestId, spentTime) {
  let request = new XMLHttpRequest();
  let params = "duration=" + spentTime + "s";
  let path = "/api/v4/projects/" + encodeURIComponent(projectId) + "/merge_requests/" + mergeRequestId + "/add_spent_time";
  console.log(hostname + path);
  console.log(params);

  request.addEventListener("load", reqListener);
  request.open("POST", hostname + path + '?' + params, true);
  request.setRequestHeader("PRIVATE-TOKEN", token);
  request.send();
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

function getPathFromUrl(url) {
   let pattern = RegExp("://[\.a-zA-Z]*(/.*)\?");
   let matches = url.match(pattern);
   return matches[1];
}

function getProjectFromPath(path) {
   let elems = path.split("/");
   if (elems.length > 2) {
      return elems[1] + '/' + elems[2];
   }
   return "";
}

function getMergeRequestIdFromPath(path) {
   let elems = path.split("/");
   if (elems.length > 4 && elems[3] == "merge_requests") {
      return elems[4];
   }
   return "";
}

function initializeDataFromPage(data) {
  chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    let path = getPathFromUrl(tabs[0].url);
    data.project = getProjectFromPath(path);
    data.mergeRequestId = getMergeRequestIdFromPath(path);
    updateData(data);
  });
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

  if (!data.startTime) {
    initializeDataFromPage(data)
  }
  else {
    updateInterface(data);
  }
}

browser.storage.local.get(null).then(data => init(data), onError);
browser.storage.sync.get(["token", "hostname"]).then(fillGitlabInfo, onError);

