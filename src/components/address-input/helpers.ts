let autoComplete;

export function handleScriptLoad(updateQuery, autoCompleteRef) {
  autoComplete = new window["google"].maps.places.Autocomplete(
    autoCompleteRef.current,
    {
      types: ["address"],
      componentRestrictions: { country: "us" },
    }
  );
  autoComplete.setFields(["address_components", "formatted_address"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
  // autoCompleteRef.current.addEventListener('keydown', (e) => {
  //   if (e.keyCode === 13) {
  //     e.preventDefault()
  //     handlePlaceSelect(updateQuery)
  //   }
  // })
}

export function handlePlaceSelect(updateQuery) {
  const addressObject = autoComplete.getPlace();

  if (!addressObject) return;
  if (addressObject.formatted_address) {
    updateQuery(addressObject.formatted_address);
  } else {
    updateQuery(addressObject.name);
  }
}
