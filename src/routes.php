<?php

$app->get('/', function ($request, $response, $args) {
  echo "Hello World!";
});

$app->get('/metric/{x}/{y}', function ($request, $response, $args) {
  $conn = new MongoClient('mongodb://test:test@ds041663.mongolab.com:41663/reachout-metrics-dev');
  $db = $conn->selectDB('reachout-metrics-dev');

  $opts = [];

  //build group stage
  if ($args['y'] == 'total')
    $y = ['$sum' => '$count'];
  else if ($args['y'] == 'count')
    $y = ['$sum' => 1];

  $opts []= ['$group' => [
    '_id' => '$_id.'.$args['x'],
    'y' => $y
  ]];

  //run query
  $data = $db->metrics->aggregate($opts);

  //process results
  $results = [];

  foreach ($data['result'] as $d) {
    $x = $d['_id'];
    $y = $d['y'];

    if (is_a($x, 'MongoDate'))
      $x = $x->sec * 1000;

    $results []= [$x, $y];
  }

  echo json_encode($results);
});

?>
