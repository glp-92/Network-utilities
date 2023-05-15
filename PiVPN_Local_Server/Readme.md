# PiVPN local Server

PiVPN provides an installation assistant that makes easy configuration of basic OpenVPN server.

## Previous steps to configure VPN
Is strongly recommended to give an static IP address for the device which PiVPN is beeing installed. Steps to configure on basic Movistar Fiber Router:
1. Go to the router webpage
2. Menu => Advanced Config
3. Lan DHCP => Choose one DHCP range
4. Static Lease => Add
    - Admn state: enabled
    - IP Address: IP reserved to device
    - MAC Address: MAC of device. On linux run `ifconfig` and find interface used to connect to the router.
5. Apply

The port that will be listening on the device must be opened on the router config. Steps to configure on basic Movistar Fiber Router:
1. Go to the router webpage
2. Menu => Ports
    1. Rule name `VPN`
    2. IP => assigned IP on static lease
    3. Protocol `UDP`
    4. External port / Internal port: port assigned to the VPN service (not recommended 1194 default)

## Step by step PiVPN install and config
1. Download PiVPN `curl -L https://install.pivpn.io | bash`
2. Installation assistant appears when download is finished.
    1. Using IP reservation? `Yes`
    2. Local users - using pi default user `Ok`
    3. Installation mode `OpenVPN`
    4. Default config as `UDP` instead `TCP`.
    5. Default OpenVPN port: is recommended to not use default `1194` port.
    6. DNS provider `google` or `local` if a local DNS resolver is running.
    7. Use this public IP.
    8. Enable unattended upgrades `yes`
3. Reboot

## Adding users and get certificates
1. Add user: `pivpn add`
2. Set username, password and certificate duration
3. User certificate will be stored usually at `/home/pi/ovpns`
4. Place certificate file on client device and connect to the VPN by using `OpenVPN connect` on Windows or Android.
5.`sudo systemctl restart openvpn`