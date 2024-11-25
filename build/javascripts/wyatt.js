import { deepMerge, scrollLock } from "helpers";

class WYATTElement extends HTMLElement {
  constructor(options) {
    super();

    this.config = this.getComponentConfig(options);
    this.unsubscribers = [];
  }

  disconnectedCallback() {
    if (this.unsubscribers.length) {
      this.unsubscribers.forEach((unsubscriber) => unsubscriber());
    }
  }

  getComponentConfig(options) {
    const defaults = options || {};
    const jsonString = this.querySelector("[data-config]")?.textContent;
    const config = jsonString ? JSON.parse(jsonString) : {};
    const id = Math.random().toString(16).slice(2);

    return deepMerge({ id }, defaults, config);
  }

  publish(eventName, data) {
    if (WYATT.config.pubsub.subscribers[eventName]) {
      WYATT.config.pubsub.subscribers[eventName].forEach((callback) => {
        callback(data);
      });
    }
  }

  subscribe(eventName, callback) {
    if (WYATT.config.pubsub.subscribers[eventName] === undefined) {
      WYATT.config.pubsub.subscribers[eventName] = [];
    }

    WYATT.config.pubsub.subscribers[eventName] = [
      ...WYATT.config.pubsub.subscribers[eventName],
      callback,
    ];

    this.unsubscribers.push(() => {
      WYATT.config.pubsub.subscribers[eventName] =
        WYATT.config.pubsub.subscribers[eventName].filter((cb) => {
          return cb !== callback;
        });
    });
  }
}

class WYATTDialog extends WYATTElement {
  constructor() {
    super();

    this.openButton = this.querySelector("[data-open]");
    this.dialog = this.getDialog();
    this.wrapper = this.dialog.querySelector("[data-wrapper]");

    this.openButton.addEventListener("click", this.open.bind(this));

    this.handleClickOutside();

    this.dialog.addEventListener("close", this.close.bind(this));

    if (this.config.openOn) {
      this.config.openOn.forEach((event) =>
        this.subscribe(WYATT.config.pubsub.events[event], this.open.bind(this))
      );
    }

    if (this.config.closeOn) {
      this.config.closeOn.forEach((event) =>
        this.subscribe(WYATT.config.pubsub.events[event], this.close.bind(this))
      );
    }
  }

  connectedCallback() {
    document.body.append(this.dialog);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.dialog.remove();
  }

  open() {
    this.dialog.showModal();
    this.dialog.setAttribute("active", true);
    scrollLock.enable();
  }

  close() {
    this.dialog.close();
    this.dialog.setAttribute("active", false);
    scrollLock.disable();
  }

  handleClickOutside() {
    this.dialog.addEventListener("click", () => {
      this.dialog.close();
    });
    this.wrapper.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  getDialog() {
    return (
      this.querySelector("[data-dialog]") ||
      document.querySelector(this.openButton.dataset.open)
    );
  }
}

export { WYATTElement, WYATTDialog };
