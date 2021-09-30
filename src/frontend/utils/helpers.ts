export const formatPhoneNumber = (e) => {
  const cleaned = ("" + e).replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    const intlCode = match[1] ? "+1 " : "";
    return ["(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return "+" + cleaned;
};

export const hasSameValue = (arr) =>
  arr.filter((el) => el !== arr[0]).length === 0;

export const formatCurrency = (v: any) => (isNaN(v) ? v : `$${v}`);

export const formatErrorMessage = (
  message: String,
  tagsToRemove: Array<string>
) => {
  tagsToRemove.forEach((tag) => {
    do {
      const startIndex = message.indexOf(`<${tag}`);
      if (startIndex >= 0) {
        let endIndex = message.indexOf(`</${tag}>`);
        if (endIndex >= 0) {
          endIndex += tag.length + 3; //end of the tag
          if (endIndex) {
            const textToBeReplaced = message.slice(startIndex, endIndex);
            message = message.replace(textToBeReplaced, "");
          }
        }
      }
    } while (message.indexOf(`<${tag}`) != -1);
  });
  return message.replace("&nbsp;", "").replace("  ", " ");
};
