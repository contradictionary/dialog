/**
 * This function attaches an event listener to a parent HTML element for a specific child element,
 * identified by a CSS selector. When the specified event is triggered on the child element,
 * the provided callback function is executed.
 *
 * @param {HTMLElement} parent - The parent HTML element to which the event listener is attached.
 * @param {string} eventName - The name of the event to listen for (e.g., 'click', 'mouseover', etc.).
 * @param {string} childSelector - A CSS selector that identifies the child element(s) for which the event
 * listener is intended.
 * @param {(OriginaEvent:Event,HTMLElement)=>void} cb - The callback function to be executed when
 * the event is triggered.
 * The function is called with the child element as its argument.
 */
export const addEventForChild = (parent, eventName, childSelector, cb) => {
  parent.addEventListener(eventName, (event) => {
    const matchingChild = event.target.closest(childSelector);
    if (matchingChild) {
      cb(event, matchingChild);
    }
  });
};
