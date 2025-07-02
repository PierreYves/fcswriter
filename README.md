# fcswriter

Create FCS (Flowjo) file from javascript

---

## How to use it

```javascript
import { FCSWriter } from 'fcswriter';

const fcsfile = new FCSWriter();

fcsfile.setParameters([
    {
        name: 'Label 1',
        range: 1000
    },
    {
        name: 'Label 2',
        range: 50
    }
]);

// Must be a flat array containing values for all events and all parameters
const data = new Float32Array([123.12, 34.56, 412.21, 0.56]);

fcsfile.download('myfile', data); // Triggers direct download

// OR

const fileContent = fcsfile.build(data); // Return a Uint8Array<ArrayBuffer>
```

## Known limitations

* Handles only events and parameters (no gates, no analysis segment, ...)
* Does not support multiple datasets (as per FCS 3.1 specs)
* May encounter issues with **very large** datasets (> 1.000.000 events)

