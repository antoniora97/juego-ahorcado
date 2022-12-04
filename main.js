// Variables y constantes
const diccionario_facil = ["CASA", "HOLA", "FAMA", "BARULLO", "ORUGA", "FAMILIA", "PARED"];
const diccionario_normal = ["FERROCARRIL", "GUISANTE", "GUARDERIA", "DROGUERIA", "GUINDILLA"];
const diccionario_dificil = ["CUESTIONARIO", "TRANSICIONAR", "APALANCAMIENTO", "CONTEMPLACIONES"];

const niveles = document.getElementById("niveles");
const level = document.querySelectorAll("#niveles .nivel").forEach((e) => {
    e.addEventListener("click", () => {
        // se selecciona el diccionario según el nivel
        let diccionario = []
        const nivel = e.innerHTML.split(" ")[0];
        switch (nivel) {
            case "Fácil": 
                diccionario = diccionario_facil;
                break;
            case "Normal": 
                diccionario = diccionario_normal; 
                break;
            case "Difícil": 
                diccionario = diccionario_dificil; 
                break;
        }
        // Hacemos que el panel de niveles desaparezca
        niveles.style.animation = "desaparecer 1s linear";
        setTimeout( () => {
            niveles.style.display = "none";
            // y que el panel del juego aparezca
            document.getElementById("principal").style.display = "flex";
        }, 1000);

        const p_palabra_generada = document.querySelector("#palabra p");
        const ahorcado = document.getElementById("ahorcado");
        const letras = document.getElementById("letras");
        let palabra_generada = diccionario[Math.floor((Math.random() * ((diccionario.length - 1) - 0 + 1)) + 0)].split("");
        let palabra_generada_incompleta = []
        for (let i in palabra_generada) {
            palabra_generada_incompleta.push("_");
        }
        let partida_ganada = false;
        let vidas = 6;
        const p_vidas = document.querySelector("#vidas p");
        p_vidas.innerHTML = vidas + "<span id='corazon' style='color: red'>&#10084</span>";
        escribePalabra();

        // Escribe en el HTML la palabra a acertar, poniendo guiones en las letras no acertadas.
        function escribePalabra() {
            p_palabra_generada.innerHTML = "";
            for (let i in palabra_generada_incompleta) {
                p_palabra_generada.innerHTML += palabra_generada_incompleta[i];
                if (i != palabra_generada_incompleta.length - 1)
                    p_palabra_generada.innerHTML += " ";
            }
            p_vidas.innerHTML = vidas + "<span id='corazon' style='color: red'>&#10084</span>";
        }

        // Cuando se pulsa un botón, se escribe en la pantalla su valor escrito y se deshabilita el botón pulsado
        const botones = document.querySelectorAll("#letras div p .letra");
        botones.forEach((e) => {
            e.addEventListener("click", () => {
                // Evita la interacción con los elementos de la partida (los botones con las letras)
                if (vidas != 0 && !partida_ganada) {
                    let acierto = false;
                    // Se recorre la cadena que contiene la palabra a acertar 'palabra_generada' y se añade o no el valor de 
                    // la tecla que contiene el evento 'e' a la palabra sin rellenar 'palabra_generada_incompleta'
                    for (let i in palabra_generada) {
                        if (e.innerHTML == palabra_generada[i]) {
                            palabra_generada_incompleta[i] = e.innerHTML;
                            acierto = true;
                        }
                    }
                    // Se comprueba si no ha habido ningún acierto tras recorrer toda la cadena
                    if (!acierto) {
                        vidas -= 1;
                        cambiaImagen(vidas);
                        e.nextElementSibling.classList.add("cruz-d");
                        e.nextElementSibling.nextElementSibling.classList.add("cruz-i");
                    } else {
                        e.classList.add("circulo");
                    }
                    // Se deshabilita la tecla pulsada que ha creado el evento 'e' y se cambia el color y el fondo para que
                    // sea reconocible que no se puede pulsar
                    e.classList.remove("hover");
                    e.setAttribute("disabled", "disabled");
                    // Se escribe el estado actual de la palabra (mirar función)
                    escribePalabra();
                    // comprobamos si es fin de partida
                    comprobarVictoria();
                    comprobarVidas();
                }
            });
        });

        // Comprueba si la palabra se ha conseguido completar: si ésta no tiene ningún _ escrito, entonces es porque
        // se ha completado. También se escribe un mensaje al usuario indicando el resultado.
        function comprobarVictoria() {
            if (!p_palabra_generada.innerHTML.includes("_")) {
                letras.style.animation = "disolver 1s linear";
                setTimeout(() => {
                    letras.style.display = "none";
                    ahorcado.style.animation = "bajar 3s linear";
                    p_palabra_generada.innerHTML = "HAS GANADO. Has acertado la palabra.<br/>La página se recargará en unos segundos.";
                }, 1000);
                partida_ganada = true;
                reload();
            }
        }

        // Comprueba si el usuario se ha quedado sin vidas y se le notifica al respecto.
        function comprobarVidas() {
            if (vidas == 0) {
                letras.style.animation = "disolver 1s linear";
                setTimeout(() => {
                    letras.style.display = "none";
                    ahorcado.style.animation = "bajar 3s linear";
                    p_palabra_generada.innerHTML = "HAS PERDIDO. Te has quedado sin vidas.<br/>La palabra era " + palabra_generada.join("") + ".<br/>La página se recargará en unos segundos.";
                }, 1000);
                reload();
            }
        }

        function cambiaImagen(vidas) {
            const figure = document.querySelector("#ahorcado img");
            switch (vidas) {
                case 6: figure.setAttribute("src", "img/cuerda.svg"); break;
                case 5: figure.setAttribute("src", "img/cabeza.svg"); break;
                case 4: figure.setAttribute("src", "img/cuerpo.svg"); break;
                case 3: figure.setAttribute("src", "img/brazo-derecho.svg"); break;
                case 2: figure.setAttribute("src", "img/brazo-izquierdo.svg"); break;
                case 1: figure.setAttribute("src", "img/pierna-derecha.svg"); break;
                case 0: figure.setAttribute("src", "img/pierna-izquierda.svg"); break;
            }
        }

        // Recarga la página 5 segundos después de ejecutarse para que dé tiempo a leer el mensaje de las funciones
        // 'comprobarVictoria()' o 'comprobarVidas()'.
        function reload() {
            setTimeout(() => {
                location.reload()
            }, 5000);
        }
    });
});