//  session - time between guard activate/deactivate
//  session_max_shots
//    0 - infinity
//    X - number of fire shots for each session

// TODO: check after reboot
// TODO: enabled/disabled - prevent/react current

var MODULE_NAME 		= "smoke";
var MODULE_VERSION  = "v.1.9";

var data = {};

exports.start = function(config) {
	if (!validateConfig(config)) return;

	//  init data  //
	data[config.id] = {};
	data[config.id].timer_shotDuration = null;

	//  device  //
	createDevice(config);

	//  rules  //
	createRule_BTN_sessionReset(config.id, config.onGone);
	createRule_BTN_test(config.id);
	createRule_VALUE_smoke(config.id, config.onShot, config.onGone);
	config.sensors.forEach( function(item) {
		createRule_externalSensor(config.id,
				item.device,
		  	item.control,
		  	item.name,
				(item.activationValue) ? item.activationValue : 1);
		createRule_VALUE_sensor(config.id, item.name);
	});

  log(config.id + ": Started (" + MODULE_NAME + " " + MODULE_VERSION + ")");
};

//  Validate config  //

var validateConfig = function(_config) {
  if (!_config) {
    log("Error: " + MODULE_NAME + ": No config");
    return false;
  }

  if (!_config.id || !_config.id.length) {
    log("Error: " + MODULE_NAME + ": Config: Bad id");
    return false;
  }

  if (!_config.title || !_config.title.length) {
    log("Error: " + MODULE_NAME + ": Config: Bad title");
    return false;
  }

  if (!_config.sensors) {
    log("Error: " + MODULE_NAME + ": Config: No sensors");
    return false;
  }

  return true;
}

//
//  Device  //
//

function createDevice(config) {
	var cells = {
		enabled: 								{ type: "switch", value: true, readonly: false },
		shot_timeout_sec: 			{ type: "range",  max: 300, value: 60, readonly: false },
		session_max_shots: 			{ type: "range",  max: 10, 	value: 3, readonly: false },
		session_shots_counter: 	{ type: "value", 	value: 0, readonly: false },
		session_reset: 					{ type: "pushbutton", readonly: false },
		smoke: 									{ type: "value", 	value: 0, readonly: false },
		test: 									{ type: "pushbutton", readonly: false },
	}

	config.sensors.forEach( function(item) {
	  cells[item.name] = { type: "value", value: 0, readonly: false };
	});

	defineVirtualDevice(config.id, {
	  title: config.title,
	  cells: cells
	});
}

//
//  Rules  //
//

function createRule_BTN_test(device_id) {
	defineRule({
    whenChanged: device_id + "/test",
    then: function (newValue, devName, cellName) {
			//  set smoke  //
			if(dev[device_id]["smoke"] !== 1) dev[device_id]["smoke"] = 1;
		}
	});
}

function createRule_VALUE_smoke(device_id, cb_onShot, cb_onGone) {
	defineRule({
    whenChanged: device_id + "/smoke",
    then: function (newValue, devName, cellName) {
			//  check smoke found  //
			if (!newValue) return;

			//  increment shots and emit  //
    	if (dev[device_id]["session_max_shots"] !== 0) {
    		dev[device_id]["session_shots_counter"] += 1;
				if (cb_onShot) cb_onShot(dev[device_id]["session_shots_counter"]);
    	} else {
				if (cb_onShot) cb_onShot(0);
    	}

      //  start timer if neccessery  //
			// if (timer_shotDuration) clearTimeout(timer_shotDuration); // already checked
			if(!dev[device_id]["shot_timeout_sec"]) return;
      data[device_id].timer_shotDuration = setTimeout(function() {
				data[device_id].timer_shotDuration = null;
				dev[device_id]["smoke"] = 0;
      	//  gone  //
	      if (cb_onGone) cb_onGone();
      }, dev[device_id]["shot_timeout_sec"] * 1000);
		}
	});
}

function createRule_externalSensor(device_id, device, control, name, activationValue) {
	defineRule({
    whenChanged: device + "/" + control,
    then: function (newValue, devName, cellName) {
    	//  get values  //
    	var value = (newValue == activationValue) ? 1 : 0;

			//  save new  //
      if (dev[device_id][name] !== value) dev[device_id][name] = value;
		}
	});
}

function createRule_VALUE_sensor(device_id, name) {
	defineRule({
    whenChanged: device_id + "/" + name,
    then: function (newValue, devName, cellName) {
			//  check smoke found  //
			if (!newValue) return;

			//  check enabled  //
      if (!dev[device_id]["enabled"]) return;

			//  check session max shots  //
    	if (dev[device_id]["session_max_shots"] !== 0
    	&& dev[device_id]["session_shots_counter"] >= dev[device_id]["session_max_shots"]) return;

			//  check already found  //
			if (dev[device_id]["smoke"]) return;

			//  set smoke  //
			dev[device_id]["smoke"] = 1;
		}
	});
}

function createRule_BTN_sessionReset(device_id, cb_onGone) {
  defineRule({
    whenChanged: device_id + "/session_reset",
    then: function (newValue, devName, cellName)  {
			//  clear smoke flag  //
			if (dev[device_id]["smoke"] !== 0) dev[device_id]["smoke"] = 0;

			//  clear shots counter  //
      dev[device_id]["session_shots_counter"] = 0;

			//  clear timer  //
			if (data[device_id].timer_shotDuration) {
				clearTimeout(data[device_id].timer_shotDuration);
				data[device_id].timer_shotDuration = null;
			}

			if (cb_onGone) cb_onGone();
    }
  });
}
