const getTextFromHTML = (htmlString) => {
  var tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  return tempDiv.textContent || tempDiv.innerText || "";
};

export default getTextFromHTML;
