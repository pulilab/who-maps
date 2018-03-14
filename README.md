## Command to run

`fab up` - start all backend instances in daemon mode
`fab down` - stop all backend instances and make backup of db
`fab migrate` - to run new migrations
`docker-compose build` - if there were new django requirements

## Project structure
_(this section needs to be discussed)_

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