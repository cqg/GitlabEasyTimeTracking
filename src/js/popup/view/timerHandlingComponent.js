/**
 * @file Defines TimerHandlingComponent, which manages a timer.
 */

export default class TimerHandlingComponent {

    constructor(){
        this._timerTogglerElement = document.getElementById("timerToggler");
        this._timerTogglerElement.addEventListener("click", () => this._onTimerToggled());

        this._cancelTrackingElement = document.getElementById("cancelTracking");
        this._cancelTrackingElement.addEventListener("click", () => this._onTimerCancelled());
    }

    updateView(isStaring) {
        if (isStaring) {
            this._timerTogglerElement.classList.replace("btn-primary", "btn-danger");
            this._timerTogglerElement.innerText = "Stop Tracking";
        } else {
            this._timerTogglerElement.classList.replace("btn-danger", "btn-primary");
            this._timerTogglerElement.innerText = "Start Tracking";
        }
    }

    _onTimerToggled() {
        const isStaring = this._timerTogglerElement.classList.contains("btn-primary");
        this.updateView(isStaring);

        let event = new CustomEvent("onTimerToggled", {
            detail: {
                isStarting: isStaring
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