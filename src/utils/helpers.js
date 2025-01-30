export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    console.log(`Setting text to ${loadingText}`);
    btn.textContent = loadingText;
    //set the loading text
  } else {
    //set not loading text
    btn.textContent = defaultText;
  }
}

//export function setButtonText(btn, isLoading, defaultText = "Save", loadingText = "Saving.")
//btn.textContent = isLoading ? loadingText : default;
//}
//export function handleSubmit(request, evt, loadingText = "Saving...") {
//evt.preventDefault();
//const submitBtn = evt.submitter;
//const initialText = submitBtn.textContent;
//}
//setButtonText(submitBtn, true, iniialText, loadingText);

// request().then(() => evt.target.reset())
// .catch(cansole.error)
//.finally(() => setButtonText(submitBtn, false, initialText));
