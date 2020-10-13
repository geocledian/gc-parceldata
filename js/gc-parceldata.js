/*
 Vue.js Geocledian parcel data component
 created:     2020-04-30, jsommer
 last update: 2020-06-04, jsommer
 version: 0.5
*/
"use strict";

//language strings
const gcParcelViewLocales = {
  "en": {
    "options": { "title": "Parcels" },
    "fields": { 
      "id": "ID",
      "crop": "Crop",
      "entity": "Entity",
      "name": "Name",
      "area": "Area",
      "planting": "Seeding",
      "harvest": "Harvest",
      "promotion": "Promotion"
    },
  },
  "de": {
    "options": { "title": "Felder" },
    "fields": { 
      "id": "Nr",
      "crop": "Fruchtart",
      "entity": "Entität",
      "name": "Name",
      "area": "Fläche",
      "planting": "Pflanzung",
      "harvest": "Ernte",
      "promotion": "Demo"
    },
  },
}

Vue.component('gc-parceldata', {
  props: {
    gcWidgetId: {
      type: String,
      default: 'parceldata1',
      required: true
    },
    gcApikey: {
      type: String,
      default: '39553fb7-7f6f-4945-9b84-a4c8745bdbec'
    },
    gcHost: {
      type: String,
      default: 'geocledian.com'
    },
    gcProxy: {
      type: String,
      default: undefined
    },
    gcApiBaseUrl: {
      type: String,
      default: "/agknow/api/v3"
    },
    gcApiSecure: {
      type: Boolean,
      default: true
    },   
    gcInitialLoading: {
      type: Boolean,
      default: true // true: load first parcels by filter or false: wait for parcels to be set externally: gcParcels
    },
    gcParcels: { 
      type: Array, 
      default: function () { return [] }
    },
    gcVisibleParcelIds: {      
      type: String,
      default: ''
    },
    gcSelectedParcelId: {      
      type: String,
      default: ''
    },
    gcAvailableFields: {
      type: String,
      default: 'parcelId,name,crop,entity,planting,harvest,area,promotion'
    },
    gcLayout: {
      type: String,
      default: 'vertical' // or horizontal
    },
    gcAvailableOptions: {
      type: String,
      default: 'widgetTitle'
    },
    gcWidgetCollapsed: {
      type: Boolean,
      default: true // or false
    },
    gcLanguage: {
      type: String,
      default: 'en' // 'en' | 'de'
    },
  },
  template: `<div :id="this.gcWidgetId" class="">

                <p class="gc-options-title is-size-6 is-inline-block is-orange" 
                  style="cursor: pointer; margin-bottom: 0.5em;"    
                  v-on:click="toggleParcelData" 
                  v-show="availableOptions.includes('widgetTitle')">
                    <!--i class="fas fa-th fa-sm"></i --> {{ $t('options.title')}}
                  <i :class="[gcWidgetCollapsed ? '': 'is-active', 'fas', 'fa-angle-down', 'fa-sm']"></i>
                </p>

                <!-- parcel data container -->
                <div :class="[gcWidgetCollapsed ? '': 'is-hidden', layoutCSSMap['alignment'][gcLayout]]" style="width: 100%;">
                  <div class="field gc-parcel-field" v-show="availableFields.includes('parcelId')">
                    <label class="label is-grey is-small"> {{ $t('fields.id') }} - {{ $t('fields.name') }} </label>
                    <div class="control">
                      <div class="select is-small" style="max-width: 20em;" v-if="currentParcel">
                        <select v-model="currentParcel">
                          <option v-for="item in parcels" v-bind:value="item">
                            {{  item.parcel_id + "  -  " + item.name}}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="field gc-parcel-field" v-show="availableFields.includes('name')">
                    <label class="label is-grey is-small has-text-left"> {{ $t('fields.name') }} </label>
                    <div class="control">
                      <span class="input is-static is-small"
                            v-if="parcels.length > 0 && currentParcel"> {{ currentParcel.name}}</span>
                    </div>
                  </div>
                  <div class="field gc-parcel-field" v-show="availableFields.includes('entity')">
                    <label class="label is-grey is-small"> {{ $t('fields.entity') }} </label>
                    <div class="control"><span class="input is-static is-small" 
                          v-if="parcels.length > 0 && currentParcel">{{ currentParcel.entity }}</span>
                    </div>
                  </div>
                  <div class="field gc-parcel-field" v-show="availableFields.includes('crop')">
                    <label class="label is-grey is-small"> {{ $t('fields.crop') }} </label>
                    <div class="control"><span class="input is-static is-small" 
                          v-if="parcels.length > 0 && currentParcel">{{ currentParcel.crop }}</span>
                    </div>
                  </div>
                  <div class="field gc-parcel-field" v-show="availableFields.includes('planting')">
                    <label class="label is-grey is-small"> {{ $t('fields.planting') }} </label>
                    <div class="control"><span class="input is-static is-small" 
                          v-if="parcels.length > 0 && currentParcel">{{ currentParcel.planting }}</span>
                    </div>
                  </div>
                  <div class="field gc-parcel-field" v-show="availableFields.includes('harvest')">
                    <label class="label is-grey is-small"> {{ $t('fields.harvest') }} </label>
                    <div class="control"><span class="input is-static is-small" 
                          v-if="parcels.length > 0 && currentParcel">{{ currentParcel.harvest }}</span>
                    </div>
                  </div>
                  <div class="field gc-parcel-field" v-show="availableFields.includes('area')">
                    <label class="label is-grey is-small"> {{ $t('fields.area') }} </label>
                    <div class="control"><span class="input is-static is-small" 
                          v-if="parcels.length > 0 && currentParcel">{{ currentParcel.area }}</span>
                    </div>
                  </div>
                  <div class="field gc-parcel-field" v-show="availableFields.includes('promotion')">
                    <label class="label is-grey is-small"> {{ $t('fields.promotion') }} </label>
                    <div class="control"><span class="input is-static is-small" 
                          v-if="parcels.length > 0 && currentParcel">{{ currentParcel.promotion }}</span>
                    </div>
                  </div>
                </div> <!-- parcel container -->

            </div><!-- gcWidgetId -->`,
  data: function () {
    console.debug("parceldata! - data()");
    return {
        total_parcel_count: 0,
        pagingStep: 250,
        promotion: undefined,
        crop: "",
        entity: "",
        name: "",
        layoutCSSMap: { "alignment": {"vertical": "is-inline-block", "horizontal": "is-flex" }}
    }
  },
  i18n: { 
    locale: this.currentLanguage,
    messages: gcParcelViewLocales
  },
  created: function () {
    console.debug("parceldata! - created()");
    this.changeLanguage();
  },
  /* when vue component is mounted (ready) on DOM node */
  mounted: function () {
    console.debug("parceldata! - mounted()");
    
    try {
      this.changeLanguage();
    } catch (ex) {}

    //initial data loading
    if (this.gcInitialLoading) {
      this.getParcelTotalCount(this.filterString);
    }
  },
  computed: {
    apiKey: {
      get: function () {
          return this.gcApikey;
      }
    },
    apiHost: {
        get: function () {
            return this.gcHost;
        }
    },
    apiBaseUrl: {
        get: function () {
            return this.gcApiBaseUrl;
      }
    },
    apiSecure: {
      get: function () {
          return this.gcApiSecure;
      }
    },
    filterString: {
        get: function () {
          // TODO offset + limit + paging
            let filterStr = "&crop="+this.crop +
                            "&entity="+ this.entity+
                            "&name="+ this.name;
            if (this.promotion) {
                filterStr += "&promotion="+ JSON.parse(this.promotion);
            }
            return filterStr;
        }
    },
    parcels: {
      get: function () { 
        console.debug("parcels() getter");
        console.debug(this.gcParcels);
        // show only these parcels with matching ids with parcelIds
        //if (this.visibleParcelIds.length > 0)
        //return this.gcParcels.filter(p => this.visibleParcelIds.includes(p.parcel_id+ "")); //convert to string for filtering
        return this.gcParcels;
      },
      set: function (newValue) {
        console.debug("parcels setter");
        this.$root.$emit('parcelsChange', newValue);
      }
    },
    visibleParcelIds: {
      get: function () { 
        return this.gcVisibleParcelIds;
      },
      set: function (newValue) {
        this.$root.$emit('visibleParcelIdsChange', newValue);
      }
    },
    selectedParcelId: {
      get: function () { 
        return this.gcSelectedParcelId;
      },
      set: function (newValue) {
        this.$root.$emit('selectedParcelIdChange', parseInt(newValue));
      }
    },
    availableFields: {
      get: function () {
        return this.gcAvailableFields.split(",");
      }
    },
    availableOptions: {
      get: function() {
        return (this.gcAvailableOptions.split(","));
      }
    },
    currentLanguage: {
      get: function() {
        // will always reflect prop's value 
        return this.gcLanguage;
      },
    },
    currentParcel: {
      get: function() {
        if (this.selectedParcelId > 0)
          return this.parcels.filter(p=>p.parcel_id + "" == this.selectedParcelId+ "" )[0];
        else
          return this.parcels[0]; // first element
      },
      set: function (newValue) {
        console.debug("currentParcel setter");
        console.debug(newValue);
        if (newValue) {
          // if currentParcel is changed via select control just emit the change of selectedParcelId
          this.selectedParcelId = newValue.parcel_id;
        }
      }
    }
  },
  watch: {
    gcParcels(newValue, oldValue) {
    },
    currentLanguage(newValue, oldValue) {
      this.changeLanguage();
    },
    selectedParcelId(newValue, oldValue) {
      //get details of current parcel
      this.getParcelsAttributes(newValue);
    }
  },
  methods: {  
    getApiUrl: function (endpoint) {
      /* handles requests directly against  geocledian endpoints with API keys
          or (if gcProxy is set)
        also requests against the URL of gcProxy prop without API-Key; then
        the proxy or that URL has to add the api key to the requests against geocledian endpoints
      */
      let protocol = 'http';

      if (this.apiSecure) {
        protocol += 's';
      }

      // if (this.apiEncodeParams) {
      //   endpoint = encodeURIComponent(endpoint);
      // }
      
      // with or without apikey depending on gcProxy property
      return (this.gcProxy ? 
                protocol + '://' + this.gcProxy + this.apiBaseUrl + endpoint  : 
                protocol + '://' + this.gcHost + this.apiBaseUrl + endpoint + "?key="+this.apiKey);
    },
    getParcelTotalCount: function (filterString) {

      const endpoint = "/parcels";
      let params;

      if (filterString) {
        params = filterString +
                  "&count=True";
      } else {
        params = "&count=True";
      }
      let xmlHttp = new XMLHttpRequest();
      let async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getParcelTotalCount()");
      console.debug("GET " + this.getApiUrl(endpoint) + params);

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          var tmp = JSON.parse(xmlHttp.responseText);

          if ("count" in tmp) {

            this.total_parcel_count = tmp.count;

            // minimum of 250
            if (this.total_parcel_count < this.pagingStep) {
              this.pagingStep = this.total_parcel_count;
            } /*else {
              this.pagingStep = 250;
            }*/

            if (this.total_parcel_count == 0) {
              return;

            } else {
              // now get all parcels
              this.getAllParcels(this.offset, filterString);
            }
          }
        }
      }.bind(this);
      xmlHttp.open("GET", this.getApiUrl(endpoint) + params, async);
      xmlHttp.send();
    },
    getAllParcels: function (offset, filterString) {

        //download in chunks of n parcels
        let limit = 6000; //this.pagingStep;

        const endpoint = "/parcels";
        let params = "&limit=" + limit; //set limit to maximum (default 1000)

        if (offset) {
            params = params + "&offset=" + offset;
        }
        if (filterString) {
            params = params + filterString;
        }

        let xmlHttp = new XMLHttpRequest();
        let async = true;

        //Show requests on the DEBUG console for developers
        console.debug("getAllParcels()");
        console.debug("GET " + this.getApiUrl(endpoint) + params);

        xmlHttp.onreadystatechange = function () {
          if (xmlHttp.readyState == 4) {
              var tmp = JSON.parse(xmlHttp.responseText);

              if (tmp.content == "key is not authorized") {
                  return;
              }

              this.parcels = [];

              if (tmp.content.length == 0) {
                  //clear details and map
                  return;
              }

              // let tmpParcels = [];
              for (var i = 0; i < tmp.content.length; i++) {
                  var item = tmp.content[i];
                  //tmpParcels.push(item);
                  this.parcels.push(item);
              }

              //only this triggers the setter of this.parcels 
              // not the push method!
              //this.parcels = tmpParcels;

              // select first parcel if not set
              console.debug("selected parcel id: "+ this.selectedParcelId);
              if (!this.selectedParcelId) {
                console.debug("setting first parcel as current parcel id!");
                this.selectedParcelId = this.parcels[0].parcel_id;
              }

              // get detail parcel data now for current
              // this is the case at the time of loading of the widget
              // later it will update the parcel's details with the watcher on selectedParcelId
              this.getParcelsAttributes(this.selectedParcelId);
          }
        }.bind(this);
        xmlHttp.open("GET", this.getApiUrl(endpoint) + params, async);
        xmlHttp.send();
    },
    getParcelsAttributes(parcel_id) {

      const endpoint = "/parcels/" + parcel_id;
      let xmlHttp = new XMLHttpRequest();
      let async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getParcelsAttributes()");
      console.debug("GET " + this.getApiUrl(endpoint));

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          var tmp = JSON.parse(xmlHttp.responseText);
          var row = this.currentParcel;

          if (tmp.content.length > 0) {
            console.debug(row);
            // add new attributes via Vue.set
            // it's ok always to use the first element, because it has been filtered
            // by unique parcel_id
            Vue.set(row, "area", tmp.content[0].area);
            Vue.set(row, "planting", tmp.content[0].planting);
            Vue.set(row, "harvest", tmp.content[0].harvest);
            Vue.set(row, "startdate", tmp.content[0].startdate);
            Vue.set(row, "enddate", tmp.content[0].enddate);
            Vue.set(row, "lastupdate", tmp.content[0].lastupdate);
            // Vue.set(row, "centroid", tmp.content[0].centroid);
            // Vue.set(row, "geometry", tmp.content[0].geometry);
          }

        }
      }.bind(this);
      xmlHttp.open("GET", this.getApiUrl(endpoint), async);
      xmlHttp.send();
    },
    toggleParcelData() {
      this.gcWidgetCollapsed = !this.gcWidgetCollapsed;
    },
    setCurrentParcelId(event) {
    },
    changeLanguage() {
      this.$i18n.locale = this.currentLanguage;
    },
    /* helper functions */
    formatDecimal(decimal, numberOfDecimals) {
      /* Helper function for formatting numbers to given number of decimals */

      var factor = 100;

      if (isNaN(parseFloat(decimal))) {
        return NaN;
      }
      if (numberOfDecimals == 1) {
        factor = 10;
      }
      if (numberOfDecimals == 2) {
        factor = 100;
      }
      if (numberOfDecimals == 3) {
        factor = 1000;
      }
      if (numberOfDecimals == 4) {
        factor = 10000;
      }
      if (numberOfDecimals == 5) {
        factor = 100000;
      }
      return Math.ceil(decimal * factor) / factor;
    },
  }
});
