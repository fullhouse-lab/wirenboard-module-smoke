var smoke = require("smoke");

smoke.start({
	id: "smoke",
	title: "Smoke",
	sensors: [
    { name: "s_2floor",   device: "wb-gpio", control: "EXT2_IN1", activationValue: 1 },
    { name: "s_boiler",   device: "wb-gpio", control: "EXT2_IN2", activationValue: 1 },
    { name: "s_kitchen",  device: "wb-gpio", control: "EXT2_IN3", activationValue: 1 },
    { name: "s_shield",   device: "wb-gpio", control: "EXT2_IN4", activationValue: 1 },
	],
	power: { device: "wb-gpio",	control: "EXT3_R3A1" },
	onShot: function(shotsCount) {
		if (shotsCount) {
			log("Smoke found: " + shotsCount + " times");
		} else {
			log("Smoke found");
		}

		// //  siren on  //
		// dev["siren"]["siren"] = true;
    //
		// //  email  //
		// dev["email_manager"]["send"] = "Обнаружено задымление !!";
    //
		// //  sms  //
		// dev["sms_manager"]["send"] = "Smoke found !!";
	},
	onGone: function() {
		// //  siren off  //
		// dev["siren"]["siren"] = false;
	}
});
