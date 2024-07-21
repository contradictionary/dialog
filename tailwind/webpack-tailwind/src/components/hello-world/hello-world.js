import BaseCustomElement from "../../common/script/BaseCustomElement";
import template from "./hello-world.html";

class HellowWorld extends BaseCustomElement {
  constructor() {
    super({ template });
    this.init();
  }
  init() {
    //init
  }
  connectedCallback(e) {
    console.log("hello-world", "connectedCallback", e);
  }
}
window.customElements.define("hello-world", HellowWorld);
