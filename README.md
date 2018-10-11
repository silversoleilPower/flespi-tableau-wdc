# flespi-tableau-wdc

![Logo](https://github.com/flespi-software/flespi-tableau-wdc/blob/master/flespitableau.png?raw=true "flespi tableau wdc logo")

Web Data Connector for Tableau to fetch telemetry messages from the tracking devices registered in the [flespi platform](https://flespi.io/).

## How to use flespi-tableau-wdc

- Download, install, and run [Tableau](https://www.tableau.com/)
- In the left-side Connect menu click More in the To a Server section 
- Pick **Web Data Connector** option
- You’ll be prompted to enter the URL of the connector. 
- Paste this one: **https://github.com/flespi-software/flespi-tableau-wdc/flespidata.html**
- Once you click Enter, a dialog will pop up.
- Fill in all fields

| Param             | Value type                | Where to get it|
| ----------------- |:-------------------------:|---------------:|
| flespi token      | *string*                  |flespi.io       |
| flespi device ID  | *integer value*           |flespi.io       |
| number of messages| *integer value*           |you decide      |

- Click **Get flespi data** button

### Changelog

1.0.0
  Initial implementation
