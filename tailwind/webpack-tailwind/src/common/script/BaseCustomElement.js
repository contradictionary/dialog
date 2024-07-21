import { copyStyleElement, copyScriptElement } from "./component-utils.js";

export default class BaseCustomElement extends HTMLElement {
  static idCounter = 0;
  HashCode;
  constructor({
    mode = "open",
    template = "",
    globalScripts = [],
    globalStyles = ['link[rel="stylesheet"]'],
  }) {
    super();
    this.attachShadow({ mode: mode || "open" }).innerHTML=template;
    globalScripts.forEach((query) =>
      document.querySelectorAll(query).forEach((s) => {
        this.shadowRoot.appendChild(copyScriptElement(s));
      })
    );
    globalStyles.forEach((query) =>
      document.querySelectorAll(query).forEach((s) => {
        this.shadowRoot.appendChild(copyStyleElement(s));
      })
    );
    this.HashCode = this.getId('cmp-id');
    this.init?.();
  }
  /**
   *
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    const handler = this.#getAttributeHandler(name, oldValue, newValue);
    if (handler) {
      try {
        handler.call(this, name, oldValue, newValue);
      } catch (error) {
        console.error(error);
      }
    }
  }

  #getAttributeHandler(attrName) {
    const name = `${
      attrName.slice(0, 1).toLowerCase() + attrName.slice(1)
    }AttributeChange`;
    return this[name] || null;
  }
  query(selector) {
    try {
      return this.shadowRoot.querySelector(selector);
    } catch (error) {
      console.error(error);
    }
  }
  queryAll(selector) {
    try {
      return this.shadowRoot.queryAll(selector);
    } catch (error) {
      console.error(error);
    }
  }
  getId(prefix=''){
    return `${[prefix]}-${++BaseCustomElement.idCounter}`;
  }
}
