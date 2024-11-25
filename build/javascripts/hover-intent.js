import { registerComponent } from "helpers";
import { WYATTElement } from "wyatt";

registerComponent(
  "hover-intent",
  class HoverIntent extends WYATTElement {
    constructor() {
      super({
        activeClass: "nav-item--expanded",
        elementSelector: ".nav-item",
        mouseEnterDelay: 100,
        mouseExitDelay: 400,
        mouseSensitivity: 7,
      });

      this.elements = this.querySelectorAll(this.config.elementSelector);
      this.previousPageX = 0;
      this.previousPageY = 0;
      this.currentPageX = 0;
      this.currentPageY = 0;

      this.elements.forEach((element) => {
        const menu = element.querySelector("[data-menu]");

        if (!menu) {
          return;
        }

        element.mouseEnterDelay = undefined;
        element.mouseExitDelay = undefined;

        element.isActive = false;
        element.addEventListener(
          "mouseenter",
          this.handleMouseEnter.bind(this)
        );
        element.addEventListener(
          "mouseleave",
          this.handleMouseLeave.bind(this)
        );
      });

      this.addEventListener("mousemove", this.trackMouseMove);
    }

    trackMouseMove(event) {
      this.currentPageX = event.pageX;
      this.currentPageY = event.pageY;
    }

    handleMouseEnter(event) {
      const element = event.currentTarget;
      if (element.isActive) {
        clearTimeout(element.mouseExitDelay);
        return;
      }

      this.previousPageX = this.currentPageX;
      this.previousPageY = this.currentPageY;

      element.mouseEnterDelay = setTimeout(() => {
        this.compareMousePosition(element);
      }, this.config.mouseEnterDelay);
    }

    handleMouseLeave(event) {
      const element = event.currentTarget;
      clearTimeout(element.mouseEnterDelay);

      if (!element.isActive) {
        return;
      }

      element.mouseExitDelay = setTimeout(() => {
        this.removeActiveClass(element);
        element.isActive = false;
      }, this.config.mouseExitDelay);
    }

    compareMousePosition(element) {
      const distanceX = this.previousPageX - this.currentPageX;
      const distanceY = this.previousPageY - this.currentPageY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < this.config.mouseSensitivity) {
        clearTimeout(element.mouseExitDelay);
        element.isActive = true;
        this.addActiveClass(element);
      } else {
        this.previousPageX = this.currentPageX;
        this.previousPageY = this.currentPageY;
        element.mouseEnterDelay = setTimeout(() => {
          this.compareMousePosition(element);
        }, this.config.mouseEnterDelay);
      }
    }

    addActiveClass(element) {
      element.setAttribute("expanded", true);
      element.classList.add(this.config.activeClass);
    }

    removeActiveClass(element) {
      element.setAttribute("expanded", false);
      element.classList.remove(this.config.activeClass);
    }
  }
);
