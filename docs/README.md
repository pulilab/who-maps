# Digital Health Atlas

## Maintenance and general info

### Command to run

- `fab up`  start all backend and fronted instances in daemon mode
- `fab down` stop all backend and fronted instances and make backup of db
- `fab migrate`  to run new migrations
- `docker-compose build` build backend and frontend

### Project structure

Static files (png, css, etc.) should go to:

`nginx/site/static/`

And can be accessed like:

http://localhost/static/css/some.css

- http://localhost -- deployed frontend
- http://localhost/admin -- backend admin

### Country map handling

1. Download the maps with the link in the country admin page of the selected country
2. Unzip the map and load it in [MAPSHAPER](http://mapshaper.org/)
3. Simplify the map as much as possible without loosing quality
4. Export the map from mapshaper as a geojson
5. Load the exported map file in the country admin
6. After the map is loaded use the admin interface to select the admin levels and their type
7. Click set/reset Markers to calculate the country center and the sublevels centers
9. Optionally adjust the markers by dragging them around
8. Save the form.


### Rebuilding search
You can rebuild search any time you want or if you realise there's some data missing from search

`manage.py rebuild_search`

### Donor tools

When you delete a Donor from Django admin (as a superuser) and want to sync the donors in all projects:

`manage.py remove_stale_donors`

When you want to eg. remove a duplicate donor or a typo, you can migrate the project that use the typo or duplicate
donor to the one that you want to keep for all projects:

`manage.py switch_donor_form_to <DONOR_ID_YOU_WANT_TO_MIGRATE_FROM> <TO_DONOR_ID>`

After migrating all projects, you can delete the typo / duplicate donor objects from the admin (don't forget to issue
the `remove_stale_donors` after that.)

### Translations

On Osx prerequisite is:

`brew install gettext`

after this command completes:

`brew link --overwrite --force gettext` may be needed

To scrape the code and extract translations:
`yarn translation:extract`

To Update the translations files in the backend:

```bash
cd django
fab update_translations
```

To see the new string and modify translations:
`http://localhost/translation`

(click on Save and Translate next block to save them)

To have translation appear in the frontend (after saving them at the previous step):
`docker-compose restart django`

#### Quirks

Translations are picked up from `<translate></translate>` blocks this block is declared as a global vue component so it can be used without importing it.
If a translation string needs parameters (ie: {{userProfile.name}} hello!) the syntax is `<translate :parameters="{name: userProfile.name}"> {name} hello </translate>`
Also, `$gettext('english/base string')` method is available in every Vue component via a mixin in the i18n plugin.
if using `$gettext` in the template is important to add the dummy filter `| translate` to have the translation picked up by the string extractor system.

## How to contribute

### Understanding the system

DHA is a complex system composed of multiple moving parts, all of them expressed as docker containers and tied them together with the use of multiple `docker-compose.yml` files, one for each of the environments:

- `docker-compose.yml` base docker file and development server
- `docker-compose.dev.yml` auto-deployed dev server
- `docker-compose.test.yml` qa server
- `docker-compose.prod.yml` production server

all the docker-compose file need to be chained to the main docker file for example to build all the container in the QA environment:

```bash
docker-compose -f docker-compose.yml -f docker-compose.test.yml build
```

More specifically the system is composed by:

- Proxy server `nginx`
- Backend server `django`
- DB server `postgres`
- Task dispatcher server `celery`
- In memory db server `redis`
- Frontend server `nuxt`

### Obtaining the code

- for the repository on GitHub
- clone the newly forked repository locally

### Prerequisites

- [yarn](https://yarnpkg.com/en/)
- [fabric](http://docs.fabfile.org/en/1.12.1/index.html) - optional but strongly suggested -

### Working on the backend

!> Backend uses the popular [Django](https://www.djangoproject.com/)

To start working on the backend the only prerequisite is to have the dev environment running:

```bash
docker-compose build
cd django
docker-compose up -d
docker-compose exec django python manage.py migrate
```

opening the django folder with your editor of choice is the only step left.

### Working on the frontend

!>  Frontend uses a `SSR` system called [nuxt](https://nuxtjs.org/)

To start working on the frontend is necessary to have the backend up and running, refer to the previous section.

```bash
cd frontend
cp .env.template .env
yarn
yarn dev
```

The last command will spin a dev environment  with hot module reload on the port `localhost:3000` a proxy system is connected to the dev server to proxy all the requests to the correct `API` location
the next step is to open the frontend folder with your editor of choice.

### Testing in production mode

To test the code in the same way as if it is run on the frontend run:

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

and head to `localhost` in your browser of choice.

### Submitting your changes

To submit your code to the main repository the steps are as follow:

- Open an issue on the main GitHub repository with the tag in the tile [RFC]
- Explain in the issue what you want to achieve and the reason
- Wait for an ok from Pulilab technical team and the product owner
- Open a PR from your forked repository towards the development branch of the main repository
- Link in said PR the issue opened in the beginning
- Technical review is going to be performed on the PR by Pulilab team
- Once all the issue / comments discovered in the technical interview are resolved your PR will be merged.


## Technologies / Frameworks

> Beside the already mentioned **Django** and **Nuxt** several other frameworks and technologies are used:

### Backend

- [Django Rest Framework](https://www.django-rest-framework.org/)
- [Celery](http://www.celeryproject.org/)
- [Redis](https://redis.io/)

### Frontend

- [Vuex](https://vuex.vuejs.org/)
- [Less](http://lesscss.org/)
- [Sass](https://sass-lang.com/)
- [AngularJs](https://angularjs.org/)
- [Vue i19n](https://github.com/kazupon/vue-i18n)
- [Axios](https://axios.nuxtjs.org/)
- [ElementUI](http://element.eleme.io/#/en-US)
- [AngularMateria](https://material.angularjs.org/latest/)
- [VeeValidate](https://baianat.github.io/vee-validate/)
- [Vue2Leaflet](https://github.com/KoRiGaN/Vue2Leaflet)
- [Jest](https://jestjs.io/en/)
