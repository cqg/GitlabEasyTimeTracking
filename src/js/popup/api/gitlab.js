function reqListener() {
  console.log(this.responseText);
}

export function logWorkTime(hostname, token, projectId, mergeRequestId, spentTime) {
  let request = new XMLHttpRequest();
  let params = "duration=" + spentTime + "s";
  let path = "/api/v4/projects/" + encodeURIComponent(projectId) + "/merge_requests/" + mergeRequestId + "/add_spent_time";
  console.log(hostname + path, params);

  request.addEventListener("load", reqListener);
  request.open("POST", hostname + path + '?' + params, true);
  request.setRequestHeader("PRIVATE-TOKEN", token);
  request.send();
}

