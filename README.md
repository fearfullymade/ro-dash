ro-dash
=======

ro-dash is a metric dashboard. Built using React/Redux with a small PHP backend, this app allows you to visualize how your rest api is being used. Check out the sample to see it in action: [https://ro-dash-sample.herokuapp.com](https://ro-dash-sample.herokuapp.com)

Getting Started
---------------

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

You can use the button above to spin up a [Heroku](https://heroku.com) app with this code. The app will populate the database with sample metrics so you can get a feel for how it is set up. Read on to get the details for how the metric data is formated.

Card Configuration
------------------

The backend api is built to be very flexible. Each individual card can config its filters, grouping, etc in the request it sends to the server. See www/reducers/cardConfig.js for the sample card configuration.

# Querying for Data

The api is /api/metric/{xaxis}/{yaxis}?{filters|sort|limit}

Example: /api/metric/date/total?split=isTrial
This card will graph total hits by day, grouping them into groups based on the isTrial field.

Example: /api/metric/userId/total?userId!=null&sort=-total&limit=10
This card will graph the total hits by user, where the userId is not null, sorted by total (descending), and limited to the top 10 results.

# Card Type

There are three types of cards:
* Time Graph - Graph with time along the x-axis
* Pie Chart
* List

# Card Layout

Cards are laid out using Bootstrap's grid system. See www/reducers/cardLayout.js for how the sample layout is built. 

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

Developing
-------------

Build the app with

```
gulp
```

or

```
gulp watch
```

Run the unit tests with

```
npm test
```
