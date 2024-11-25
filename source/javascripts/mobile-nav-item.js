import { registerComponent } from "helpers";
import { WYATTElement } from "wyatt";

registerComponent(
  "mobile-nav-item",
  class MobileNavItem extends WYATTElement {
    constructor() {
      super();

      this.forwardButton = this.querySelector("[data-forward]");
      this.backButton = this.querySelector("[data-back]");

      this.forwardButton?.addEventListener("click", this.goForward.bind(this));
      this.backButton?.addEventListener("click", this.goBack.bind(this));
    }

    goBack(event) {
      event.preventDefault();

      const button = event.currentTarget;
      const id = button.getAttribute("aria-controls");
      const menu = document.getElementById(id);

      menu.setAttribute("expanded", false);
      button.setAttribute("aria-expanded", false);
    }

    goForward(event) {
      event.preventDefault();

      const button = event.currentTarget;
      const id = button.getAttribute("aria-controls");
      const menu = document.getElementById(id);

      menu.setAttribute("expanded", true);
      button.setAttribute("aria-expanded", true);
    }
  }
);
