# Blueprints

## Descripción
Blueprints es una aplicación web que permite la gestión y edición de planos. El cliente web interactúa con un backend desarrollado en Spring Boot, que proporciona los servicios REST necesarios para obtener, crear, actualizar y eliminar planos y autores. La interfaz facilita la visualización y edición de planos de diferentes autores, mostrando los puntos en un lienzo (canvas).

## Demo
Puedes ver una demostración en video de todas las funcionalidades de la aplicación. El video muestra cómo seleccionar autores, visualizar y editar planos, crear nuevos planos, y añadir nuevos autores.


https://github.com/user-attachments/assets/7e26da43-64f5-49e6-a578-9e5cb7e1405b


## Funcionalidad del Cliente Web

### 1. Selección del Autor
- El usuario ingresa el nombre de un autor en el campo de texto.
- Al hacer clic en el botón **"Get blueprints"**, se muestra una lista de los planos del autor. Si el autor no existe, el usuario puede crear un nuevo plano con el nombre ingresado, creando así también al nuevo autor.

### 2. Visualización de Planos
- Los planos del autor seleccionado se listan en una tabla, mostrando el nombre del plano y la cantidad de puntos que lo componen.
- Cada plano tiene un botón **"Open"** para visualizar el plano en el lienzo, mostrando la representación gráfica de los puntos conectados.

### 3. Edición de Planos
- Una vez cargado un plano, el usuario puede añadir o modificar puntos directamente en el lienzo.
- El botón **"Save/Update"** guarda los cambios realizados en el plano actual.
- El botón **"Delete"** elimina el plano seleccionado.

### 4. Creación de Nuevos Planos y Autores
- Para crear un nuevo plano, el usuario proporciona un nombre para el autor (que puede ser nuevo) y un nombre para el plano.
- Si el autor no existe en el sistema, se crea automáticamente al guardar el nuevo plano.
- El usuario puede dibujar los puntos en el lienzo y luego guardar el nuevo plano utilizando el botón **"Save/Update"**.

## Tecnologías Utilizadas
- **Frontend:** HTML, CSS, JavaScript, jQuery, Bootstrap.
- **Backend:** Spring Boot (para los servicios REST).

## Requisitos Previos
- Tener el backend de la aplicación ejecutándose, ya que el cliente web se comunica con los servicios REST de Spring Boot.
- Un navegador web moderno para acceder al cliente.

## Cómo Ejecutar
1. Asegúrate de que el backend de Spring Boot esté en ejecución.
2. Abre el archivo `index.html` en un navegador web para acceder a la aplicación.
3. Utiliza los botones y campos para gestionar autores y planos.

