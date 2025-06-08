<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = htmlspecialchars($_POST["nombre"]);
    $email = htmlspecialchars($_POST["email"]);
    $mensaje = htmlspecialchars($_POST["mensaje"]);

    $to = "aureusmousseec@gmail.com";
    $subject = "Nuevo mensaje de contacto de $nombre";
    $body = "Nombre: $nombre\nEmail: $email\nMensaje:\n$mensaje";
    $headers = "From: $email\r\nReply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "<script>alert('¡Mensaje enviado con éxito!'); window.location.href='index.html';</script>";
    } else {
        echo "<script>alert('Hubo un error al enviar el mensaje. Intenta de nuevo.'); window.history.back();</script>";
    }
} else {
    header("Location: index.html");
    exit();
}
?> 