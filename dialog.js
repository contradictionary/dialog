import "./dialog.scss";
export class DialogModal {
  constructor({ showCloseButton = true, rootId = "" } = {}) {
    this.showCloseButton = showCloseButton;
    this.rootId = rootId;
    this.dialog = null;
    this.overlay = null;
    this.content = null;
    this.closeButton = null;
  }
  _createDialog() {
    // Create overlay
    this.overlay = document.createElement("div");
    this.overlay.classList.add("dialog-overlay");
    this.content = document.createElement("div");
    this.content.classList.add("dialog-modal-content");

    // Create dialog container
    this.dialog = document.createElement("div");
    this.dialog.classList.add("dialog-modal");

    // Optionally add close button
    if (this.showCloseButton) {
      const closeButton = (this.closeButton = document.createElement("button"));
      closeButton.classList.add("dialog-close-button");
      closeButton.innerText = "X";
      closeButton.addEventListener("click", async (e) =>
        this.close(e).catch(() => {})
      );
      this.dialog.appendChild(closeButton);
    }

    this.dialog.appendChild(this.content);
    this.overlay.appendChild(this.dialog);
    if (this.rootId) {
      this.overlay.id = this.rootId;
    }
    document.body.appendChild(this.overlay);
  }

  _fireEvent(eventName, data) {
    const event = new CustomEvent(eventName, {
      cancelable: true,
      bubbles: true,
      detail: data,
    });
    this.dialog.dispatchEvent(event);
    return event;
  }

  async open(data) {
    const event = this._fireEvent("dialogopening", data);
    if (event.defaultPrevented) {
      return Promise.reject(data);
    }

    this.overlay.style.display = "block";
    this.dialog.style.display = "block";

    this._fireEvent("dialogopened");
    return Promise.resolve(data);
  }

  async close(data) {
    const event = this._fireEvent("dialogclosing", data);
    if (event.defaultPrevented) {
      return Promise.reject(data);
    }

    this.overlay.style.display = "none";
    this.dialog.style.display = "none";

    this._fireEvent("dialogclosed");
    return Promise.resolve(data);
  }

  /**
   *
   * @throws
   * @param {any} data callback data
   * @returns
   */
  async show(data) {
    try {
      await this.open(data);
      return new Promise((resolve) => {
        const onClose = (e) => {
          this.dialog.removeEventListener("dialogclosed", onClose);
          resolve({ event: e, data });
        };
        this.dialog.addEventListener("dialogclosed", onClose);
      });
    } catch (error) {
      return Promise.reject({ error, data });
    }
  }

  setContent(content) {
    if (!this.dialog) {
      this._createDialog();
    }
    while (this.content.firstChild) {
      this.content.removeChild(this.content.lastChild);
    }
    this.content.append(content);
  }
}

export class ConfirmationDialogModal extends DialogModal {
  constructor(id) {
    super({ showCloseButton: false, rootId: id });
    this.cancelButton = null;
    this.continueButton = null;
  }
  setContent(content) {
    super.setContent(content);
    this._prepareButtons();
  }
  _prepareButtons() {
    if (!this.cancelButton) {
      this.cancelButton = document.createElement("button");
      this.cancelButton.innerText = "Cancel";
      this.cancelButton.classList.add("dialog-button");

      this.continueButton = document.createElement("button");
      this.continueButton.innerText = "Continue";
      this.continueButton.classList.add("dialog-button");

      const div = document.createElement("div");
      div.classList.add("dialog-button-container");
      div.append(this.cancelButton, this.continueButton);

      this.cancelButton.addEventListener("click", () =>
        this.close("cancel").then(() =>
          this._fireEvent("confirm-dialog-cancel")
        )
      );

      this.continueButton.addEventListener("click", () =>
        this.close("continue").then(() =>
          this._fireEvent("confirm-dialog-continue")
        )
      );

      this.content.append(div);
    }
  }
}
export class PromptDialog extends DialogModal {
  constructor(id) {
    super({ showCloseButton: false, rootId: id });
    this.cancelButton = null;
  }
  setContent(content) {
    super.setContent(content);
    this._prepareButtons();
  }
  _prepareButtons() {
    if (!this.cancelButton) {
      this.cancelButton = document.createElement("button");
      this.cancelButton.innerText = "Close";

      this.cancelButton.classList.add("dialog-button", "dialog-button-cancel");

      const div = document.createElement("div");
      div.classList.add("dialog-button-container");
      div.append(this.cancelButton);

      this.cancelButton.addEventListener("click", () =>
        this.close("cancel").then(() => this._fireEvent("prompt-dialog-close"))
      );
      this.content.append(div);
    }
  }
}
