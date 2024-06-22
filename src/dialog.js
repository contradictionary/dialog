import { addEventForChild } from "./utils.js";
export class clsDialog {
  static SELECTORS = Object.seal({
    ROOT: "[data-cmp-dialog]",
    CONTENT_ROOT: "[data-cmp-dialog-content]",
    CLOSE_BUTTON: "[data-cmp-dialog-close-button]",
    CLOSE_CLASS_ELEMENTS: "[data-close-class]",
    OPEN_CLASS_ELEMENTS: "[data-open-class]",
  });
  static InstanceId = 0;
  /**
   * @type {Record<keyof clsDialog.SELECTORS,HTMLElement>}
   * */
  UI = {};
  #STATE = {
    /**@type {HTMLElement} */
    firstElement: null,
    /**@type {HTMLElement} */
    lastElement: null,
    focusBackToElement: null,
  };
  constructor(rootElement) {
    this._noScrollClassName = `no-scroll-${++clsDialog.InstanceId}`;
    this.cacheUIElements(rootElement);
    this._prepareEventHandlers();

    // this._applyHideClasses();
    this.UI.ROOT.setAttribute("aria-hidden", "true");

    //allows to access this instance from anywhere
    this.UI.ROOT._Handler = this;

    //TODO:remove this code
    if (!window.clsDialog) {
      window.clsDialog = [];
    }
    window.clsDialog.push(this);
  }
  set firstElement(el) {
    this.#STATE.firstElement = el;
  }
  get firstElement() {
    return this.#STATE.firstElement;
  }
  set lastElement(el) {
    this.#STATE.lastElement = el;
  }
  get lastElement() {
    return this.#STATE.lastElement;
  }
  get contentRoot() {
    return this.UI.CONTENT_ROOT;
  }
  focus(element) {
    //TODO: this won't open up keyboard in mobile devices, there is fix.
    element?.focus?.();
  }
  cacheUIElements(rootElement) {
    const SELECTORS = clsDialog.SELECTORS;
    this.UI.ROOT = rootElement;
    for (const key in SELECTORS) {
      if (key != "ROOT" && Object.hasOwnProperty.call(SELECTORS, key)) {
        const elements = this.UI.ROOT.querySelectorAll(SELECTORS[key]);
        if (elements.length) {
          this.UI[key] = elements.length == 1 ? elements[0] : elements;
        } else {
          this.UI[key] = null;
        }
      }
    }
  }
  _applyHideClasses() {
    const elements = [
      this.UI.ROOT,
      this.UI.CLOSE_CLASS_ELEMENTS?.length ? Array.from(this.UI.CLOSE_CLASS_ELEMENTS):this.UI.CLOSE_CLASS_ELEMENTS,
      this.UI.OPEN_CLASS_ELEMENTS?.length ? Array.from(this.UI.OPEN_CLASS_ELEMENTS):this.UI.OPEN_CLASS_ELEMENTS,
    ].flat();
    elements.forEach((element) => {
      if (!element) return;
      const {
        dataset: { openClass, closeClass },
      } = element;
      if (closeClass) {
        element.classList.add(...closeClass.split(" "));
      }
      if (openClass) {
        element.classList.remove(...openClass.split(" "));
      }
    });
  }
  _applyShowClass() {
    const elements = [
      this.UI.ROOT,
      this.UI.CLOSE_CLASS_ELEMENTS?.length ? Array.from(this.UI.CLOSE_CLASS_ELEMENTS):this.UI.CLOSE_CLASS_ELEMENTS,
      this.UI.OPEN_CLASS_ELEMENTS?.length ? Array.from(this.UI.OPEN_CLASS_ELEMENTS):this.UI.OPEN_CLASS_ELEMENTS,
    ].flat();
    elements.forEach((element) => {
      if (!element) return;
      const {
        dataset: { openClass, closeClass },
      } = element;
      if (closeClass) {
        element.classList.remove(...closeClass.split(" "));
      }
      if (openClass) {
        element.classList.add(...openClass.split(" "));
      }
    });
  }
  _prepareEventHandlers() {
    this._escKeyDown = this._escKeyDown.bind(this);
    this._closeBtnClick = this._closeBtnClick.bind(this);
    this._TabKeyDownListener = this._TabKeyDownListener.bind(this);
    addEventForChild(
      this.UI.ROOT,
      "click",
      clsDialog.SELECTORS.CLOSE_BUTTON,
      this._closeBtnClick
    );
  }
  _removeCloseHandlers() {
    document.removeEventListener("keydown", this._escKeyDown);
    this.UI.ROOT.removeEventListener("keydown", this._TabKeyDownListener);
  }
  _addCloseHandlers() {
    document.addEventListener("keydown", this._escKeyDown);
    this.UI.ROOT.addEventListener("keydown", this._TabKeyDownListener);
  }
  setLabelledby(selector) {
    this.UI.ROOT.setAttribute("aria-labelledby", selector);
  }
  /**
   *
   * @param {KeyboardEvent} e
   */
  _TabKeyDownListener(e) {
    const currentElement = e.target;
    const keyCode = e.key;
    console.log("_TabKeyDownListener", currentElement);
    if (keyCode == "Tab") {
      if (e.shiftKey) {
        if (currentElement == this.firstElement) {
          e.preventDefault();
          this.focus(this.lastElement);
        }
      } else if (currentElement == this.lastElement) {
        e.preventDefault();
        this.focus(this.firstElement);
      }
    }
  }
  _escKeyDown(e) {
    //just the escape key, nothing else
    if (e.altKey || e.ctrlKey || e.shiftKey || e.key != "Escape") {
      return;
    }
    this.close(e).catch((e) => {
      /**handle uncaugth */
      console.warn(e);
    });
  }
  _closeBtnClick(e) {
    console.log(e);
    this.close(e).catch((e) => {
      /**handle uncaugth */
      console.warn(e);
    });
  }
  on(name, ...args) {
    this.UI.ROOT.addEventListener(name, ...args);
  }
  off(name, ...args) {
    if (args.length) {
      this.UI.ROOT.removeEventListener(name, ...args);
    } else {
      this.UI.ROOT.removeEventListener(name);
    }
  }
  _fireEvent(eventName, data) {
    const event = new CustomEvent(eventName, {
      cancelable: true,
      bubbles: true,
      detail: data,
    });
    this.UI.ROOT.dispatchEvent(event);
    return event;
  }

  async open(option = {}) {
    const { data, focusBackToElement } = option;
    this.#STATE.focusBackToElement = focusBackToElement;
    const event = this._fireEvent("dialog-opening", data);
    if (event.defaultPrevented) {
      return Promise.reject(data);
    }
    this.showModal(data);
    return Promise.resolve(data);
  }
  showModal(data) {
    document.body.classList.add(this._noScrollClassName);

    this._applyShowClass();
    this.UI.ROOT.setAttribute("aria-hidden", "false");
    if (this.UI.CONTENT_ROOT) this.UI.ROOT.classList.add("show");

    this._addCloseHandlers();
    this._fireEvent("dialog-opened", data);
  }

  hideModal(data) {
    this._applyHideClasses();
    this.UI.ROOT.setAttribute("aria-hidden", "true");
    if (this.#STATE.focusBackToElement) {
      this.focus(this.#STATE.focusBackToElement);
    }
    document.body.classList.remove(this._noScrollClassName);
    this._removeCloseHandlers();
    this._fireEvent("dialog-closed", data);
  }

  async close(data) {
    const event = this._fireEvent("dialog-closing", data);
    if (event.defaultPrevented) {
      return Promise.reject(data);
    }
    this.hideModal(data);
    this.#STATE.focusBackToElement = null;
    return Promise.resolve(data);
  }

  /**
   * for simple use only.
   * Use open/show otherwise in combination with dialog-closing custom events
   * @throws
   * @param {any} data callback data
   * @returns
   */
  async show({ data, focusBackToElement }) {
    try {
      await this.open({ data, focusBackToElement });
      return new Promise((resolve) => {
        const onClose = (e) => {
          this.off("dialog-closed", onClose);
          resolve({ event: e, data });
        };
        this.on("dialog-closed", onClose);
      });
    } catch (error) {
      return Promise.reject({ error, data });
    }
  }
}
export class clsDialogWithConfirmOnClose {
  /**@type {clsDialog} */
  dialog;

