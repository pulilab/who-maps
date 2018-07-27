## Command to run

`fab up` - start all backend instances in daemon mode
`fab down` - stop all backend instances and make backup of db
`fab migrate` - to run new migrations
`docker-compose build` - if there were new django requirements

## Project structure

Static files (png, css, etc.) should go to:

`nginx/site/static/`

And can be accessed like:

http://localhost/static/css/some.css

http://localhost -- deployed frontend
http://localhost/admin -- backend admin

## Country map handling

1. Download the maps with the link in the admin page of the selected country
2. Unzip the map and load it in [MAPSHAPER](http://mapshaper.org/)
3. Simplify the map as much as possible without loosing quality
4. Export the map from mapshaper as a geojson
5. Load the exported map file in the admin console and save the form
6. After the map is loaded use the admin interface to select the admin levels and hit save ( in the map tool )
7. Add a value in Map activated on ( be use the Today and Now buttons)
8. Save the form.

## Production settings

On production, install a cron for the user (`crontab -e`) to autobackup the DB

```0 4 * * * cd /home/whomaps/who-maps/django && fab backup_prod```


## SSL

```bash

# Set the Domain variable
 export DOMAIN=NAME_OF_THE_DOMAIN

# Pull the docker image for certbot:
 docker pull certbot/certbot

# Obtain wildcard  certificate
docker run -it --rm -v /home/$(whoami)/who-maps/nginx/certs:/etc/letsencrypt:rw -v /home/$(whoami)/who-maps/nginx/certs-data:/data/letsencrypt:rw  certbot/dns-digitalocean  certonly --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory -d "*.$DOMAIN" -d $DOMAIN

# Obtain normal certificate
docker run -it --rm -v /home/$(whoami)/who-maps/nginx/certs:/etc/letsencrypt:rw -v /home/$(whoami)/who-maps/nginx/certs-data:/data/letsencrypt:rw -v /home/$(whoami)/who-maps/nginx/certs-log://var/log/letsencrypt:rw -v /home/$(whoami)/who-maps/nginx/certs-data:/data/letsencrypt:rw  certbot/certbot  certonly --webroot --webroot-path=/data/letsencrypt -d $DOMAIN

# Copy certificates to right folder

sudo cp /home/$(whoami)/who-maps/nginx/certs/live/$DOMAIN/privkey.pem /home/$(whoami)/who-maps/nginx/certs/key.pem
sudo cp /home/$(whoami)/who-maps/nginx/certs/live/$DOMAIN/fullchain.pem /home/$(whoami)/who-maps/nginx/certs/chain.pem
sudo cp /home/$(whoami)/who-maps/nginx/certs/live/$DOMAIN/cert.pem /home/$(whoami)/who-maps/nginx/certs/cert.pem

# Set permission of certificates to default user
sudo chown $(whoami):$(whoami) /home/$(whoami)/who-maps/nginx/certs/key.pem
sudo chown $(whoami):$(whoami) /home/$(whoami)/who-maps/nginx/certs/chain.pem
sudo chown $(whoami):$(whoami) /home/$(whoami)/who-maps/nginx/certs/cert.pem

# Refresh normal certificate validity
docker run -it --rm -v /home/$(whoami)/who-maps/nginx/certs:/etc/letsencrypt:rw -v /home/$(whoami)/who-maps/nginx/certs-data:/data/letsencrypt:rw  certbot/certbot renew --webroot --webroot-path=/data/letsencrypt -d $DOMAIN

# Refresh widlcard certificate validty
docker run -it --rm -v /home/$(whoami)/who-maps/nginx/certs:/etc/letsencrypt:rw -v /home/$(whoami)/who-maps/nginx/certs-data:/data/letsencrypt:rw  certbot/dns-digitalocean  renew --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory -d "*.$DOMAIN" -d $DOMAIN

# List of subdomain

-d "gm.digitalhealthatlas.org" -d "lr.digitalhealthatlas.org" -d "np.digitalhealthatlas.org" -d "ph.digitalhealthatlas.org" -d "mm.digitalhealthatlas.org" -d "ma.digitalhealthatlas.org" -d "gh.digitalhealthatlas.org" -d "tz.digitalhealthatlas.org" -d "ug.digitalhealthatlas.org" -d "pe.digitalhealthatlas.org" -d "lk.digitalhealthatlas.org" -d "ss.digitalhealthatlas.org" -d "bf.digitalhealthatlas.org" -d "bj.digitalhealthatlas.org" -d "bw.digitalhealthatlas.org" -d "ne.digitalhealthatlas.org" -d "hn.digitalhealthatlas.org" -d "sl.digitalhealthatlas.org" -d "vn.digitalhealthatlas.org" -d "ml.digitalhealthatlas.org" -d "br.digitalhealthatlas.org" -d "cm.digitalhealthatlas.org" -d "cg.digitalhealthatlas.org" -d "ke.digitalhealthatlas.org" -d "gn.digitalhealthatlas.org" -d "cr.digitalhealthatlas.org" -d "ga.digitalhealthatlas.org" -d "mw.digitalhealthatlas.org" -d "tn.digitalhealthatlas.org" -d "tg.digitalhealthatlas.org" -d "in.digitalhealthatlas.org" -d "my.digitalhealthatlas.org" -d "af.digitalhealthatlas.org" -d "mx.digitalhealthatlas.org" -d "cf.digitalhealthatlas.org" -d "ng.digitalhealthatlas.org" -d "et.digitalhealthatlas.org" -d "mz.digitalhealthatlas.org" -d "rw.digitalhealthatlas.org" -d "pk.digitalhealthatlas.org" -d "cd.digitalhealthatlas.org" -d "ni.digitalhealthatlas.org" -d "mg.digitalhealthatlas.org" -d "gw.digitalhealthatlas.org" -d "sd.digitalhealthatlas.org" -d "id.digitalhealthatlas.org" -d "td.digitalhealthatlas.org" -d "zw.digitalhealthatlas.org" -d "bd.digitalhealthatlas.org" -d "sz.digitalhealthatlas.org" -d "na.digitalhealthatlas.org" -d "zm.digitalhealthatlas.org" -d "ht.digitalhealthatlas.org" -d "ao.digitalhealthatlas.org" -d "za.digitalhealthatlas.org" -d "cn.digitalhealthatlas.org" -d "az.digitalhealthatlas.org" -d "am.digitalhealthatlas.org" -d "jm.digitalhealthatlas.org" -d "bo.digitalhealthatlas.org" -d "tr.digitalhealthatlas.org" -d "by.digitalhealthatlas.org" -d "mv.digitalhealthatlas.org" -d "ci.digitalhealthatlas.org" -d "mr.digitalhealthatlas.org" -d "us.digitalhealthatlas.org" -d "bi.digitalhealthatlas.org" -d "uy.digitalhealthatlas.org" -d "tm.digitalhealthatlas.org" -d "eg.digitalhealthatlas.org" -d "bt.digitalhealthatlas.org" -d "al.digitalhealthatlas.org" -d "gt.digitalhealthatlas.org" -d "dj.digitalhealthatlas.org" -d "ar.digitalhealthatlas.org" -d "ve.digitalhealthatlas.org" -d "cv.digitalhealthatlas.org" -d "uz.digitalhealthatlas.org" -d "il.digitalhealthatlas.org" -d "dz.digitalhealthatlas.org" -d "ye.digitalhealthatlas.org" -d "ua.digitalhealthatlas.org" -d "ls.digitalhealthatlas.org" -d "sn.digitalhealthatlas.org" -d "er.digitalhealthatlas.org" -d "st.digitalhealthatlas.org" -d "sc.digitalhealthatlas.org" -d "kg.digitalhealthatlas.org" -d "kh.digitalhealthatlas.org" -d "la.digitalhealthatlas.org" -d "ca.digitalhealthatlas.org"

```
