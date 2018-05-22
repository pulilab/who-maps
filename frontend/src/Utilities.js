import platform from 'platform';

/* global Promise, URL */

const components = {};

class StaticUtilities {
  constructor (_path) {
    this.path = _path;
  }
  /* translation-unfriendly-code */
  async lazyLoader (provider, element) {
    const vm = this;
    const ctrl = await require(`./${vm.path}/${element}`);
    if (ctrl.default) {
      const keys = Object.keys(ctrl);
      keys.forEach(key => {
        const name = `${element}.${key}`;
        if (!components[name]) {
          components[name] = true;
          provider.component(ctrl[key].name, ctrl[key]);
        }
      });
    } else if (!components[element]) {
      components[element] = true;
      provider.component(ctrl.name, ctrl);
    }
  }
  /* end-translation-unfriendly-code */
  static getComponents () {
    return components;
  }

  static launchDownload (data, filename) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    const url = URL.createObjectURL(data);
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  static classifyString (str) {
    try {
      return str.replace(/ /g, '_').replace(/\./g, '-').toLowerCase();
    } catch (e) {
      console.warn('Failed to parse class string', str);
    }
    return '';
  }

  static prefixHtml () {
    const html = document.querySelector('html');
    const strippedVersion = platform.version.split('.')[0];
    html.classList.add('browser-' + StaticUtilities.classifyString(platform.name));
    html.classList.add('version-' + StaticUtilities.classifyString(strippedVersion));
    html.classList.add('os-' + StaticUtilities.classifyString(platform.os.family));
    html.classList.add('os-version-' + StaticUtilities.classifyString(platform.os.version));
  }
}

const getSubDomain = () => {
  const defaultDomain = 'who';
  const hostArray = window.location.hostname.split('.');
  const subDomain = hostArray.length > 1 ? hostArray.shift() : defaultDomain;
  if (subDomain !== defaultDomain && subDomain.length !== 2) {
    return defaultDomain;
  }
  return subDomain;
};

const calculateHeight = () => {
  const contentHeight = window.innerHeight - 48;
  return contentHeight + 'px';
};

const fixUrl = (url) => {
  if (!(/^(?:f|ht)tps?:\/\//).test(url)) {
    url = 'http://' + url;
  }
  return url;
};

export { StaticUtilities, getSubDomain, calculateHeight, fixUrl };
