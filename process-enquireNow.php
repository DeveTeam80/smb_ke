<?php
// process-enquireNow.php

session_start();
header('Content-Type: text/plain');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method not allowed';
    exit;
}

// CSRF Protection
if (!isset($_POST['csrf']) || !isset($_COOKIE['csrf_token']) || $_POST['csrf'] !== $_COOKIE['csrf_token']) {
    echo 'CSRF token mismatch';
    exit;
}

// Sanitize input
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Get form data
$name = sanitizeInput(urldecode($_POST['name'] ?? ''));
$email = sanitizeInput(urldecode($_POST['email'] ?? ''));
$phoneNumber = sanitizeInput(urldecode($_POST['phoneNumber'] ?? ''));
$code = sanitizeInput(urldecode($_POST['code'] ?? ''));
$message = sanitizeInput(urldecode($_POST['message'] ?? ''));
$project = sanitizeInput(urldecode($_POST['project'] ?? ''));
$ipAddress = sanitizeInput(urldecode($_POST['IPAdresss'] ?? ''));
$currentPage = sanitizeInput($_POST['current_page'] ?? '');

// Validation
$errors = [];
if (empty($name)) $errors[] = 'Name is required';
if (empty($email) || !validateEmail($email)) $errors[] = 'Valid email is required';
if (empty($phoneNumber)) $errors[] = 'Phone number is required';

if (!empty($errors)) {
    echo 'Validation Error: ' . implode(', ', $errors);
    exit;
}

try {
    // Email configuration
    $to = 'lokhandwalahvsbizz@gmail.com'; 
    $subject = 'New Enquiry from ' . $name;
    
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .field { margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-left: 4px solid #007bff; }
            .label { font-weight: bold; color: #555; }
            .value { margin-left: 10px; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 15px; }
        </style>
    <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-N3WYN4NED4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-N3WYN4NED4');
</script>
</head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New General Enquiry</h2>
            </div>
            
            <div class='field'>
                <span class='label'>Name:</span>
                <span class='value'>$name</span>
            </div>
            
            <div class='field'>
                <span class='label'>Email:</span>
                <span class='value'>$email</span>
            </div>
            
            <div class='field'>
                <span class='label'>Phone:</span>
                <span class='value'>$code $phoneNumber</span>
            </div>
            
            <div class='field'>
                <span class='label'>Project Interest:</span>
                <span class='value'>$project</span>
            </div>
            
            <div class='field'>
                <span class='label'>Message:</span>
                <div class='value' style='margin-top: 5px;'>
                    " . nl2br($message) . "
                </div>
            </div>
            
            <div class='footer'>
                <p><strong>System Details:</strong></p>
                <p>IP Address: $ipAddress</p>
                <p>Source Page: $currentPage</p>
                <p>Enquiry Time: " . date('Y-m-d H:i:s') . "</p>
                <p>Form Type: General Enquiry</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: noreply@vstudiobizz.com" . "\r\n"; // Change this
    $headers .= "Reply-To: $email" . "\r\n";
    
    if (mail($to, $subject, $emailBody, $headers)) {
        echo 'Success';
    } else {
        echo 'Email sending failed';
    }

} catch (Exception $e) {
    error_log('Email error: ' . $e->getMessage());
    echo 'An error occurred while sending email';
}
?>