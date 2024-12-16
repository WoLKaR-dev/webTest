// Importar las funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDdYr1kYDKRAESAlSg1k5iDw6wu5xCpDmw",
    authDomain: "diabetesassistance-a6047.firebaseapp.com",
    databaseURL: "https://diabetesassistance-a6047-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "diabetesassistance-a6047",
    storageBucket: "diabetesassistance-a6047.firebasestorage.app",
    messagingSenderId: "453368267598",
    appId: "1:453368267598:web:fdab7ffc26af7c73a5d41f",
    measurementId: "G-Q4G16WPH4Q"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Función para mostrar mensajes al usuario
function mostrarMensaje(mensaje) {
    const mensajeElemento = document.getElementById('mensaje');
    mensajeElemento.textContent = mensaje;
    mensajeElemento.style.display = 'block';
}

// Función para registrar usuario
document.getElementById('registrar-btn').addEventListener('click', function() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;

    createUserWithEmailAndPassword(auth, email, contrasena)
        .then((userCredential) => {
            const user = userCredential.user;
            // Guardar datos en Realtime Database
            set(ref(database, 'usuarios/' + user.uid), {
                nombre: nombre,
                email: email
            });
            console.log("Usuario registrado:", user.uid);
            mostrarUsuario(nombre);
            mostrarMensaje('Registro exitoso. Bienvenido, ' + nombre + '!');
        })
        .catch((error) => {
            console.error("Error al registrar:", error.message);
            mostrarMensaje('Error al registrar: ' + error.message);
        });
});

// Función para iniciar sesión
document.getElementById('login-btn').addEventListener('click', function() {
    const email = document.getElementById('login-email').value;
    const contrasena = document.getElementById('login-contrasena').value;

    signInWithEmailAndPassword(auth, email, contrasena)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuario iniciado sesión:", user.uid);
            mostrarUsuario(user.displayName || user.email);
            mostrarMensaje('Inicio de sesión exitoso. ¡Bienvenido de nuevo, ' + (user.displayName || user.email) + '!');
        })
        .catch((error) => {
            console.error("Error al iniciar sesión:", error.message);
            mostrarMensaje('Error al iniciar sesión: ' + error.message);
        });
});

// Función para mostrar información del usuario
function mostrarUsuario(nombre) {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('user-name').textContent = nombre;
}

// Función para cerrar sesión
document.getElementById('logout-btn').addEventListener('click', function() {
    signOut(auth).then(() => {
        console.log("Usuario cerrado sesión");
        mostrarMensaje('Cerraste sesión exitosamente.');
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
    });
});

// Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        mostrarUsuario(user.displayName || user.email);
        mostrarMensaje('Ya estás registrado e iniciado sesión.');
    } else {
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
    }
});
