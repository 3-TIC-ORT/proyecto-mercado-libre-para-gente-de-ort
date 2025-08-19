
        function validarLogin() {
            const mail = document.getElementById('mail').value;
            const contraseña = document.getElementById('contraseña').value;
            if (mail === "usuario@ejemplo.com" && contraseña === "1234") {
                location.href = 'home.html';
            } else {
                document.getElementById('error').textContent = "Datos incorrectos";
            }
        }
   