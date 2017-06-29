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
UPDATED ON 2017.06.29 -- you don't need geodata_import.py or any other python script from now

1. Add new country code + name from [here](https://github.com/hjnilsson/country-flags) to the DB
2. Add new country flag as static to `nginx/site/static/flags/<CC>.png` (check one for appropriate size)
3. Download the map from [MAPZEN](https://mapzen.com/data/borders/)
4. Untar the map file, choose which admin level(s) [it's usually admin level 4] you need, then use topojson to convert it from geojson `geo2topo -p -o <country>.json admin_level_x.geojson`
5. Go to [MAPSHAPER](http://mapshaper.org/) and load the topojson, select `Simplify` and move the slider until you simplify the map well enough to still see all the borders.
6. Export from mapshaper and move the new file to `nginx/site/static/country-geodata/`
