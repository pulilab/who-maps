import Vue from 'vue';
import { LMap, LTileLayer, LMarker, LTooltip, LPopup, LControlZoom, LGeoJson, LFeatureGroup, L } from 'vue2-leaflet';
import CustomMarkerCluster from '@/components/common/map/CustomMarkerCluster';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.component('l-map', LMap);
Vue.component('l-tilelayer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-tooltip', LTooltip);
Vue.component('l-popup', LPopup);
Vue.component('l-control-zoom', LControlZoom);
Vue.component('custom-marker-cluster', CustomMarkerCluster);
Vue.component('l-geo-json', LGeoJson);
Vue.component('l-feature-group', LFeatureGroup);
