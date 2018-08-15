import { mapGetters, mapActions } from 'vuex';

const MapMixin = {
  data () {
    return {
      zoom: 3,
      countryCenterIcons: {},
      mapOptions: {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false
      }
    };
  },
  computed: {
    ...mapGetters({
      allCountriesPin: 'landing/getLandingPagePins',
      getActiveCountry: 'landing/getActiveCountry',
      geoJson: 'countries/getGeoJsonLibrary',
      getSelectedCountry: 'landing/getSelectedCountry',
      subLevelPins: 'landing/getSubLevelPins',
      getCountryProjects: 'landing/getCountryProjects',
      mapReady: 'landing/getMapReady',
      getActiveTab: 'landing/getProjectBoxActiveTab',
      getActiveSubLevel: 'landing/getActiveSubLevel'
    }),
    activeCountry: {
      get () {
        return this.getActiveCountry;
      },
      set (value) {
        this.setActiveCountry(value);
      }
    },
    selectedCountry: {
      get () {
        return this.getSelectedCountry;
      },
      set (value) {
        this.setSelectedCountry(value);
      }
    },
    activeTab: {
      get () {
        return this.getActiveTab;
      },
      set (value) {
        this.setActiveTab(value);
      }
    },
    activeSubLevel: {
      get () {
        return this.getActiveSubLevel;
      },
      set (value) {
        this.setActiveSubLevel(value);
      }
    },
    countriesPin () {
      return this.allCountriesPin.filter(cp => cp.id !== this.selectedCountry);
    },
    selectedCountryPin () {
      return this.allCountriesPin.find(cp => cp.id === this.selectedCountry);
    },
    activeCountryAndMapReady () {
      if (this.activeCountry && this.mapReady) {
        return this.activeCountry;
      }
    },
    clusterOptions () {
      return {
        disableClusteringAtZoom: 8,
        spiderfyOnMaxZoom: false,
        polygonOptions: {
          stroke: false,
          fillColor: '#42B883'
        },
        iconCreateFunction: (cluster) => {
          const html = `<span>${cluster.getChildCount()}</span>`;
          return L.divIcon({
            className: `CountryClusterIcon`,
            html,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
          });
        }
      };
    }
  },
  watch: {
    activeCountryAndMapReady: {
      immediate: true,
      handler (id, old) {
        if (old) {
          this.countryCenterIcons[old] = this.iconGenerator(old, false);
        }
        if (id) {
          this.countryCenterIcons[id] = this.iconGenerator(id, true);
        }
      }
    }
  },
  mounted () {
    this.$root.$on('map:center-on', this.centerOn);
    this.$root.$on('map:fit-on', this.fitOn);
    this.$root.$on('map:zoom-at', this.zoomAt);
    this.iconsGenerator();
  },
  beforeDestroy () {
    this.$root.$off(['map:center-on', 'map:fit-on', 'map:zoom-at']);
  },
  methods: {
    ...mapActions({
      setCurrentZoom: 'landing/setCurrentZoom',
      setMapReady: 'landing/setMapReady',
      setSelectedCountry: 'landing/setSelectedCountry',
      setActiveCountry: 'landing/setActiveCountry',
      setActiveTab: 'landing/setProjectBoxActiveTab',
      setActiveSubLevel: 'landing/setActiveSubLevel'
    }),
    centerOn (latlng, zoom = 13) {
      if (this.$refs.mainMap && this.$refs.mainMap.mapObject) {
        this.$refs.mainMap.mapObject.flyTo(latlng, zoom);
      }
    },
    fitOn (bounds) {
      if (this.$refs.mainMap && this.$refs.mainMap.mapObject) {
        this.$refs.mainMap.mapObject.fitBounds(bounds);
      }
    },
    zoomAt (zoom) {
      if (this.$refs.mainMap && this.$refs.mainMap.mapObject) {
        this.$refs.mainMap.mapObject.setZoom(zoom);
      }
    },
    zoomChangeHandler (event) {
      this.setCurrentZoom(event.target.getZoom());
    },
    iconGenerator (id, isActive) {
      const additionalClass = isActive ? 'ActiveCountry' : '';
      const html = `<span>${this.getCountryProjects(id).length}</span>`;
      return L.divIcon({
        className: `CountryCenterIcon ${additionalClass}`,
        html,
        iconSize: [27, 44],
        iconAnchor: [13.5, 44]
      });
    },
    iconsGenerator () {
      const icons = {};
      this.countriesPin.forEach(cp => {
        icons[cp.id] = this.iconGenerator(cp.id);
      });
      this.countryCenterIcons = icons;
    }
  }
};

export default MapMixin;
