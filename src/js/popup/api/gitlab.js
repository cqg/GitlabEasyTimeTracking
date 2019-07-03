function makeRequest(method, url, token) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();

    request.open(method, url, true);
    request.setRequestHeader("PRIVATE-TOKEN", token);

    request.onloadend = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(request.response);
      }
      else {
        reject({
          status: request.status,
          statusText: request.statusText
        });
      }
    }

    request.send();
  });
}

function getApiRootUrl(hostname) {
  return `${hostname}/api/v4`;
}

function getMergeRequestPath(projectId, mergeRequestId) {
  return `/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestId}`;
}

export function logWorkTime(hostname, token, projectId, mergeRequestId, spentTime) {
  const url = getApiRootUrl(hostname) + getMergeRequestPath(projectId, mergeRequestId) + `/add_spent_time?duration=${spentTime}s`;
  return makeRequest('POST', url, token);
}

