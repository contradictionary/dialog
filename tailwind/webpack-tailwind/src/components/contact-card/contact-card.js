import BaseCustomElement from "../../common/script/BaseCustomElement";
import template from "./contact-card.html";

class ContactCard extends BaseCustomElement {
  static ComponentName = "contact-card";
  static observedAttributes = ["name", "phone"];
  root;
  HashCode;
  constructor() {
    super({ template, name: "" });
  }
  /**
   *
   * @param {HTMLElement} root
   */
  init() {
    //
    console.log("ContactCard",this.HashCode);
    const root = this.query("a");
    root.id = this.HashCode;
  }
  nameAttributeChange(attrName, _oldValue, _newValue) {
    const span = this.query("." + attrName);
    span.clear();
    span.append(_newValue);
  }
  phoneAttributeChange(attrName, _oldValue, _newValue) {
    const span = this.query("." + attrName);
    span.clear();
    span.append(_newValue);
  }
}
window.customElements.define(ContactCard.ComponentName, ContactCard);
