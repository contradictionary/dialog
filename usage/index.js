import { clsDialog } from "../src/dialog.js";

const preventOpen = () => document.querySelector("#prevent-open").checked;
const preventClose = () => document.querySelector("#prevent-close").checked;
const button = document.querySelector("button");

// Usage example
const dialog = new clsDialog(document.querySelector("[data-cmp-dialog]"));

// Adding event listeners
dialog.on("dialog-opening", (event) => {
  console.log("Dialog is opening.", event.detail);
  requestAnimationFrame(()=>{
    dialog.UI.ROOT.querySelector('#modal-content-container')?.classList.add('active');
  });
  // event.preventDefault();
  if (preventOpen()) {
    // Prevents dialog from opening
    event.preventDefault();
  }
});
dialog.firstElement = dialog.lastElement = dialog.UI.CLOSE_BUTTON;
requestAnimationFrame(() => document.querySelector("#closebtn")?.focus());

dialog.on("dialog-opened", (event) => {
  console.log("Dialog has been opened.", event.detail);
});

dialog.on("dialog-closing", (event) => {
  console.log("Dialog is closing.", event.detail);
  if (preventClose()) {
    // Prevents dialog from closing
    event.preventDefault();
  }
  dialog.UI.ROOT.querySelector('#modal-content-container')?.classList.remove('active');
});

dialog.on("dialog-closed", () => {
  console.log("Dialog has been closed.");
});

button.addEventListener("click", () => {
  dialog.show("promise.show").then((detail) => {
    console.log("promise.then ~ Dialog has been closed.", detail);
  });
  requestAnimationFrame(() => document.querySelector("#closebtn")?.focus());
});
