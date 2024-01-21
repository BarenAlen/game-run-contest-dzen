<?php
date_default_timezone_set("Europe/Moscow");

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'date_time':
//        die(date('Y-m-d H:i:s'));
        die(date('2023-09-22 15:00:15'));

    case 'send_mail':
        require 'form_processing.php';
        die();
}