## Setting up the backend on Mac

1, Follow instructions here to install Docker:

https://docs.docker.com/mac/step_one/

"Step 3: Verify your installation" is not needed.


2, Create a VirtualBox VM for running the images:

```bash
$ docker-machine create --driver virtualbox who-maps
```

3. Connect your shell to the VM:

```bash
$ eval "$(docker-machine env who-maps)"
```

4. Build the containers:

```bash
$ cd your/project/root
$ docker-compose build
```

5. Run the containers:

```bash
$ docker-compose up
```

It also can be run with option "-d" so that it starts detached mode (in the background):

```bash
$ docker-compose up -d
```

5. Initialize the database:

```bash
$ docker exec -it whomaps_django_1 python manage.py migrate
```

6. Check for the IP of the VM:

```bash
$ docker-machine ip who-maps
```

7. Open a browser on the given IP and load the application:

```bash
$ open http://192.168.99.100
```

You're done!

7. Useful commands for managing the VM and the containers:

```bash
$ docker-machine ls
$ docker-machine start who-maps
$ docker-machine stop who-maps
$ docker ps
```

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

And can be accessed at any given URL but a backend developer is needed to set routing first.

Angular apps should go to:

`nginx/site/app/`

And can be accessed like:

http://192.168.99.100/app/app.js