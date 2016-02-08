<?php

$conn = new MongoClient(getenv('MONGOLAB_URI'));
$db = $conn->selectDB(array_reverse(explode('/', getenv('MONGOLAB_URI')))[0]);

//check if users populated
$users = $db->users->find();

if (!$users->hasNext()) {
  $db->users->batchInsert([
    ['name' => 'User 1'],
    ['name' => 'User 2'],
    ['name' => 'User 3'],
    ['name' => 'User 4'],
    ['name' => 'User 5'],
    ['name' => 'User 6']
  ]);

  $users = $db->users->find();
}

$users = iterator_to_array($users);

//find last metric date
$mostRecent = $db->metrics->find()->sort(['_id.date' => -1])->limit(1);

if ($mostRecent->hasNext()) {
  $date = $mostRecent->next()['_id']['date']->toDateTime();
  $date->add(new DateInterval('P1D'));
}
else {
  $date = new Datetime('now UTC');
  $date->sub(new DateInterval('P7DT5H'));
  $date->setTime(0, 0, 0);
}

//insert metrics
$methods = ['GET' => 100, 'POST' => 30, 'PUT' => 50, 'DELETE' => 20];
$paths = ['/api/posts' => 30, '/api/posts/{id}' => 100, '/api/posts/{id}/comments' => 80, '/api/posts/{id}/comments/{commentId}' => 50];
$responseCodes = [200 => 100, 304 => 40, 401 => 10, 500 => 5];

$today = new Datetime('now UTC');

$metrics = [];

while ($date < $today) {
  foreach ($methods as $m => $mp) {
    foreach ($paths as $p => $pp) {
      foreach ($responseCodes as $r => $rp) {
        foreach ($users as $user) {
          $metrics []= [
            '_id' => [
              'date' => new MongoDate($date->getTimestamp()),
              'method' => $m,
              'path' => $p,
              'userId' => $user['_id'],
              'circleId' => null,
              'isTrial' => false,
              'responseCode' => $r
            ],
            'count' => 10
          ];
        }
      }
    }
  }
  
  $date->add(new DateInterval('P1D'));
}

if (count($metrics) > 0) {
  $db->metrics->batchInsert($metrics);
}

?>
