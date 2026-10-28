<?php
// Contact form endpoint for the club page (OVH shared hosting, PHP).
// Receives a multipart/form-data POST and forwards it by e-mail to the club.

const GENERAL = 'rollerderbybordeaux@gmail.com';
const RECRUITMENT = 'recrutement@rollerderbybordeaux.fr';
const INTERLEAGUE = 'interleague@rollerderbybordeaux.fr';
// Checked interest (form value) => [label in the mail, recipient]
const INTERESTS = [
    'play' => ['Jouer', RECRUITMENT],
    'try' => ['Essayer', RECRUITMENT],
    'referee' => ['Arbitrer', RECRUITMENT],
    'watch' => ['Venir voir', GENERAL],
    'volunteer' => ['Filer un coup de main', GENERAL],
    'hello' => ['Dire bonjour', GENERAL],
    'interleague' => ['Interligue', INTERLEAGUE],
];
// Must be an address of the hosted domain, otherwise OVH may reject the mail.
const SENDER = 'no-reply@rollerderbybordeaux.fr';
// Minimum delay between two messages from the same IP (seconds).
const MIN_DELAY = 60;

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, string $error = ''): void
{
    http_response_code($status);
    echo json_encode(['ok' => $status === 200, 'error' => $error]);
    exit;
}

// Removes line breaks so a value can never inject extra mail headers.
function clean_line(string $value, int $max): string
{
    $value = preg_replace('/[\r\n\t]+/', ' ', $value) ?? '';
    return trim(mb_substr($value, 0, $max));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, 'method');
}

// Honeypot: bots fill every field, humans never see this one.
if (!empty($_POST['website'])) {
    respond(200);
}

$name = clean_line((string) ($_POST['name'] ?? ''), 80);
$email = clean_line((string) ($_POST['email'] ?? ''), 120);
$message = trim(mb_substr((string) ($_POST['message'] ?? ''), 0, 2000));
$locale = ($_POST['locale'] ?? 'fr') === 'en' ? 'en' : 'fr';
// Unknown values are ignored; each checked interest adds its recipient once
$interests = [];
$recipients = [];
if (isset($_POST['interests']) && is_array($_POST['interests'])) {
    foreach (array_slice($_POST['interests'], 0, 10) as $item) {
        $key = (string) $item;
        if (!isset(INTERESTS[$key])) {
            continue;
        }
        [$label, $to] = INTERESTS[$key];
        $interests[] = $label;
        $recipients[$to] = true;
    }
}
$recipients = $recipients === [] ? [GENERAL] : array_keys($recipients);

// Name is optional
if ($message === '' ||!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, 'invalid');
}

// Simple per-IP throttle, stored in the system temp directory.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$stamp = sys_get_temp_dir() . '/rdbc_contact_' . md5($ip);
if (is_file($stamp) && time() - (int) filemtime($stamp) < MIN_DELAY) {
    respond(429, 'too-many');
}

$lines = [
    'Nom : ' . ($name === '' ? '(non renseigné)' : $name),
    "Email : $email",
    'Langue : ' . strtoupper($locale),
];
if ($interests !== []) {
    $lines[] = 'Intérêts : ' . implode(', ', $interests);
}
$body = implode("\n", $lines) . "\n\n" . $message . "\n";

$headers = [
    'From: Site RDBC <' . SENDER . '>',
    'Reply-To: ' . ($name === '' ? $email : $name . ' <' . $email . '>'),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];
$subject = '=?UTF-8?B?' . base64_encode('Contact site RDBC — ' . ($name === '' ? $email : $name)) . '?=';

if (!mail(implode(', ', $recipients), $subject, $body, implode("\r\n", $headers))) {
    respond(500, 'mail');
}

touch($stamp);

// Optional copy for the sender, only when they ticked the box.
// A failure here never fails the request: the club already got the message.
if (!empty($_POST['copy'])) {
    $copyIntro = $locale === 'en'
        ? "Here is a copy of the message you sent to Roller Derby Bordeaux Club.\nWe will get back to you soon."
        : "Voici une copie du message que vous avez envoyé au Roller Derby Bordeaux Club.\nNous reviendrons vers vous rapidement.";
    $copySubject = $locale === 'en'
        ? 'Copy of your message to RDBC'
        : 'Copie de votre message au RDBC';
    $copyHeaders = [
        'From: Roller Derby Bordeaux Club <' . SENDER . '>',
        'Reply-To: ' . $recipients[0],
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
    ];
    mail(
        $email,
        '=?UTF-8?B?' . base64_encode($copySubject) . '?=',
        $copyIntro . "\n\n---\n\n" . $body,
        implode("\r\n", $copyHeaders)
    );
}

respond(200);
