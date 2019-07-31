/**
 * @file Contains functions to parse data from GitLab
 */

function sum(x, y) {
  return x + y;
}

function parseTimeElement(element) {
  if (element.endsWith('mo'))return parseInt(element) * 60 * 60 * 8 * 5 * 4;
  if (element.endsWith('w')) return parseInt(element) * 60 * 60 * 8 * 5;
  if (element.endsWith('d')) return parseInt(element) * 60 * 60 * 8;
  if (element.endsWith('h')) return parseInt(element) * 60 * 60;
  if (element.endsWith('m')) return parseInt(element) * 60;
  if (element.endsWith('s')) return parseInt(element);
  return 0;
}

function parseGitlabTime(text) {
  return text.split(' ').map(parseTimeElement).reduce(sum, 0);
}

function getMiddleString(text, prefix, suffix) {
  return text.substring(prefix.length, text.indexOf(suffix));
}

const addedTime = 'added ';
const removedTime = 'subtracted ';
const timeSuffix = ' of time spent';

function timeFromComment(text) {
  if (text.startsWith(addedTime)) {
    return parseGitlabTime(getMiddleString(text, addedTime, timeSuffix));
  }
  else if (text.startsWith(removedTime)) {
    return -parseGitlabTime(getMiddleString(text, removedTime, timeSuffix));
  }
}

export function calculateSpentTime(notes, userId) {
  return notes
    .filter(note => note.author.id == userId)
    .map(note => note.body)
    .filter(text => text.includes(timeSuffix))
    .map(timeFromComment)
    .reduce(sum, 0);
}

