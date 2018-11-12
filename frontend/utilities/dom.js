export const downloadLinkManager = (data, name) => {
  let link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', name);
  link.click();
  link = null;
};

export const blobDownloader = (data, name, callback) => {
  const download_url = window.URL.createObjectURL(data);
  downloadLinkManager(download_url, name);
  if (callback) {
    callback();
  }
};

export const uriDownloader = (data, name) => {
  const download_url = encodeURI(data);
  downloadLinkManager(download_url, name);
};
