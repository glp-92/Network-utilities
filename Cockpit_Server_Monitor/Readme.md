# Cockpit Server Monitoring Tool

[Cockpit](https://cockpit-project.org/) is a useful open source tool that provides a web server with an intuitive UI to manage remote computers.

## Installation

```bash
sudo apt update -y
sudo apt install cockpit -y
sudo systemctl start cockpit
sudo systemctl enable cockpit
```

When using the update extension, if networking errors, create a dummy network interface

```bash
sudo nano /etc/NetworkManager/conf.d/10-globally-managed-devices.conf
```

Introduce following config

```
[keyfile]
unmanaged-devices=none
```

Create interface and then restart computer as suggested on [FAQ](https://cockpit-project.org/faq)

```bash
nmcli con add type dummy con-name fake ifname fake0 ip4 1.2.3.4/24 gw4 1.2.3.1
restart
```

## Custom Plugins

Cockpit allows developers to add Plugins and improve system monitoring experience.

Plugins can be stored on both `/home/usr/.local/share/cockpit` (for fast develop) or `/usr/share/cockpit`

To make a plugin:

1. Create a folder on any of these directories
2. Create a `manifest.json` inside:
   ```json
    {
        "version": 0,
        "tools": {
            "toolname": {
                "label": "ToolTitle",
                "path": "entrypoint.html",
                "privileged": true // if running sudo commands
            }
        }
    }
    ```
3. Create the script with `html` `css` and `js` using entrypoint provided on manifest

Note that to run a command, cockpit provides an API that can be called like this by using a button event handler

Include `cockpit.js` script on the `html` head to use the API:

```html
<script src="../base1/cockpit.js"></script>
```

Button handler code:

```js
button.addEventListener('click', () => {
    cockpit.spawn(["sudo", "touch", "helloworld.txt"], { superuser: "try" }) // second arg optionally if sudo is needed, only runable on admin mode
        .then(data => {
            statusLabel.textContent = `Status: ${data.trim()}`; // correct answer
        })
        .catch(err => {
            statusLabel.textContent = `Error: ${err}`; // if command returned error status code is taken as an exception
        });
});
```