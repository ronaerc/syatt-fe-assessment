import { registerComponent } from "helpers";
import { WYATTElement } from "wyatt";

registerComponent(
  "nav-item",
  class NavItem extends WYATTElement {
    constructor() {
      super();

      this.menu = this.querySelector("[data-menu]");

      if (!this.menu) {
        return;
      }

      this.trigger = this.querySelector("[data-trigger]");

      if (!this.trigger) {
        this.injectTrigger();
      }

      this.trigger.addEventListener(
        "click",
        this.handleTriggerClick.bind(this)
      );

      this.addEventListener("focusout", this.handleFocusout.bind(this));
    }

    injectTrigger() {
      const button = document.createElement("button");

      button.type = "button";
      button.classList.add("button-reset", "nav-item__trigger");
      button.ariaLabel = `Open menu for ${this.menu.ariaLabel}`;
      button.setAttribute("aria-controls", this.menu.id);
      button.setAttribute("aria-expanded", false);

      this.trigger = button;

      this.querySelector("a").after(button);
    }

    handleTriggerClick(event) {
      event.preventDefault();

      if (this.getAttribute("expanded") === "true") {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }

    handleFocusout() {
      if (this.matches(":focus-within")) {
        return;
      }

      this.closeMenu();
    }

    openMenu() {
      this.setAttribute("expanded", true);
      this.trigger.setAttribute("aria-expanded", true);
    }

    closeMenu() {
      this.setAttribute("expanded", false);
      this.trigger.setAttribute("aria-expanded", false);
    }
  }
);
