import { registerComponent, triggerEvent } from "helpers";
import { WYATTDialog } from "wyatt";

registerComponent(
  "wyatt-drawer",
  class WyattDrawer extends WYATTDialog {
    constructor() {
      super();
    }

    open() {
      super.open();

      triggerEvent(this.dialog, "drawerOpen");
    }

    close() {
      super.close();

      triggerEvent(this.dialog, "drawerClose");
    }
  }
);
