# Gitlab Easy Time Tracker

Time tracking browser add-on for merge requests in GitLab

[![Build Status](https://travis-ci.org/cqg/GitlabEasyTimeTracking.svg?branch=master)](https://travis-ci.org/cqg/GitlabEasyTimeTracking)

## Installation

[<img src="https://addons.cdn.mozilla.net/static/img/addons-buttons/AMO-button_1.png" align="left" alt="for Firefox">](https://addons.mozilla.org/ru/firefox/addon/gitlabeasytimetracking)
[<img src="https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png" alt="for Chrome">](
https://chrome.google.com/webstore/detail/gitlab-easy-time-tracker/gmadafiegfmbmbkjpmbkillmnbdloiln)

###  How to set it up for your GitLab server

#### Token generation

1. Go to your account settings in GitLab and open "Access Tokens" page.
1. Add a personal access token with "api" scope.

#### Add-on settings

1. Open extension options.
1. Enter your GitLab server hostname to "GitLab host" , for example: "https://gitlab.com"
1. Enter generated API token to "GitLab token".

## Usage

1. Open merge request page.
1. Click on add-on icon. Edit boxes in popup shall be filled with repository and merge request id.
1. Click on start button.
1. To end time tracking click on stop button.

The time shall be added to selected merge request
