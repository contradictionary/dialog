const IdGenerator = (prefixStr = "") => {
  let counter = 0;
  return () => `${prefixStr}_${++counter}`;
};
const getNextId = IdGenerator("demoform1");
const [form, submitBtn] = Array.from(
  document.querySelectorAll("#demoform1,[type=submit]") as unknown as HTMLCollectionOf<HTMLElement>
);
class ExmapleFormValidator {
  // static instance: ExmapleFormValidator;
  // static getInstace(form: HTMLFormElement) {
  //   if (this.instance) return this.instance;
  //   else return (this.instance = new ExmapleFormValidator(form));
  // }
  form:HTMLFormElement
  validator: FormValidator;
  constructor(form: HTMLFormElement) {
    this.form = form;
    this.validator = new FormValidator(form);
    this.init();
  }
  private init() {
    form.addEventListener("submit", (e: Event) =>
      this._submit(e as SubmitEvent)
    );
    submitBtn.addEventListener("click", (e) =>
      this._submitClick(e as PointerEvent)
    );
    form.addEventListener("show-custom-error", ((e: CustomEvent) =>
      this._showCustomError(e)) as EventListener);
    form.addEventListener("hide-custom-error", ((e: CustomEvent) =>
      this._hideCustomError(e)) as EventListener);
    form.addEventListener("custom-validity-message", ((e: CustomEvent) =>
      this._customValidityMessage(e)) as EventListener);
    form.addEventListener("focus-invalid-element", ((e: CustomEvent) =>
      this._focusInvalidElement(e)) as EventListener);
  }
  showErrorMessage(element: TSupportedElementTypes, e: CustomEvent) {
    if(element.type == "checkbox" || element.type =="radio"){
      // element.classList.add("shadow-border","shadow-red-500/50");
    }else{
      element.classList.add("border-red-300");
    }
    const desc = element.getAttribute("aria-describedby") || '';

    const errorElements = ExmapleFormValidator.getErrorElement(element);

    if (!errorElements) return;
    errorElements?.classList.remove("hidden");
    if (!errorElements.id) {
      errorElements.id = getNextId();
    }
    const excludeIds = ExmapleFormValidator.getAllErrorMsgElements(element).map(
      (s) => s.id
    );
    const ids = desc.split(" ").filter((e) => excludeIds.indexOf(e) == -1);
    ids.push(errorElements.id);
    element.setAttribute("aria-describedby", ids.join(" "));
  }
  hideErrorMessage(element: TSupportedElementTypes, e: CustomEvent) {
    element.classList.remove("border-red-300");
    const desc = element.getAttribute("aria-describedby") || '';

    const errorElements = ExmapleFormValidator.getAllErrorMsgElements(element);

    const excludeIds = errorElements.map((s) => {
      s.classList.add("hidden");
      return s.id;
    });
    const ids = desc.split(" ").filter((e) => excludeIds.indexOf(e) == -1);
    element.setAttribute("aria-describedby", ids.join(" "));
  }
  private _submit(e: SubmitEvent) {
    e.preventDefault();
    document.getElementById('success-msg')?.classList.remove('hidden');
    setTimeout(()=>{
      document.getElementById('success-msg')?.classList.add('hidden');
      this.form.reset();
    },2500)
  }
  private _submitClick(e: PointerEvent) {

  }
  private _showCustomError(e: CustomEvent) {
    const { detail } = e;
    if (!detail) {
      return;
    }
    const { element, event } = detail;
    console.log(e.type,element);
    this.showErrorMessage(element, event);
  }
  private _hideCustomError(e: CustomEvent) {
    const { detail } = e;
    if (!detail) {
      return;
    }
    const { element, event } = detail;
    this.hideErrorMessage(element, event);
  }
  private _customValidityMessage(e: CustomEvent) {
    const { detail } = e;
    if (!detail) {
      return;
    }
    const { element } = detail;
    detail.message = ExmapleFormValidator.getErrorElement(element)?.textContent;
  }
  private _focusInvalidElement(e: CustomEvent) {
    const { detail } = e;
    if (!detail) {
      return;
    }
    const { element } = detail;
    element?.focus();
  }

  static getErrorElement(element: TSupportedElementTypes) {
    let msgElement: HTMLElement | null;
    if (element.type == "checkbox" || element.type == "radio") {
      return element.parentElement?.parentElement?.parentElement?.querySelector(
        "[data-error-missing]"
      );
    }else if(isSelectElement(element)){
      return element.parentElement?.querySelector('[data-error-missing]')
    }
    if (element.validity.valueMissing) {
      msgElement = element.parentElement!.querySelector("[data-error-missing]");
    } else {
      msgElement = element.parentElement!.querySelector("[data-error-invalid]");
    }
  
    return msgElement;
  }

  static getAllErrorMsgElements(element: TSupportedElementTypes) {
    const p = (element.type == "checkbox" || element.type == "radio") ? element.parentElement?.parentElement?.parentElement! : element.parentElement!;
    return Array.from(
      p!.querySelectorAll(
        "[data-error-missing],[data-error-invalid]"
      )
    );
  }
}
// new ExmapleFormValidator(form as HTMLFormElement);

function RadioInputValidityHandler(root:HTMLElement) {
  //assumption: no dynamically created element,all elements
  //already present within the form
  //and required attribute is not dynamically changed
  let radios = root.querySelectorAll(
    'input[required][type="radio"][name]:not([disabled])',
  ) as unknown as HTMLInputElement[];

  radios.forEach((radio) => {
    let radioGroup = root.querySelectorAll(
      'input[required][type="radio"][name="' +
        radio.name +
        '"]:not([custom-validity-handled]):not([disabled])',
    ) as unknown as HTMLInputElement[];
    radioGroup.forEach((radioGroupItem) => {
      radioGroupItem.addEventListener("invalid", (e:Event) => {
        console.log('invalid #',(e.target as HTMLElement).id);
        e.preventDefault(); //no default tooltip
        (e.target as HTMLInputElement).setCustomValidity(" "); //announced as invalid
        (e.target as HTMLInputElement).classList.add("invalid");
      });
      radioGroupItem.addEventListener("change", (e:Event) => {
        const currentInput = e.target as HTMLInputElement;
        currentInput.setCustomValidity(""); 
        radioGroup.forEach((item) => {
          item.classList.remove("invalid");
          item.setCustomValidity(currentInput.checked ? '':' ');
        });
      });
      radioGroupItem.setAttribute("custom-validity-handled", 'true');
    });
  });
  root.addEventListener("reset", () =>
    radios.forEach((radio:HTMLInputElement) => {
      radio.classList.remove("invalid");
      radio.setCustomValidity("");
    }),
  );
}
RadioInputValidityHandler(form);