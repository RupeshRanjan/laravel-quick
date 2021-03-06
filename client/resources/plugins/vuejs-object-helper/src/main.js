import Vue from 'vue'

export default  {

	/*
	 |----------------------------------------------
	 | To get the value of key from the given object
	 |----------------------------------------------
	 * @param obj => Object
	 * @param props => String, Array, [Object key path],
	 * @param defaultValue => Any, If the key does not exists in object then return the default value.
	 */
	getProp: function (obj, props, defaultValue) {

		props = typeof props === "string" ? props.split('.') : props;

		const prop = props.shift()
		if (obj[prop] === undefined || !props.length) {

			return obj[prop] === undefined  ? defaultValue: obj[prop]; 
		}
		return this.getProp(obj[prop], props)
	},
	/*
	 |------------------------------------------------
	 | To delete the key from the given object
	 |-----------------------------------------------
	 * @param obj => Object
	 * @param props => String, Array, [Object key path],
	 */

	deleteProp: function (obj, props) {

		props = typeof props === "string" ? props.split('.') : props;

		const prop = props.shift()

		if (!obj[prop]) {
			return
		}

		if (!props.length) {
			Vue.delete(obj, prop)
			return
		}
		this.deleteProp(obj[prop], props)
	},
	/*
	 |----------------------------------------------
	 | To set the value of key in the given object
	 |----------------------------------------------
	 * @param obj => Object
	 * @param props => String, Array, [Object key path],
	 * @param value => Any, [key value]
	 */
	setProp: function (obj, props, value) {
		
		props = typeof props === "string" ? props.split('.') : props;
		const prop = props.shift()
		
		if (!obj[prop]) {

			Vue.set(obj, prop, (props.length == 1   && isNaN(parseInt(props[0])) === false ? [] : {}) )
		}
		if (!props.length) {

			if ( this.isObject(value) ) {

			  var preValue = obj[prop] ? obj[prop]: {};
			  Vue.set(obj, prop, {...preValue, ...value} );

			} else {

			  Vue.set(obj, prop, value);
			}

			return
		}
		this.setProp(obj[prop], props, value)
	},
	/*
	 |----------------------------------------------
	 | To push the value into the Array
	 |----------------------------------------------
	 * @param obj => Object
	 * @param props => String, Array, [Object key path],
	 * @param value => Array | Object | String,
	 * @param listUniqueKeyName => String, If you want to check the unique object before adding.
	 */
	pushProp: function(obj, props, value, listUniqueKeyName) {
	  	
	  	props = typeof props === "string" ? props.split('.') : props;
	  	// Convert the value into Array
		value = !this.isArray(value) ? [value] : value;

		const prop = props.shift()

		if (!obj[prop]) {
			Vue.set(obj, prop, {})
		}
		if (!props.length) {

			if (obj[prop] !== undefined) {

				let items = obj[prop];

				// Storeing the items which were present before updating..
				let first_items = Object.assign([], items);
				let max_length = first_items.length;

				

				value.map(function(v, index) {

					let isAlreadyPresent = null;

					if(listUniqueKeyName) {

					    first_items.map((fi) => {

					        if(fi[listUniqueKeyName] == v[listUniqueKeyName]) {
					            isAlreadyPresent = true;
					        }
					    })
					}

					if(isAlreadyPresent=== null) {

						//console.log('Herereee', max_length)
					  	Vue.set(items, max_length++, v );
					}

				});

			}

			 else {

			  Vue.set(obj, prop, value);

			}

			return
		}

		this.pushProp(obj[prop], props, value, listUniqueKeyName)
	},
	/*
	 |----------------------------------------------
	 | To unshift the value into the Array
	 |----------------------------------------------
	 * @param obj => Object
	 * @param props => String, Array, [Object key path],
	 * @param value => Array | Object | String,
	 * @param listUniqueKeyName => String, If you want to check the unique object before adding.
	 */
	unshiftProp: function (obj, props, value, listUniqueKeyName) {
		
		props = typeof props === "string" ? props.split('.') : props;
		// Convert the value into Array
		value = !this.isArray(value) ? [value] : value;

		const prop = props.shift()
		
		if (!obj[prop]) {

			Vue.set(obj, prop, !props.length ? [] : {})
		}
		if (!props.length) {

			if (obj[prop] !== undefined) {
		
				let items = obj[prop];

				// Storeing the items which were present before updating..
				let first_items = Object.assign([], items);

				let max_length = items.length;

				
				
				value.map(function(v, index) {

					let isAlreadyPresent = null;

					if(listUniqueKeyName) {

					    first_items.map((fi) => {

					        if(fi[listUniqueKeyName] == v[listUniqueKeyName]) {
					            isAlreadyPresent = true;
					        }
					    })
					}

					if(isAlreadyPresent === null) {
						
						items.unshift(v);
					}
				});

			} else {

				Vue.set(obj, prop, value);
			}

			return
		}

		this.unshiftProp(obj[prop], props, value)
	},
	/*
	 |------------------
	 | To check the given object'constructor is array or not
	 |-----------------------------------------
	 * @param value => Object
	 */
	isArray: function (value) {

	  return value && typeof value === 'object' && value.constructor === Array;
	},
	/*
	 |------------------
	 | To check the given object'constructor is Object or not
	 |-----------------------------------------
	 * @param value => Object
	 */
	isObject: function (value) {
	  return value && typeof value === 'object' && value.constructor === Object;
	},

	/**
	* Covert Query string to Object
	*/
	queryStringToObject: function (url) {
	  
	  var params = {};
	  
	  var parser = document.createElement('a');
	  parser.href = url;
	  var query = parser.search.substring(1);
	  var vars = query.split('&');
	  for (var i = 0; i < vars.length; i++) {
	  var pair = vars[i].split('=');
	      params[pair[0]] = decodeURIComponent(pair[1]);
	  }
	  return params;
	},
	/**
	* Convert Query Object to Query String
	* @param obj 
	* @param prefix 
	*/
	objectToQueryString: function(obj, prefix)  {

		var str = [],
		p;

		for (p in obj) {
		  if (obj.hasOwnProperty(p)) {
		    var k = prefix ? prefix + "[" + p + "]" : p,
		      v = obj[p];
		    str.push((v !== null && typeof v === "object") ?
		      this.queryString(v, k) :
		      encodeURIComponent(k) + "=" + encodeURIComponent(v? v : ''));
		  }
		}
		return str.join("&");
	}
}
