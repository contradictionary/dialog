import { ConfirmationDialogModal, DialogModal, PromptDialog } from "./dialog";

const template = document.querySelector("template");
const content = template.content.cloneNode(true);
const preventOpen = () => document.querySelector("#prevent-open").checked;
const preventClose = () => document.querySelector("#prevent-close").checked;
const button = document.querySelector("button");
const link = document.querySelector("a");

// Usage example
const dialog = (window.dialog = new DialogModal({
  showCloseButton: true,
  rootId: "moda-id-1",
}));
dialog.setContent(content);

// Adding event listeners
dialog.dialog.addEventListener("dialogopening", (event) => {
  console.log("Dialog is opening.", event.detail);

  // Prevent dialog from opening if needed
  // event.preventDefault();
  if (preventOpen()) {
    event.preventDefault();
  }
});

dialog.dialog.addEventListener("dialogopened", (event) => {
  console.log("Dialog has been opened.", event.detail);
});

dialog.dialog.addEventListener("dialogclosing", (event) => {
  console.log("Dialog is closing.", event.detail);
  // Prevent dialog from closing if needed
  // event.preventDefault();
  if (preventClose()) {
    event.preventDefault();
  }
});

dialog.dialog.addEventListener("dialogclosed", () => {
  console.log("Dialog has been closed.");
});

button.addEventListener("click", () => {
  dialog
    .show('promise.show')
    .then((detail) => {
      console.log("promise.then ~ Dialog has been closed.", detail);
    });
});

const buttonNew = document.querySelector("#button2");
const confirmDialog = new ConfirmationDialogModal("confirm-dialog-1");
confirmDialog.setContent(template.content.cloneNode(true));
let link_1,
  is_continue = false;
confirmDialog.dialog.addEventListener("confirm-dialog-cancel", (e) => {
  console.log("confirm-dialog", "cancel");
});
confirmDialog.dialog.addEventListener("confirm-dialog-continue", (e) => {
  is_continue = true;
  link_1 && link_1.click();
  console.log("confirm-dialog", "continue");
});
buttonNew.addEventListener("click", () => {
  link_1 = null;
  confirmDialog.open();
});
link.addEventListener("click", (e) => {
  if (is_continue) {
    return true;
  }
  e.preventDefault();
  e.stopPropagation();
  link_1 = e.currentTarget;
  confirmDialog.open();
});

const buttonPrompt = document.querySelector("#button3");
const dialogPrompt = new PromptDialog("prompt-dialog-1");
dialogPrompt.setContent(template.content.cloneNode(true));
dialogPrompt.dialog.addEventListener("confirm-dialog-close", (e) => {
  console.log("confirm-dialog", "Closed");
});

buttonPrompt.addEventListener("click", () => {
  dialogPrompt.open();
});
