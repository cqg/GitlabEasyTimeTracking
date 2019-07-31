/**
 * @file Functions to communicate with browser API
 */

export function retrieveTimerData() {
  return browser.storage.local.get(null);
}

export function storeTimerData(data) {
  return browser.storage.local.set(data);
}

export function retrieveSettings() {
  return browser.storage.sync.get(["token", "hostname"]);
}

export function retrievePageUrl() {
  return browser.tabs.query({active:true,currentWindow:true}).then((tabs) => tabs[0].url);
}

