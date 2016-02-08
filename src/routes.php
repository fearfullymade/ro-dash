<?php

$app->get('/', function ($request, $response, $args) {
  echo "Hello World!";
});

$app->get('/metric/{x}/{y}', function ($request, $response, $args) {
  $params = $request->getQueryParams();

  $conn = new MongoClient(getenv('MONGOLAB_URI'));
  $db = $conn->selectDB(array_reverse(explode('/', getenv('MONGOLAB_URI')))[0]);

  //y axis
  if ($args['y'] == 'total')
    $y = ['$sum' => '$count'];
  else if ($args['y'] == 'count')
    $y = ['$sum' => 1];

  $opts = [];

  //match stage
  $filters = [];

  foreach ($params as $k => $v) {
    if ($k == 'group' || $k == 'sort' || $k == 'limit' || $k == 'split')
      continue;

    if ($v == 'null')
      $v = null;
    else if (preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/',$v) == 1) 
      $v = new MongoDate(strtotime($v));

    switch (substr($k, -1)) {
    case '!':
      $field = '_id.'.substr($k, 0, strlen($k) - 1);
      if (!isset($filters[$field]))
        $fitlers[$field] = [];

      $filters[$field]['$ne'] = $v;
      break;
    case '<':
      $field = '_id.'.substr($k, 0, strlen($k) - 1);
      if (!isset($filters[$field]))
        $fitlers[$field] = [];

      $filters[$field]['$lte'] = $v;
      break;
    case '>':
      $field = '_id.'.substr($k, 0, strlen($k) - 1);
      if (!isset($filters[$field]))
        $fitlers[$field] = [];

      $filters[$field]['$gte'] = $v;
      break;
    default:
      $filters['_id.'.$k] = $v;
    }
  }

  if (count($filters) > 0) {
    $opts []= ['$match' => $filters];
  }

  //build initial group stage
  if (isset($params['group'])) {
    $opts []= ['$group' => [
      '_id' => [
        $args['x'] => '$_id.'.$args['x'],
        $params['group'] => '$_id.'.$params['group']
      ],
      'count' => $y
    ]];
  }

  //build main group stage
  $isSplit = isset($params['split']);

  if (!$isSplit) {
    $opts []= ['$group' => [
      '_id' => '$_id.'.$args['x'],
      'y' => $y
    ]];
  }
  else {
    $opts []= ['$group' => [
      '_id' => [
        $args['x'] => '$_id.'.$args['x'],
        $params['split'] => '$_id.'.$params['split']
      ],
      'y' => $y
    ]];
  }

  //sort stage
  if (isset($params['sort'])) {
    $sorts = [];

    $sortParam = $params['sort'];

    if ($sortParam == 'total' || $sortParam == 'count')
      $sortParam = 'y';
    else if ($sortParam == '-total' || $sortParam == '-count')
      $sortParam = '-y';

    if (strpos($sortParam, '-') === 0)
      $sorts[substr($sortParam, 1)] = -1;
    else
      $sorts[$sortParam] = 1;

    $opts []= ['$sort' => $sorts];
  }
  else {
    $opts []= ['$sort' => ['_id.'.$args['x'] => 1]];
  }

  //limit stage
  if (isset($params['limit'])) {
    $opts []= ['$limit' => intval($params['limit'])];
  }

  //print_r($opts);
  
  //run query
  $data = $db->metrics->aggregate($opts);

  //process results
  $results = [];

  foreach ($data['result'] as $d) {
    $x = $isSplit ? $d['_id'][$args['x']] : $d['_id'];
    $y = $d['y'];
    $series = $isSplit ? $d['_id'][$params['split']] : '0';

    if (is_a($x, 'MongoDate'))
      $x = $x->sec * 1000;
    else if (is_a($x, 'MongoId'))
      $x = (string)$x;

    if (is_a($series, 'MongoId'))
      $series = (string)$series;
    else if ($params['split'] == 'isTrial')
      $series = $series ? "Trial Users" : "Normal Users";

    if (!isset($results[$series]))
      $results[$series] = [];

    $results[$series] []= [$x, $y];
  }

  ksort($results);

  echo json_encode($results);
});

$app->get('/users', function ($request, $response, $args) {
  $conn = new MongoClient(getenv('MONGOLAB_URI'));
  $db = $conn->selectDB(array_reverse(explode('/', getenv('MONGOLAB_URI')))[0]);

  $users = $db->users->find([], ['name' => 1]);

  $out = [];

  foreach ($users as $u) {
    $out []= [
      '_id' => (string)$u['_id'],
      'name' => $u['name']
    ];
  }

  echo json_encode($out);
});

?>