  /**@type {clsDialog} */
  confirm;

  CloseConfirmed = false;

  constructor(dialogRoot, confirmDialogRoot, customClass) {
    this.dialog = dialogRoot._Handler;
    this.dialog.UI.ROOT.classList.add(customClass);
    this.confirm = confirmDialogRoot._Handler;
    this.init();
  }

  init() {
    this.dialog.on("dialog-closing", this._onDialogClosing.bind(this));
    this.dialog.on("dialog-opened", this._onDialogOpened.bind(this));
    // this.dialog.on("dialog-closed", this._onDialogClosed.bind(this));

    this.confirm.on("dialog-closed", this._onConfirmDialogClosed.bind(this));
    const items = this.confirm.contentRoot.querySelectorAll(".cmp-button");
    this.confirm.firstElement = items[0];
    this.confirm.lastElement = items[1];
  }
  _onDialogClosing(e) {
    if (this.CloseConfirmed) {
      return;
    }
    e.preventDefault();
    this.confirm.open({ focusBackToElement: e.detail?.target });
    this.confirm.focus(this.confirm.firstElement);
  }
  _onDialogOpened() {
    this.CloseConfirmed = false;
  }
  _onConfirmDialogClosed(e) {
    const value = e.detail?.target?.value;
    this.CloseConfirmed = value === "yes";
    this.CloseConfirmed && this.dialog.close();
  }
}
