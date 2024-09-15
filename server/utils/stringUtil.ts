const findCommonPrefix = (urls: string[]) => {
  if (urls.length === 0) {
    return "";
  }

  // Find the shortest URL
  const shortestURL = urls.reduce(
    (acc, url) => (url.length < acc.length ? url : acc),
    urls[0]
  );

  // Find the common prefix
  let prefix = "";
  for (let i = 0; i < shortestURL.length; i++) {
    const char = shortestURL[i];
    if (urls.every((url) => url[i] === char)) {
      prefix += char;
    } else {
      break;
    }
  }

  return prefix;
};

const applyPrefix = (urls: string[], prefix: string) => {
  return urls.map((url) =>
    url.startsWith(prefix) ? url.slice(prefix.length) : url
  );
};

const prefixReducer = (urls: string[]) => {
  const prefix = findCommonPrefix(urls);
  const data = applyPrefix(urls, prefix);
  return {
    prefix,
    data,
  };
};

const toKebabCase = (str: string) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-");

export { prefixReducer, toKebabCase };
