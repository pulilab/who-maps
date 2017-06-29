## Command to run

`fab up` - start all backend instances in daemon mode
`fab down` - stop all backend instances and make backup of db

## Project structure
_(this section needs to be discussed)_

Static files (png, css, etc.) should go to:

`nginx/site/static/`

And can be accessed like:

http://192.168.99.100/static/css/some.css

Static HTML files that are not served by backend, should go to:

`nginx/site/html/`

And can be accessed like:

http://192.168.99.100/html/footer.html

HTML files that will be served by Django (for e.g. the ones that needs to be filled with some initial content from the database) should go here:

`django/templates/`

## How to add new maps
UPDATED ON 2017.06.29 -- you don't need geodata_import.py or any other python script from now

1. Add new country code + name from [here](https://github.com/hjnilsson/country-flags) to the DB
2. Add new country flag as static to `nginx/site/static/flags/<CC>.png` (check one for appropriate size)
3. Download the map from [MAPZEN](https://mapzen.com/data/borders/)
4. Untar the map file, choose which admin level(s) [it's usually admin level 4] you need, then use topojson to convert it from geojson `geo2topo -p -o <country>.json admin_level_x.geojson`
5. Go to [MAPSHAPER](http://mapshaper.org/) and load the topojson, select `Simplify` and move the slider until you simplify the map well enough to still see all the borders.
6. Export from mapshaper and move the new file to `nginx/site/static/country-geodata/`
