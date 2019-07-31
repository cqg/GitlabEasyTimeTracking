/**
 * @file Functions to communicate with GitLab API
 */

function makeRequest(method, url, token) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();

    request.open(method, url, true);
    request.setRequestHeader("PRIVATE-TOKEN", token);

    request.onloadend = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(request);
      } else {
        reject({
          status: request.status,
          statusText: request.statusText
        });
      }
    };

    request.send();
  });
}

function getNextRequest(method, token, linkHeader) {
  if (!linkHeader) return null;

  const nextLink = linkHeader
    .split(", ")
    .map(linkText => linkText.split("; "))
    .find(linkPair => linkPair[1] == 'rel="next"');
  if (!nextLink) return null;
  const nextUrl = nextLink[0].slice(1, -1);

  return makeRequest(method, nextUrl, token);
}

function getApiRootUrl(hostname) {
  return new URL("api/v4", hostname).href;
}

function getMergeRequestPath(projectId, mergeRequestId) {
  return `/projects/${encodeURIComponent(
    projectId
  )}/merge_requests/${mergeRequestId}`;
}

export function logWorkTime(
  hostname,
  token,
  projectId,
  mergeRequestId,
  spentTime
) {
  const url = `${getApiRootUrl(hostname)}${getMergeRequestPath(
    projectId,
    mergeRequestId
  )}/add_spent_time?duration=${spentTime}s`;
  return makeRequest("POST", url, token).then(request => request.response);
}

export function requestUserId(hostname, token) {
  const url = `${getApiRootUrl(hostname)}/user`;
  return makeRequest("GET", url, token).then(
    request => JSON.parse(request.response).id
  );
}

export function requestNotes(hostname, token, projectId, mergeRequestId) {
  const onNotesLoad = request => {
    const notes = JSON.parse(request.response);
    const nextRequest = getNextRequest(
      "GET",
      token,
      request.getResponseHeader("link")
    );
    if (!nextRequest) return { notes };
    return {
      nextRequest: nextRequest.then(onNotesLoad),
      notes
    };
  };

  const url = `${getApiRootUrl(hostname)}${getMergeRequestPath(
    projectId,
    mergeRequestId
  )}/notes?sort=asc&per_page=50`;
  return makeRequest("GET", url, token).then(onNotesLoad);
}

export function requestMergeRequestName(
  hostname,
  token,
  projectId,
  mergeRequestId
) {
  const url =
    getApiRootUrl(hostname) + getMergeRequestPath(projectId, mergeRequestId);
  return makeRequest("GET", url, token).then(
    request => JSON.parse(request.response).title
  );
}
