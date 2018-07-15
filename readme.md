# Project Description
A contact list app, which send otp to contacts listed here using twilio api.
it will be available on this address 52.23.195.68

**dependencies**
- Python(>=3.6)
- Falcon(microservice framework)
- MongoDB
- AngularJS
- gunicorn(for wsgi server)
- bson
- twilio

**To run the project**

`npm start` this will launch angular app 

`npm api_start` this will launch the wsgi server

### You can test basic api connectivity

`http://127.0.0.1:8000/ping`

**Returns**
```
    "pong"
```

## Api Endpoints

### `GET` /contacts
get all contacts 

**Parameters**: none

**Response**
```

```

### `GET` /contacts/{id}
to get the contact which objectId has passed

**Parameters**: id(ObjectId)

**Response**

```
```

### `POST` /contacts

### `PUT` /contacts

### `DELETE` /contacts

### `GET` /messages

### `GET` /messages/{mobile}

### `POST` /messages

## NOTE:
This is a dummy project which has a few known bugs which will be fixed, till then it will be stagged on my free tier AWS cluster at 52.23.195.68 address and will push to my github account, link: https://github.com/bqube





