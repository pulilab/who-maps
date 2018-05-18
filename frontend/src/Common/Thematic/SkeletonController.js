
class SkeletonController {
  constructor ($scope, $interpolate, $anchorScroll, data, axis, domain, icons) {
    this.scope = $scope;
    this.interpolate = $interpolate;
    this.axis = axis;
    this.domain = domain;
    this.data = data;
    this.icons = icons;
    this.scroll = $anchorScroll;

    this.domainActivationSetter(this.axis, this.domain, true);
    this.images = this.importImages();
    this.templates = this.importHtmlTemplates();

    this.data.forEach((a, aInd) => {
      a.expand = (aInd - 2) === this.axis;
      return a;
    });
  }

  importImages () {
    // Import the whole folder in an collection of string templates, needed for proper webpack optimizations
    const templates = {};
    const templateRequire = require.context('./images/', true, /\.svg$/);
    templateRequire.keys().forEach((item) => {
      const key = item.split('.')[1].replace('/', '');
      templates[key] = templateRequire(item);
    });
    return templates;
  }

  importHtmlTemplates () {
    // Import the whole folder in an collection of string templates, needed for proper webpack optimizations
    const scope = {
      vm: {
        images: this.images
      }
    };
    const templates = {};
    const templateRequire = require.context('./static/', true, /\.html$/);
    templateRequire.keys().forEach((item) => {
      templates[item.slice(2)] = this.interpolate(templateRequire(item))(scope);
    });
    return templates;
  }

  axisClick (axis, id) {
    axis.expand = true;
    this.changeSpot(id - 2, 0);
  }

  changeSpot (axisId, domainId) {
    domainId = domainId || 0;
    this.domainActivationSetter(this.axis, this.domain, false);
    this.axis = axisId;
    this.domain = domainId;
    this.domainActivationSetter(this.axis, this.domain, true);

    this.scroll('help-anchor');
  }

  domainActivationSetter (axisId, domainId, state) {
    this.data[axisId + 2].domains[domainId].active = state;
  }

  static skeletonFactory (data, axis, domain, icons) {
    const skeleton = ($scope, $interpolate, $anchorScroll) => {
      return new SkeletonController($scope, $interpolate, $anchorScroll, data, axis, domain, icons);
    };
    skeleton.$inject = ['$scope', '$interpolate', '$anchorScroll'];
    return skeleton;
  }
}

export default SkeletonController;
