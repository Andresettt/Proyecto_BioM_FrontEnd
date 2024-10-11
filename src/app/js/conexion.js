// URL de la API que devuelve las mediciones
const API_URL = 'http://localhost:13000/mediciones';  // Cambia la URL si es necesario

/**
 * @brief Obtiene la última medición de un tipo específico.
 * 
 * Esta función filtra un array de objetos de medición para encontrar la última 
 * medición del tipo especificado. Utiliza el identificador de medición para determinar 
 * cuál es la más reciente.
 * 
 * @param datos Array de objetos de medición, donde cada objeto contiene información 
 * sobre la medición, incluyendo el tipo y el identificador.
 * @param tipo Tipo de medición que se desea obtener (ej. 'Temperatura', 'Ozono').
 * @return La última medición del tipo especificado, o null si no hay datos.
 */
function obtenerUltimaMedicion(datos, tipo) {
    // Filtramos las mediciones para obtener solo las que coinciden con el tipo solicitado
    const medicionesTipo = datos.filter(m => m.nombre_tipo === tipo);
    
    // Devolver la medición con el ID más alto, que representa la última
    return medicionesTipo.length > 0 
        ? medicionesTipo.reduce((max, m) => (m.id_medicion > max.id_medicion ? m : max)) 
        : null;  // Si no hay mediciones del tipo solicitado, devolvemos null
}

/**
 * @brief Obtiene las mediciones desde el servidor y actualiza la interfaz.
 *
 * Esta función realiza una petición GET a la API para obtener las mediciones disponibles. 
 * Si la respuesta contiene datos, se actualizan los elementos HTML correspondientes 
 * con la última temperatura y ozono. En caso de un error en la solicitud, se maneja 
 * adecuadamente mostrando un mensaje de error en la interfaz.
 */
async function obtenerMediciones() {
    try {
        // Realizamos una petición GET a la API para obtener las mediciones
        const response = await fetch(API_URL, { cache: "no-store" });  // Deshabilitar cache para obtener datos frescos
        
        // Comprobamos si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        // Convertimos la respuesta a formato JSON
        const datos = await response.json();  

        // Si hay datos, actualizamos la interfaz con los valores
        if (datos.length > 0) {
            // Obtener la última medición de temperatura y ozono
            const temperatura = obtenerUltimaMedicion(datos, 'Temperatura');
            const ozono = obtenerUltimaMedicion(datos, 'Ozono');  // Cambiado de CO2 a Ozono

            // Actualizamos el contenido de la página con los datos obtenidos
            document.getElementById('temperatura').textContent = 
                temperatura ? `${temperatura.dato} °C` : 'Dato no disponible';  // Muestra el dato de temperatura o un mensaje de no disponible
            document.getElementById('co2').textContent = 
                ozono ? `${ozono.dato} ppm` : 'Dato no disponible';  // Muestra el dato de ozono o un mensaje de no disponible
        }
    } catch (error) {
        // En caso de error al obtener las mediciones, mostramos un mensaje de error
        console.error('Error al obtener las mediciones:', error);
        document.getElementById('temperatura').textContent = 'Error al cargar';  // Mensaje de error en la interfaz para temperatura
        document.getElementById('co2').textContent = 'Error al cargar';  // Mensaje de error en la interfaz para ozono
    }
}

// Llamamos a la función al cargar la página para obtener las mediciones iniciales
window.onload = obtenerMediciones;

/**
 * @brief Actualiza las mediciones periódicamente.
 * 
 * Establece un intervalo que llama a la función obtenerMediciones cada 
 * segundo para mantener los datos actualizados en la interfaz.
 * 
 * @note Este intervalo puede ajustarse a un valor mayor, como 10000 milisegundos 
 * (10 segundos), según la necesidad de actualización de datos.
 */
setInterval(obtenerMediciones, 1000);  
