<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');


$db = new SQLite3('data.db');

$action = $_GET['action'];

if ( $action == 'create' ) {
	$results = $db->query('SELECT * FROM words ORDER BY last_used ASC');
	$row = $results->fetchArray();

	$room = $row['word'] . '-' . $row['times_used'];
	$now = time();

	$db->exec("INSERT INTO games (word, room, created) VALUES ('{$row['word']}', '$room', '$now')");
	$db->exec("UPDATE words SET last_used = '$now', times_used = times_used+1 WHERE word = '{$row['word']}'");

	echo json_encode([
		'word' => $row['word'],
		'room' => $room
	]);
}
elseif ( $action == 'join' ) {
	$word = SQLite3::escapeString(strtolower($_GET['word']));

	$results = $db->query("SELECT * FROM games WHERE word = '$word' ORDER BY created DESC");
	$row = $results->fetchArray();

	echo json_encode([
		'room' => $row['room']
	]);
}