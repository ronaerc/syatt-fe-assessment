import { registerComponent } from "helpers";
import { WYATTElement } from "wyatt";

registerComponent(
  "quantity-stepper",
  class QuantityStepper extends WYATTElement {
    constructor() {
      super();

      this.input = this.querySelector("input");
      this.buttons = this.querySelectorAll("button");
      this.changeEvent = new Event("change", { bubbles: true });

      this.checkDisabledState();

      this.buttons.forEach((button) => {
        button.addEventListener("click", this.onButtonClick.bind(this));
      });
    }

    onButtonClick(event) {
      const previousValue = this.input.value;

      event.preventDefault();

      if (event.currentTarget.name === "plus") {
        this.input.stepUp();
      } else {
        this.input.stepDown();
      }

      if (previousValue !== this.input.value) {
        this.input.dispatchEvent(this.changeEvent);
      }

      this.checkDisabledState();
    }

    checkDisabledState() {
      const currentQuantity = parseInt(this.input.value, 10);
      const maxQuantity = parseInt(this.input.max, 10);
      const minQuantity = parseInt(this.input.min, 10);

      this.buttons.forEach((button) => {
        if (button.name === "plus") {
          button.disabled = currentQuantity === maxQuantity;
        } else {
          button.disabled = currentQuantity === minQuantity;
        }
      });
    }
  }
);
