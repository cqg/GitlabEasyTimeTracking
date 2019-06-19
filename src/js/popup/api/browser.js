export function retrieveTimerData(onSuccess, onError) {
  browser.storage.local.get(null).then(onSuccess, onError);
}

export function storeTimerData(data, onSuccess, onError) {
  browser.storage.local.set(data).then(onSuccess, onError);
}

export function retrieveSettings(onSuccess, onError) {
  browser.storage.sync.get(["token", "hostname"]).then(onSuccess, onError);
}

export function retrievePageUrl(onSuccess, onError) {
  browser.tabs.query({active:true,currentWindow:true}).then((tabs) => onSuccess(tabs[0].url), onError);
}

