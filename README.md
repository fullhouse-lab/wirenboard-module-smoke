Smoke manager

##  Readme in progress  ..

####  homebridge accessories
```json
"accessories": [
  {
    "comment": "-------------------------  Smoke: Boiler  -------------------------",
    "type": "smokeSensor",
    "name": "Дым Котельная",
    "topics": {
        "getSmokeDetected": "/devices/smoke/controls/s_home_smoke_2"
    },
    "integerValue": true,
    "accessory": "mqttthing"
  },
  {
      "comment": "-------------------------  Smoke: Power  -------------------------",
      "type": "switch",
      "name": "Дым Питание",
      "topics": {
          "getOn": "/devices/smoke/controls/power",
          "setOn": "/devices/smoke/controls/power/on"
      },
      "integerValue": true,
      "accessory": "mqttthing"
  }
]
```
