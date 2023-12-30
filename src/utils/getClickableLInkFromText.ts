export const getClickableLinkFromText = (descriptions: string) => {
  const regex = /(https?:\/\/[^\s]+)/g;
  const matches = descriptions?.match(regex);

  let formattedText = descriptions;

  if (matches && matches.length > 0) {
    formattedText = formattedText.replace(regex, (match) => `<a href="${match}" target="_blank">${match}</a>`);
  }

  return formattedText;
};

export const getClickableLinkFromTextWithoutLink = (descriptions: string) => {
  const regex = /(https?:\/\/[^\s]+)/g;
  const matches = descriptions?.match(regex);

  let formattedText = descriptions;

  if (matches && matches.length > 0) {
    formattedText = formattedText.replace(regex, (match) => `<a >${match}</a>`);
  }

  return formattedText;
};
