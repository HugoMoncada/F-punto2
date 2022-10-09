# Solución al punto 2 de la prueba

- Para mi solucion decidi empezar con la logica de la aplicación y esto se hizo con JS nativo.
- Empece rellenando el select con la lista de paises, luego la llamada a la API, rederizacion del contenido y validaciones.
- La aplicacion usa 3 end points de la API: 
    - *Simple*: Cuando ingresan una sola persona sin país.
    - *Batch Usage*: Cuando ingresan varios nombres sin país.
    - *Localization*: Cuando ingresan uno o varios nombres con país.
- Decidí usarlos de esta forma por que la API no tiene un end point al cual le pueda pasar un array de personas con paises a cada uno.<br>
Si no lo hacia asi todas las personas añadidas iban a tener el mismo pais, lo cual no tenia mucho sentido desde mi punto de vista, 
ya que , por **ejemplo**: "*Andrea*" con pais "*Mexico*" tiene una edad diferente a "*Andrea*" con país "*Argentina*". 
Ahora cada persona es una busqueda diferente y se renderiza con el pais con el que se creó. 

- Una vez realizada la logica empece a agregarle estilos, como se ve no es algo complicado, pero cumple la funcion de mostrar los resultados de forma ordenada.


