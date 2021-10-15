/*
 Vue.js Geocledian parcel data component
 created: 2020-04-30, jsommer
 updated: 2021-04-13, jsommer
 version: 0.5
*/
"use strict";

//language strings
const gcParcelViewLocales = {
  "en": {
    "options": { "title": "Parcel Details" },
    "fields": { 
      "id": "ID",
      "crop": "Crop",
      "entity": "Entity",
      "name": "Name",
      "area": "Area",
      "planting": "Seeding",
      "harvest": "Harvest",
      "userdata": "User data",
      "promotion": "Promotion"
    },
    "pagination": { 
      "title": "Pagination", 
      "of": "of", 
      "previous": "Previous",
      "next": "Next",
      "start": "Start",
      "end": "End"
    }
  },
  "de": {
    "options": { "title": "Felddetails" },
    "fields": { 
      "id": "Nr",
      "crop": "Fruchtart",
      "entity": "Entität",
      "name": "Name",
      "area": "Fläche",
      "planting": "Pflanzung",
      "harvest": "Ernte",
      "userdata": "Zusatzdaten",
      "promotion": "Demo"
    },
    "pagination": { 
      "title": "Navigation", 
      "of": "von",
      "previous": "Vorherige",
      "next": "Nächste",
      "start": "Anfang",
      "end": "Ende"
    }
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
      default: 'parcelId,name,crop,entity,planting,harvest,area,userdata,promotion'
    },
    gcLayout: {
      type: String,
      default: 'vertical' // or horizontal
    },
    gcAvailableOptions: {
      type: String,
      default: 'widgetTitle,pagination'
    },
    gcWidgetCollapsed: {
      type: Boolean,
      default: false // or false
    },
    gcLanguage: {
      type: String,
      default: 'en' // 'en' | 'de'
    },
    gcFilterString: {
      type: String,
      default: ''
    },
    gcLimit: {
      type: Number,
      default: 250
    },
    gcOffset: {
      type: Number,
      default: 0
    },
  },
  template: `<div :id="this.gcWidgetId" class="">

                <p :class="['gc-options-title', 'is-size-6', 'is-inline-block', gcWidgetCollapsed ? 'is-grey' : 'is-orange']" 
                  style="cursor: pointer; margin-bottom: 1em;"    
                  v-on:click="toggleParcelData" 
                  v-show="availableOptions.includes('widgetTitle')">
                    <!--i class="fas fa-th fa-sm"></i --> {{ $t('options.title')}}
                  <i :class="[!gcWidgetCollapsed ? '': 'is-active', 'fas', 'fa-angle-down', 'fa-sm']"></i>
                </p>

                <!-- parcel data container -->
                <div :class="[!gcWidgetCollapsed ? '': 'is-hidden', layoutCSSMap['alignment'][gcLayout]]" style="width: 100%;">
                  <div :class="['field', 'gc-parcel-field-'+gcLayout]" v-show="availableFields.includes('parcelId')">
                    <label class="label is-grey is-small"> {{ $t('fields.id') }} - {{ $t('fields.name') }} </label>
                    <div class="control">
                      <div class="select is-small" style="max-width: 15em;" v-if="currentParcel">
                        <select v-model="currentParcel">
                          <option v-for="item in parcels" v-bind:value="item">
                            {{  item.parcel_id + "  -  " + item.name}}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div :class="['field', 'gc-parcel-field-'+gcLayout]" v-show="availableFields.includes('name')">
                    <label class="label is-grey is-small has-text-left"> {{ $t('fields.name') }} </label>
                    <div class="control">
                      <span class="input is-static is-small"
                            v-if="parcels.length > 0 && currentParcel"> {{ currentParcel.name}}</span>
                    </div>
                  </div>
                  <div :class="['field', 'gc-parcel-field-'+gcLayout]" v-show="availableFields.includes('entity')">
                    <label class="label is-grey is-small"> {{ $t('fields.entity') }} </label>
                    <div class="control"><span class="input is-static is-small" 
                          v-if="parcels.length > 0 && currentParcel">{{ currentParcel.entity }}</span>
                    </div>
                  </div>
                  <div :class="['field', 'gc-parcel-field-'+gcLayout]" v-show="availableFields.includes('crop')">
                    <label class="label is-grey is-small"> {{ $t('fields.crop') }} </label>
                    <div class="control"><span class="input is-static is-small" 
                          v-if="parcels.length > 0 && currentParcel">{{ currentParcel.crop }}</span>
                    </div>
                  </div>
                  <div :class="['field', 'gc-parcel-field-'+gcLayout]" v-show="availableFields.includes('planting')">
                    <label class="label is-grey is-small"> {{ $t('fields.planting') }} </label>
                    <div class="control"><span class="input is-static is-small" 
                          v-if="parcels.length > 0 && currentParcel">{{ currentParcel.planting }}</span>
                    </div>
                  </div>
                  <div :class="['field', 'gc-parcel-field-'+gcLayout]" v-show="availableFields.includes('harvest')">
                    <label class="label is-grey is-small"> {{ $t('fields.harvest') }} </label>
                    <div class="control"><span class="input is-static is-small" 
                          v-if="parcels.length > 0 && currentParcel">{{ currentParcel.harvest }}</span>
                    </div>
                  </div>
                  <div :class="['field', 'gc-parcel-field-'+gcLayout]" v-show="availableFields.includes('area')">
                    <label class="label is-grey is-small"> {{ $t('fields.area') }} </label>
                    <div class="control"><span class="input is-static is-small" 
                          v-if="parcels.length > 0 && currentParcel">{{ currentParcel.area }}</span>
                    </div>
                  </div>
                  <div :class="['field', 'gc-parcel-field-'+gcLayout]" v-show="availableFields.includes('userdata')">
                  <label class="label is-grey is-small"> {{ $t('fields.userdata') }} </label>
                  <div class="control"><span class="input is-static is-small" 
                        v-if="parcels.length > 0 && currentParcel">{{ JSON.stringify(currentParcel.userdata) }}</span>
                  </div>
                </div>
                  <div :class="['field', 'gc-parcel-field-'+gcLayout]" v-show="availableFields.includes('promotion')">
                    <label class="label is-grey is-small"> {{ $t('fields.promotion') }} </label>
                    <div class="control"><span class="input is-static is-small" 
                          v-if="parcels.length > 0 && currentParcel">{{ currentParcel.promotion }}</span>
                    </div>
                  </div>

                  <!-- pagination -->
                  <div :class="['field', 'gc-parcel-field-'+gcLayout]" v-show="availableOptions.includes('pagination')">
                    <label class="label is-grey is-small"> {{ $t('pagination.title') }} </label>
                    <div class="control">
                      <nav class="pagination is-small is-centered" role="navigation" aria-label="pagination">
                        <button class="button pagination-previous is-light is-orange" v-on:click="setPaginationStart()" v-bind:title="$t('pagination.start')">
                          <i class="fas fa-fast-backward"></i>
                        </button>
                        <button id="btnPagePrev" class="button pagination-previous is-light is-orange" v-on:click="setPaginationOffset(-pagingStep)" v-bind:title="$t('pagination.previous') + ' ' + pagingStep">
                          <i class="fas fa-step-backward"></i>
                        </button>
                        <button id="btnPageNext" class="button pagination-next is-light is-orange" v-on:click="setPaginationOffset(pagingStep)" v-bind:title="$t('pagination.next') + ' ' + pagingStep">
                          <i class="fas fa-step-forward"></i>
                        </button>
                        <button class="button pagination-next is-light is-orange" v-on:click="setPaginationEnd();" v-bind:title="$t('pagination.end')">
                          <i class="fas fa-fast-forward"></i>
                        </button>
                        <ul v-if="(total_parcel_count - offset) < pagingStep" id="parcel_paging" 
                            style="flex-wrap: nowrap !important; -ms-flex-wrap: nowrap !important" 
                            class="button pagination-list has-text-grey is-small">
                          <li><span class="">{{offset}}&nbsp;</span></li>
                          <li><span class=""> - </span></li>
                          <li><span class="">&nbsp;{{total_parcel_count}}&nbsp;</span></li>
                          <li><span class=""> {{ $t('pagination.of')}} {{total_parcel_count}}</span></li>
                        </ul>
                        <ul v-else id="parcel_paging" 
                            style="flex-wrap: nowrap !important; -ms-flex-wrap: nowrap !important" 
                            class="button pagination-list has-text-grey is-small">
                          <li><span class="">{{offset}}&nbsp;</span></li>
                          <li><span class=""> - </span></li>
                          <li><span class="">&nbsp;{{(offset + pagingStep)}}&nbsp;</span></li>
                          <li><span class=""> {{ $t('pagination.of')}} {{total_parcel_count}}</span></li>
                        </ul>
                    </nav>
                  <!-- <div class="field-label is-small has-text-left pagination-link" >Total: {{total_parcel_count}}</div> -->
                  </div>  
                  <!-- pagination -->
                
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
        planting: "",
        harvest: "",
        layoutCSSMap: { "alignment": {"vertical": "is-inline-block", "horizontal": "is-flex" }},
        isloading: false
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
    apiMajorVersion: {
      get () {
        if (this.apiBaseUrl === "/agknow/api/v3") {
          return 3
        }
        if (this.apiBaseUrl === "/agknow/api/v4") {
          return 4
        }
      }
    },
    filterString: {
      get: function () {
        return this.gcFilterString;
      }
    },
    limit: {
      get: function() {
        // will always reflect prop's value 
        return this.gcLimit;
      }
    },
    pagingStep: {
      get: function() {
        // will always reflect prop's value 
        return this.limit;
      }
    },
    offset: {
      get: function() {
        // will always reflect prop's value 
        return this.gcOffset;
      },
      set: function (newValue) {       
        //notify root - through props it will change this.gcOffset
        this.$root.$emit('offsetChange', newValue);
      }
    },
    // only external parcels - no internal structure!
    parcels: {
      get: function () { 
        console.debug("gc-parceldata - parcels() getter");
        return this.gcParcels;
      },
      set: function (newValue) {
        console.debug("gc-parceldata - parcels setter");
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
    parcels(newValue, oldValue) {
      //this.getParcelTotalCount(this.filterString);
    },
    currentParcel(newValue, oldValue) {
      this.selectedParcelId = newValue.parcel_id;
      console.debug("currentParcelChange - gc-parceldata");
      console.debug(newValue);
      this.$root.$emit("phStartdateChange", newValue.planting);
      this.$root.$emit("phEnddateChange", newValue.harvest);
    },
    currentLanguage(newValue, oldValue) {
      this.changeLanguage();
    },
    selectedParcelId(newValue, oldValue) {
      //get details of current parcel
      this.getParcelsAttributes(newValue);
    },
    filterString(newValue, oldValue) {
      //TODO: duplicate parcels!
      console.debug("gc-parceldata - filterString changed")
      console.debug(newValue);
      this.getParcelTotalCount(newValue);
    },
    offset(newValue,oldValue) {
      //fetch next batch of parcels
      this.getParcelTotalCount(this.filterString);
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
      console.debug(params)
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
            } else {
              this.pagingStep = 250;
            }

            if (this.total_parcel_count == 0) {
              this.parcels = [];
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
        let limit = this.limit; //this.pagingStep;

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

            // Dont use root parcel data reference in the for loop with push!
            var internalParcels = [];

            if (tmp.content.length == 0) {
                //clear details and map
                return;
            }

            for (let i = 0; i < tmp.content.length; i++) {
              let item = tmp.content[i];
              internalParcels.push(item);
            }

            // now set the root's parcels in one go
            this.parcels = internalParcels;

            // select first parcel if not set
            if (this.selectedParcelId > 0) {

              console.debug(internalParcels.find(p => p.parcel_id === this.selectedParcelId));

              // check if selectedParcelId is part of the parcel list first
              if (this.parcels.find(p => p.parcel_id === this.selectedParcelId) !== undefined) {
                // reset selectedParcelId
                console.debug("setting first parcel as current parcel id!");
                this.selectedParcelId = internalParcels[0].parcel_id;
              }
            }
            else {
              // reset selectedParcelId
              console.debug(this.parcels);
              console.debug("setting first parcel as current parcel id!");
              this.selectedParcelId = internalParcels[0].parcel_id;
            }

            console.debug("selected parcel id: "+ this.selectedParcelId);

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

      if (!parcel_id || parcel_id < 0) {
        return
      }

      const endpoint = "/parcels/" + parcel_id;

      //Show requests on the DEBUG console for developers
      console.debug("getParcelsAttributes()");
      console.debug("GET " + this.getApiUrl(endpoint));
      
      // Axios implement start
      axios({
        method: 'GET',
        url: this.getApiUrl(endpoint),
      }).then(function (response) {
        if(response.status === 200){
          var tmp = response.data;
          var row = this.currentParcel;

          let obj;
          let resultNotEmpty;
          if (this.apiMajorVersion === 3) {
            console.debug(this.apiMajorVersion)
            resultNotEmpty = tmp.content.length > 0 ? true : false;
            obj = tmp.content[0];
          }
          if (this.apiMajorVersion === 4) {
            obj = tmp.content;
            resultNotEmpty = obj !== undefined ? true : false;
          }
          if (resultNotEmpty) {
            console.debug(row);
            // add new attributes via Vue.set
            // it's ok always to use the first element, because it has been filtered
            // by unique parcel_id
            Vue.set(row, "area", obj.area);
            Vue.set(row, "planting", obj.planting);
            Vue.set(row, "harvest", obj.harvest);
            Vue.set(row, "startdate", obj.startdate);
            Vue.set(row, "enddate", obj.enddate);
            Vue.set(row, "promotion", obj.promotion);
            //Vue.set(row, "centroid", obj.centroid);
            //Vue.set(row, "geometry", obj.geometry);
            
          }
        } else {
          console.log(response)
        }
      }.bind(this)).catch(err => {
        console.log("err= " + err);
      })
      // Axios implement end
    },
    setPaginationOffset(offset) {

      console.debug("change: "+ offset);
      console.debug("current val: "+this.offset);
  
      let newOffset = this.offset + offset;
      if (newOffset >= 0) {
          console.debug("new offset: "+ newOffset);
          
          if (newOffset <= this.total_parcel_count) {
              console.debug("setting offset");
              this.offset += offset;
          }
          else {
              console.debug("total_parcel_count reached!")
              console.debug("total: "+this.total_parcel_count);
              console.debug("offset: "+this.offset);
          }
      }
      else {
          console.debug("Min_offset reached!")
          this.offset = 0;
          console.debug(this.offset);
      }
    },
    setPaginationStart() {
      this.isloading = true;
      this.offset = 0;
    },
    setPaginationEnd() {
      this.isloading = true;
      this.offset = this.total_parcel_count - this.pagingStep;
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
