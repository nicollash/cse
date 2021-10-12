#!/bin/sh

# This file will make sure to restart on specific services like NGINX.
# During postdeploy, we make sure to restart the services to take in consideration the new custom configs.
sudo systemctl restart nginx.service