export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    console.log(`Setting text to ${loadingText}`);
    btn.textContent = "Loading...";
    //set the loading text
  } else {
    //set not loading text
    btn.textContent = "Submit";
  }
}
