<?php
// process-scheduleSiteVisit.php

// Start session for CSRF protection
session_start();

// Set content type
header('Content-Type: text/plain');

// Only allow POST requests
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

// Sanitize and validate input data
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Get and sanitize form data
$name = sanitizeInput(urldecode($_POST['name'] ?? ''));
$email = sanitizeInput(urldecode($_POST['email'] ?? ''));
$phoneNumber = sanitizeInput(urldecode($_POST['phoneNumber'] ?? ''));
$code = sanitizeInput(urldecode($_POST['code'] ?? ''));
$message = sanitizeInput(urldecode($_POST['message'] ?? ''));
$project = sanitizeInput(urldecode($_POST['project'] ?? ''));
$ipAddress = sanitizeInput(urldecode($_POST['IPAdresss'] ?? ''));
$currentPage = sanitizeInput($_POST['current_page'] ?? '');

// Basic validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email) || !validateEmail($email)) {
    $errors[] = 'Valid email is required';
}

if (empty($phoneNumber)) {
    $errors[] = 'Phone number is required';
}

// If there are validation errors, return them
if (!empty($errors)) {
    echo 'Validation Error: ' . implode(', ', $errors);
    exit;
}

try {
    // Email configuration
    $to = 'lokhandwalahvsbizz@gmail.com'; 
    $subject = 'New Site Visit Enquiry from ' . $name;
    
    // Create HTML email body
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-left: 10px; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
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
                <h2>New Site Visit Enquiry</h2>
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
                <span class='label'>Project:</span>
                <span class='value'>$project</span>
            </div>
            
            <div class='field'>
                <span class='label'>Message:</span>
                <div class='value' style='margin-top: 5px; padding: 10px; background-color: #f8f9fa; border-radius: 3px;'>
                    " . nl2br($message) . "
                </div>
            </div>
            
            <div class='footer'>
                <hr>
                <p><strong>Additional Details:</strong></p>
                <p>IP Address: $ipAddress</p>
                <p>Page: $currentPage</p>
                <p>Date & Time: " . date('Y-m-d H:i:s') . "</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Email headers for HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: hello@vstudiobizz.com" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email
    if (mail($to, $subject, $emailBody, $headers)) {
        // Optional: Send auto-reply to user
        $autoReplySubject = "Thank you for your site visit enquiry";
        $autoReplyBody = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <h3>Thank you for your enquiry, $name!</h3>
            <p>We have received your site visit request and will get back to you within 24 hours.</p>
            <p><strong>Your enquiry details:</strong></p>
            <p>Project: $project</p>
            <p>Phone: $code $phoneNumber</p>
            <p>Message: " . nl2br($message) . "</p>
            
            <hr>
            <p><em>This is an automated response. Please do not reply to this email.</em></p>
        </body>
        </html>
        ";
        
        $autoReplyHeaders = "MIME-Version: 1.0" . "\r\n";
        $autoReplyHeaders .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $autoReplyHeaders .= "From: hello@demomailtrap.co" . "\r\n";
        
        mail($email, $autoReplySubject, $autoReplyBody, $autoReplyHeaders);
        
        // Return success response
        echo 'Success';
    } else {
        echo 'Email sending failed';
    }

} catch (Exception $e) {
    error_log('Email error: ' . $e->getMessage());
    echo 'An error occurred while sending email';
}
?>