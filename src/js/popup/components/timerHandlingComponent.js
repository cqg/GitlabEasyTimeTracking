/**
 * @file Defines TimerHandlingComponent, which manages a timer.
 */
import imgStart from "../../../img/start-gray-16.png";
import imgStop from "../../../img/stop-red-16.png";


export default class TimerHandlingComponent {
  constructor() {
    this._timerTogglerElement = document.querySelector("#timerToggler");
    this._timerTogglerElement.addEventListener("click", () =>
      this._onTimerToggled()
    );

    this._cancelTrackingElement = document.querySelector("#cancelTracking");
    this._cancelTrackingElement.addEventListener("click", () =>
      this._onTimerCancelled()
    );
  }

  updateView(isStarted) {
    if (isStarted) {
      this._timerTogglerElement.classList.replace("btn-primary", "btn-danger");
      this._timerTogglerElement.innerText = "Stop Tracking";
      browser.browserAction.setIcon({ path: imgStop });
      browser.browserAction.setTitle({ title: "Recording" });
    } else {
      this._timerTogglerElement.classList.replace("btn-danger", "btn-primary");
      this._timerTogglerElement.innerText = "Start Tracking";
      browser.browserAction.setIcon({ path: imgStart });
      browser.browserAction.setTitle({ title: "Start tracking" });
    }
  }

  _onTimerToggled() {
    const isStarted = this._timerTogglerElement.classList.contains(
      "btn-primary"
    );
    this.updateView(isStarted);

    let event = new CustomEvent("onTimerToggled", {
      detail: {
        isStarted: isStarted
      },
      bubbles: true
    });
    this._timerTogglerElement.dispatchEvent(event);
  }

  _onTimerCancelled() {
    let event = new CustomEvent("onTimerCancelled", {
      bubbles: true
    });
    this._cancelTrackingElement.dispatchEvent(event);
  }
}
