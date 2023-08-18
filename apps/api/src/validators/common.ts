import { Validall } from "@pestras/validall";
import { Validators } from ".";
import { Serial } from '@pestras/shared/util';

new Validall(Validators.REF, { $type: 'string', $message: '{{prop}}invalidRef' });

new Validall(Validators.SERIAL, { $type: 'string', $regex: Serial.regex, $message: '{{prop}}invalidSerial' });

new Validall(Validators.NAME, { $type: 'string', $message: '{{prop}}IsInvalid' });

new Validall(Validators.SUMMARY, {
  $and: [
    { $type: 'string', $message: 'invalidSummary' },
    { $length: { $lt: 500 }, $message: 'invalidSummary' }
  ]
});

new Validall(Validators.GEOLOCATION, {
  lat: { $type: 'number', $message: "gelLocationLatMustBeOfTypeNumber" },
  lng: { $type: 'number', $message: "gelLocationLngMustBeOfTypeNumber" }
});