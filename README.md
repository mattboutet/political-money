User Boilerplate

A general purpose boilerplate for building APIs with hapi, with built in user model and JWT-based authentication.  Based on https://github.com/devinivy/boilerplate-api

## Getting Started
In this example our project is called `my-project`

```bash
$ git clone git@github.com:mattboutet/user-boilerplate.git my-project
$ cd my-project
$ git remote set-url origin git@github.com:your-username/my-project.git
```

Now install the dependencies and start running the server

```bash
$ npm install
$ npm test
$ NODE_ENV=development npm start
```

If everything goes well you should see this

```bash
> user-boilerplate@0.3.0 start /Users/matt/domains/user-boilerplate
> node server
 Server started at http://0.0.0.0:3000
```

Now your app is running at [http://0.0.0.0:3000](http://0.0.0.0:3000)

### Tools
Here are some of the tools we include in the project :octocat:

Name | Description
------------ | -------------
[schwifty](https://github.com/BigRoomStudios/schwifty) | Integrates Objection ORM
[objection](https://github.com/Vincit/objection.js/) | SQL-Friendly ORM
[knex](https://github.com/tgriesser/knex) | Multi-dialect SQL Query builder
[haute-couture](https://github.com/devinivy/haute-couture) | File-based hapi plugin composer
[glue](https://github.com/hapijs/glue) | Server composer for hapi.js
[hoek](https://github.com/hapijs/hoek) | Node utilities shared amongst the extended hapi universe
[joi](https://github.com/hapijs/joi) | Object schema validation
[bassmaster](https://github.com/hapijs/bassmaster) | Batch request plugin for hapi
[boom](https://github.com/hapijs/boom) | HTTP-friendly error objects
[hapi-swagger](https://github.com/glennjones/hapi-swagger) | A Swagger interface for hapi
[lab](https://github.com/hapijs/lab) | Node.js test framework
[labbable](https://github.com/devinivy/labbable) | No-fuss hapi server testing
[hapi-auth-jwt2](https://github.com/dwyl/hapi-auth-jwt2) | Secure Hapi.js authentication plugin using JSON Web Tokens

### Test It Out!
Browse to http://0.0.0.0:3000/swagger

Time to make a `user`! Make a `POST` request to the `users` endpoint.
```json
{
  "email": "test@test.com",
  "password": "test",
  "firstName": "test",
  "lastName": "test"
}
```

Now send a `GET` request to the `users` endpoint and you should get a response like this:

```json
[{
  "email": "test@test.com",
  "password": "$2a$10$8hoUmAcYKGcTyv.isy2xb.IYnB2KBGCytdqXHDrIfhiGZg4s8TvNa",
  "firstName": "Test",
  "lastName": "Test",
  "resetToken": "",
  "id": 1,
  "createdAt": "2016-06-06T01:50:37.000Z",
  "updatedAt": "2016-06-15T15:18:51.000Z"
}]

```

If you `POST` the `login` route:

```json
{
  "email": "test@test.com",
  "password": "test"
}
```
It will return a JWT that can then be used in the headers of any request to an authenticated endpoint - select the `user` endpoint and paste the JWT you received from the `login` route above into the `authorization` field in the Swagger-UI:
```json
{
  "email": "test@test.com",
  "password": "$2a$10$8hoUmAcYKGcTyv.isy2xb.IYnB2KBGCytdqXHDrIfhiGZg4s8TvNa",
  "firstName": "Test",
  "lastName": "Test",
  "resetToken": "",
  "id": 1,
  "createdAt": "2016-06-06T01:50:37.000Z",
  "updatedAt": "2016-06-15T15:18:51.000Z"
}
```
