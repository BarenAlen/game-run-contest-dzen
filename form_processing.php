<?php
$to = 'test@mail.test';
$subject = "Новый участник Game Run";
$message = "Email: {$_REQUEST['signup-email']}\r\n";
$message .= "Логин в Telegram: {$_REQUEST['signup-tg']}\r\n";
$message .= "Cсылка на твой канал в Дзене: {$_REQUEST['signup-zen']}\r\n";
$message .= "Ссылка на канал автора в Дзене, который тебя пригласил: {$_REQUEST['signup-inviter-zen']}\r\n";
$headers = "From: sender@example.com\r\n";
$headers .= "Reply-To: sender@example.com\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
if (mail($to, $subject, $message, $headers)) {
    echo 'Письмо успешно отправлено';
} else {
    echo 'Ошибка при отправке письма';
}

