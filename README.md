ro-dash
=======

ro-dash is a metric dashboard. Built using React/Redux with a small PHP backend, this app allows you to visualize how your rest api is being used.

Getting Started
---------------

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

You can use the button above to spin up a [Heroku](https://heroku.com) app with this code. The app will populate the database with sample metrics so you can get a feel for how it is set up. Read on to get the details for how the metric data is formated.

Metric Data Schema
------------------

The app is set up to read metrics from a MongoDB database. The format for the metrics collection is:

```json
{
    "_id": {
        "date": MongoDate(),
        "method": "GET",
        "path": "/api/posts/{id}",
        "userId": MongoId(),
        "responseCode": 200
    },
    "count": 15
}

```

Any item you want to group your metrics by (path, method, etc) should be placed inside _id. The count is the number of times that set of criteria was hit.
