const findCommonPrefix = (urls) => {
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

const applyPrefix = (urls, prefix) => {
  return urls.map((url) =>
    url.startsWith(prefix) ? url.slice(prefix.length) : url
  );
};

const prefixReducer = (urls) => {
  const prefix = findCommonPrefix(urls);
  const data = applyPrefix(urls, prefix);
  return {
    prefix,
    data,
  };
};

export default prefixReducer;
