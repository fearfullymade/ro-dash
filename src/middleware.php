<?php

$app->add(function ($request, $response, $next) {
    $response = $response->withHeader('Content-type', 'application/json');
    $response = $next($request, $response);

    return $response;
});

?>
