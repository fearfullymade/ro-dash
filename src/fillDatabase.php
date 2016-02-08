<?php

$conn = new MongoClient(getenv('MONGOLAB_URI'));
$db = $conn->selectDB(array_reverse(explode('/', getenv('MONGOLAB_URI')))[0]);

//check if users populated
$users = $db->users->find();

if (!$users->hasNext()) {
  $db->users->batchInsert([
    ['name' => 'Lue49'],
    ['name' => 'Rubye89'],
    ['name' => 'Bert.Howe99'],
    ['name' => 'Carley.Pollich'],
    ['name' => 'Arlie.Lockman'],
    ['name' => 'Dino.Williamson63'],
    ['name' => 'Jaycee34'],
    ['name' => 'Leopoldo.Rutherford12'],
    ['name' => 'Adelbert.Flatley'],
    ['name' => 'Jorge.Collier'],
    ['name' => 'Dee.Schowalter18']
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
  $date->sub(new DateInterval('P30DT5H'));
  $date->setTime(0, 0, 0);
}

echo "Creating metrics starting at {$date->format("Y-m-d")}\n";

//insert metrics
$methods = ['GET' => 90, 'POST' => 30, 'PUT' => 50, 'DELETE' => 20];
$paths = ['/api/posts' => 30, '/api/posts/{id}' => 90, '/api/posts/{id}/comments' => 80, '/api/posts/{id}/comments/{commentId}' => 50, 'rest/reportError' => 2];
$responseCodes = [200 => 90, 304 => 40, 401 => 10, 500 => 5];

$today = new Datetime('now UTC');

$metrics = [];

while ($date < $today) {
  foreach ($users as $user) {
    if (rand(0, 100) > 60) continue;

    foreach ($methods as $m => $mp) {
      if (rand(0, 100) > $mp) continue;

      foreach ($paths as $p => $pp) {
        if (rand(0, 100) > $pp) continue;

        foreach ($responseCodes as $r => $rp) {
          if (rand(0, 100) > $rp) continue;

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
            'count' => rand(5, 20)
          ];
        }
      }
    }
  }
  
  $date->add(new DateInterval('P1D'));
}

echo "Inserting ".count($metrics)." metrics\n";

if (count($metrics) > 0) {
  $db->metrics->batchInsert($metrics);
}

?>
