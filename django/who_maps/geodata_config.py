import os

MAPZEN_S3_URL = "https://s3.amazonaws.com/osm-polygons.mapzen.com/"
GEOJSON_TEMP_DIR = os.path.join(os.path.dirname(__file__), os.pardir, 'temp/')
SELECTED_FILE_LIST = [
    "sierra-leone_geojson.tgz",
    "kenya_geojson.tgz",
    "philippines_geojson.tgz",
    "bangladesh_geojson.tgz",
    "india_geojson.tgz",
    "senegal_geojson.tgz",
    "malawi_geojson.tgz",
    "pakistan_geojson.tgz",
    "indonesia_geojson.tgz",
    "tunisia_geojson.tgz"
]
ADMIN_LEVELS_TO_IMPORT = [
    "admin_level_2.geojson",
    "admin_level_3.geojson",
    "admin_level_4.geojson",
    "admin_level_5.geojson"
]
