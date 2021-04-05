# TempBodge

Very simple Raspberry Pi temperature monitor with a barebones frontend

### Deploying
This is intended to be used as a base for developing your own temperature
station/frontend combination. Change the secrets, urls and all that to
fit your use case and use Apache or Nginx to point to the port 10990.

On Raspberry Pi, use the following cron job, for example:
```
*/10 * * * * /usr/bin/python3 /home/sami/tempbodge/tempbodge_fetcher.py
```
