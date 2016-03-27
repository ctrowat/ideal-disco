# ideal-disco
A project to allow remote control of a string of WS2812B LEDs using an ESP8266 microcontroller

This project was going to be named esp8266_ws2812b but github suggested ideal-disco and who am I to argue with that?

This project consists of 2 parts.  The first is the code that will run on the esp8266 microcontroller.  Since I'm just getting started I can talk about this in the ideal sense and say it will do the following:
* Use hardware I2S to clock the data out to the LED strips with very high efficiency
* Store "programs" of LED data in the onboard flash, perhaps 4 slots of 512kb each?
* Store configuration of wireless network information and LED strip information in flash memory
* Allow remote reconfiguration - new wireless credentials or updated LED strip information
* Implement a TCP POST API that allows:
    * Clearing of an existing program slot
    * Defining a new program
    * Uploading program data in fixed size blocks (only once per block, and before the program has been executed)
    * Execution of a program
    * Immediate display of a single colour
* Implement a UDP API, perhaps enabled and disabled through the TCP API that allows you to stream RGB LED data for immediate display.  Depending on MTU or memory limitations this might require each strip of LED data to be uploaded in segments.
* Remote firmware upgrade

The second part will be a nodejs project that will run on a computer on the same network as the esp8266 and it will allow control of the esp8266 through it's API in a user friendly manner.  It should do the following:
* Serve static content web pages
* Manage any necessary state for operating the esp8266 through it's API
* Provide an IDE for users to write some javascript to produce LED data that can be fed to the esp8266 as a program
* Provide buttons to allow immediate setting of colours on the LED strip through the esp8266
* Provide some facility for streaming data to the esp8266 through it's UDP API for immediate display
* Perhaps allow viewing a live video feed from a local IP or USB camera

The "big idea" of this project is to end up with a web site that can be visited by people who can then control an LED strip that will be mounted such that it is plainly visible on the outside of my house.  Perhaps through setting up an isolated wireless network and posting a QR code on my garage door, or perhaps by adding an internet accessible camera somewhere in front of my house and posting the control URL for people anywhere in the world to access.
