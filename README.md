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

http://localhost -- the backend
http://localhost/admin -- backend admin

## How to add new maps
DEPRECATED ON 2018.01.10 -- the new upload country map feature will replace this, see next chapter
UPDATED ON 2017.06.29 -- you don't need geodata_import.py or any other python script from now

1. Add new country code + name from [here](https://github.com/hjnilsson/country-flags) to the DB
2. Add new country flag as static to `nginx/site/static/flags/<CC>.png` (check one for appropriate size)
3. Download the map from [MAPZEN](https://mapzen.com/data/borders/)
4. Untar the map file, choose which admin level(s) [it's usually admin level 4] you need, then use topojson to convert it from geojson `geo2topo -p -o <country>.json admin_level_x.geojson`
5. Go to [MAPSHAPER](http://mapshaper.org/) and load the topojson, select `Simplify` and move the slider until you simplify the map well enough to still see all the borders.
6. Export from mapshaper and move the new file to `nginx/site/static/country-geodata/`

## Developer Country Map Manual Processing Guideline

1. Download the country admin / DHA admin uploaded map from DHA Admin
2. Run mgmt command: `docker-compose exec django python manage.py clean_maps <COUNTRY_CODE>`
3. The new processed map will be available in `django/media/processed_maps/<COUNTRY_CODE>_slim.geojson`
4. Upload the processed slim map to [MAPSHAPER](http://mapshaper.org/)
5. Simplify the map using mapshaper's simplify slider.
6. Export map to TopoJSON format with mapshaper.
7. Move the new file to `nginx/site/static/country-geodata/<COUNTRY_CODE>.json`
8. (optional) Make a backup if the country json was present before, rename it to <COUNTRY_CODE>_backup_<DATE>.json
9. Commit changes, deploy
10. Go to the country admin page and set map_activated_on to now. (This will also send the country admins an email that the new map is active)
