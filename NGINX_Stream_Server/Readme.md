# NGINX Stream Server on Raspbian/Ubuntu

By installing an [NGINX rtmp server](https://github.com/arut/nginx-rtmp-module) on a Raspbian or Ubuntu SO, OBS can be linked to the server, and from the server to multiple stream platforms.

## Step by step to stream on Twitch
1. Install NGINX and RTMP mod
    ```
    sudo apt-get update
    sudo apt-get install nginx libnginx-mod-rtmp
    ```
2. Check correct install of NGINX
    ```
    sudo systemctl start nginx.service
    sudo systemctl status nginx.service
    ```
3. Search best server based on location and get full link:
    [https://help.twitch.tv/s/twitch-ingest-recommendation?language=en_US](https://help.twitch.tv/s/twitch-ingest-recommendation?language=en_US)
4. Create config to RTMP server settings:
    ```
    sudo nano /etc/nginx/rtmp.conf
    ```
    Add following lines
    ```
    rtmp {
        server {
            listen 1935; #Default RTMP port
            chunk_size 4096; #Size of chunks

            application live { 
                live on; 
                record off; 
                push rtmp://fra02.contribute.live-video.net/app/{stream_key}; #User Stream key here and link searched before
            }
        }
    }
    ```    
5. Restart NGINX service ```sudo systemctl restart nginx.service```

## Stream on rtmps server (Kick)
The way rtmps works with NGINX is by tunelling stream before send it to the server. You can follow these steps:
1. Modify RTMP server settings:
    ```
    sudo nano /etc/nginx/rtmp.conf
    ```
    Add kick line
    ```
    rtmp {
        server {
            listen 1935; #Default RTMP port
            chunk_size 4096; #Size of chunks

            application live { 
                live on; 
                record off; 
                #twitch
                push rtmp://fra02.contribute.live-video.net/app/{stream_key}; #User Stream key here
                #kick. port number must match on stunnel accept port
                push rtmp://127.0.0.1:19353/kick/{stream_key}; #User Stream key here
            }
        }
    }
    ```
2. Is needed to install [stunnel](https://www.kali.org/tools/stunnel4/), a SSL encryption wrapper between client and server to encrypt the transmission:
    ```
    sudo apt-get install stunnel4
    ```
3. Search best server based on location and get full link:
    [https://kick.com/dashboard/settings/stream](https://kick.com/dashboard/settings/stream)
4. Create a config file to kick stream: ```sudo nano /etc/stunnel/stunnel.conf```
    Add following lines:
    ```
    pid = /var/run/stunnel4/stunnel.pid
    output = /var/log/stunnel4/stunnel.log

    setuid = stunnel4
    setgid = stunnel4

    # https://www.stunnel.org/faq.html
    socket = r:TCP_NODELAY=1
    socket = l:TCP_NODELAY=1

    debug = 4

    [kick]
    client=yes
    accept=127.0.0.1:19353
    connect=fa723fc1b171.global-contribute.live-video.net:443
    ```

5. Restart stunnel and NGINX services:
    ```
    systemctl restart stunnel4.service
    systemctl restart nginx.service
    ```

## Stream on Youtube
1. On youtube account => Youtube Studio => Create => Go Live
2. Select Streaming Software
3. Stream Key and Stream Url are available on the Live Dashboard
4. Modify RTMP server settings:
    ```
    sudo nano /etc/nginx/rtmp.conf
    ```
    Add youtube line
    ```
    rtmp {
        server {
            listen 1935; #Default RTMP port
            chunk_size 4096; #Size of chunks

            application live { 
                live on; 
                record off; 
                #twitch
                push rtmp://fra02.contribute.live-video.net/app/{stream_key}; #User Stream key here
                #kick. port number must match on stunnel accept port
                push rtmp://127.0.0.1:19353/kick/{stream_key}; #User Stream key here
                #youtube
                push rtmp://a.rtmp.youtube.com/live2/{stream_key};
            }
        }
    }
    ```
5. Restart NGINX service ```sudo systemctl restart nginx.service```