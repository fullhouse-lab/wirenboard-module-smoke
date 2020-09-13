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
  }
]
```
