import { Reto } from '../types';

/**
 * Función auxiliar para detectar inteligentemente segundos o minutos en la descripción
 * en caso de nuevos retos o variaciones.
 */
export function extractSecondsFromText(desc: string): number | null {
  // Ejemplos: "10 segundos", "5 segs", "1 minuto", "contar hasta 15"
  const minMatch = desc.match(/(\d+)\s*minuto/i);
  if (minMatch) return parseInt(minMatch[1], 10) * 60;

  const secMatch = desc.match(/(\d+)\s*(?:segundos?|segs?|seg)\b/i);
  if (secMatch) return parseInt(secMatch[1], 10);

  const countMatch = desc.match(/contar\s+(?:despacio\s+)?(?:hasta|del\s+1\s+al)\s+(\d+)/i);
  if (countMatch) return parseInt(countMatch[1], 10);

  return null;
}

export const RETOS_RAW: Omit<Reto, 'id'>[] = [
  // FÍSICOS Y MOVIMIENTO
  { title: "El Flamenco Ciego", desc: "Ponte a la pata coja, cierra los ojos y aguanta 10 segundos sin caerte ni abrir los brazos.", cat: "Movimiento", place: "todos", emoji: "🦩", timeSeconds: 10 },
  { title: "El Suelo es Lava", desc: "¡Tienes 5 segundos para subirte a algún lugar sin tocar el suelo!", cat: "Movimiento", place: "todos", emoji: "🌋", timeSeconds: 5 },
  { title: "Caminata de Cangrejo", desc: "Camina a cuatro patas boca arriba como un cangrejo hasta la otra punta de la habitación o hasta el siguiente árbol.", cat: "Movimiento", place: "todos", emoji: "🦀" },
  { title: "Salto de Astronauta", desc: "Haz 5 saltos lo más altos que puedas, aterrizando en cuclillas y diciendo en el aire '¡Houston, sin gravedad!'.", cat: "Movimiento", place: "todos", emoji: "🚀" },
  { title: "Giro Ninja Silencioso", desc: "Da 3 vueltas completas sobre ti mismo y termina en posición ninja sin hacer ni el más mínimo sonido.", cat: "Movimiento", place: "todos", emoji: "🥷" },
  { title: "La Carrera del Pingüino", desc: "Junta los tobillos y camina como un pingüino de lado a lado sin separar los pies.", cat: "Movimiento", place: "todos", emoji: "🐧" },
  { title: "El Puente Humano", desc: "Haz una postura de puente (o plancha) y cuenta despacio del 1 al 12 sin que tu barriga toque el suelo.", cat: "Movimiento", place: "todos", emoji: "🌉", timeSeconds: 12 },
  { title: "Pato Veloz", desc: "Agáchate en cuclillas y camina como un patito diciendo 'cuac cuac' durante 15 pasos.", cat: "Movimiento", place: "todos", emoji: "🦆" },
  { title: "Salto de Rana Pro", desc: "Haz 6 saltos de rana enormes tocando el suelo con las dos manos antes de cada despegue.", cat: "Movimiento", place: "todos", emoji: "🐸" },
  { title: "Toques de Rodilla", desc: "Salta llevando las rodillas al pecho 8 veces seguidas sin detenerte.", cat: "Movimiento", place: "todos", emoji: "⚡" },
  { title: "El Árbol en la Tormenta", desc: "Haz la postura del árbol (un pie pegado a la rodilla contraria) durante 15 segundos mientras los demás intentan hacerte reír sin tocarte.", cat: "Equilibrio", place: "todos", emoji: "🌳", timeSeconds: 15 },
  { title: "Gato y Perro", desc: "A cuatro patas, arquea la espalda hacia arriba como gato enfadado y luego hacia abajo sacando pecho 5 veces.", cat: "Movimiento", place: "casa", emoji: "🐱" },
  { title: "Carrera hacia Atrás", desc: "Camina 20 pasos de espaldas con mucho cuidado mirando por encima del hombro.", cat: "Movimiento", place: "todos", emoji: "🔙" },

  // RISA Y ACTUACIÓN / TEATRO
  { title: "El Robot Descompuesto", desc: "Habla y muévete como un robot al que se le están acabando las pilas durante 20 segundos.", cat: "Risas", place: "todos", emoji: "🤖", timeSeconds: 20 },
  { title: "La Estatua de Cera", desc: "Pon una cara divertidísima y quédate completamente congelado durante 15 segundos sin parpadear.", cat: "Risas", place: "todos", emoji: "🗿", timeSeconds: 15 },
  { title: "Monólogo Alienígena", desc: "Explícale al grupo cómo se come un plátano usando un idioma inventado de otro planeta durante 20 segundos.", cat: "Risas", place: "todos", emoji: "👽", timeSeconds: 20 },
  { title: "Mímica de Animal Misterioso", desc: "Imita a un animal con gestos y movimientos (¡sin ningún sonido!) hasta que alguien adivine cuál es en menos de 30 segundos.", cat: "Teatro", place: "todos", emoji: "🎭", timeSeconds: 30 },
  { title: "El Espejo Mágico", desc: "Elige a un compañero e imita exactamente cada uno de sus movimientos durante 30 segundos como si fueras su reflejo.", cat: "Risas", place: "todos", emoji: "🪞", timeSeconds: 30 },
  { title: "Risa Contagiosa", desc: "Ponte muy serio cara a cara con alguien y di '¡Ja!'... él dice '¡Ja, Ja!' y tú '¡Ja, Ja, Ja!'. El primero que se ría pierde.", cat: "Risas", place: "todos", emoji: "😂" },
  { title: "Chef Italiano Dramático", desc: "Finge preparar una pizza gigante invisible usando manos y gestos muy exagerados durante 20 segundos.", cat: "Teatro", place: "todos", emoji: "🍕", timeSeconds: 20 },
  { title: "Pájaros Locos", desc: "Mueve los brazos como un pájaro e intenta rascarte la espalda con el codo.", cat: "Risas", place: "todos", emoji: "🦜" },
  { title: "Abuelo sin Dientes", desc: "Habla durante 20 segundos tapándote los dientes con los labios contando qué hiciste hoy.", cat: "Risas", place: "todos", emoji: "👴", timeSeconds: 20 },
  { title: "Presentador de Circo", desc: "Presenta al otro jugador con tu voz más potente y elegante como el artista más asombroso del mundo en 20 segundos.", cat: "Teatro", place: "todos", emoji: "🎪", timeSeconds: 20 },

  // OBSERVACIÓN E INGENIO
  { title: "Detective de Colores", desc: "Encuentra con la vista 3 cosas rojas, 2 verdes y 1 amarilla antes de contar hasta 15.", cat: "Ingenio", place: "todos", emoji: "🔍", timeSeconds: 15 },
  { title: "Palabras Encadenadas", desc: "Di una palabra y el otro debe decir otra que empiece con la última sílaba. ¡Deben lograr 6 palabras seguidas!", cat: "Mente", place: "todos", emoji: "🔗" },
  { title: "El Abecedario Relámpago", desc: "Di 5 nombres de animales que comiencen con diferentes letras del abecedario sin dudar más de 3 segundos.", cat: "Mente", place: "todos", emoji: "🔤", timeSeconds: 15 },
  { title: "El Radar Silencioso", desc: "Cierra los ojos durante 15 segundos en silencio absoluto. Luego di 3 sonidos diferentes que hayas escuchado.", cat: "Ingenio", place: "todos", emoji: "👂", timeSeconds: 15 },
  { title: "Veo Veo Táctil", desc: "Cierra los ojos. Alguien te pondrá un objeto cotidiano en las manos y tendrás 10 segundos para adivinar qué es solo tocándolo.", cat: "Ingenio", place: "casa", emoji: "✋", timeSeconds: 10 },
  { title: "Rimas Divertidas", desc: "Busca 3 palabras que rimen con la palabra 'CAMIÓN' en menos de 15 segundos.", cat: "Mente", place: "todos", emoji: "🎵", timeSeconds: 15 },
  { title: "La Pregunta Prohibida", desc: "Durante 1 minuto debes responder a las preguntas que te hagan SIN decir las palabras 'SÍ', 'NO' ni 'BLANCO'.", cat: "Mente", place: "todos", emoji: "🚫", timeSeconds: 60 },
  { title: "Memoria Flash", desc: "Mira a tu alrededor 10 segundos. Cierra los ojos y dinos cuántas personas o cuadros hay en el lugar.", cat: "Mente", place: "todos", emoji: "🧠", timeSeconds: 10 },
  { title: "Trabalenguas Imposible", desc: "Di 3 veces seguidas y muy rápido: 'Tres tristes tigres tragaban trigo en un trigal' en menos de 15 segundos.", cat: "Mente", place: "todos", emoji: "🗣️", timeSeconds: 15 },
  { title: "De Mayor a Menor", desc: "Cuenta hacia atrás del 20 al 0 mientras das saltitos suaves con un solo pie durante 20 segundos.", cat: "Mente", place: "todos", emoji: "🔟", timeSeconds: 20 },

  // CALLE / EXTERIOR
  { title: "Cazador de Letras", desc: "Busca en carteles o señales de la calle la letra 'A', la letra 'M' y la letra 'S' en menos de 30 segundos.", cat: "Calle", place: "calle", emoji: "🚸", timeSeconds: 30 },
  { title: "La Carrera de Sombras", desc: "Intenta pisar la sombra de tu compañero sin que él pise la tuya durante 20 segundos.", cat: "Calle", place: "calle", emoji: "👥", timeSeconds: 20 },
  { title: "El Semáforo Humano", desc: "Durante 30 segundos, cuando el líder diga 'Verde' corres en el sitio; 'Amarillo' vas a cámara lenta; 'Rojo' te congelas.", cat: "Calle", place: "calle", emoji: "🚦", timeSeconds: 30 },
  { title: "Contador de Coches", desc: "Elige un color. El primero en ver pasar 3 coches de ese color gana el punto.", cat: "Calle", place: "calle", emoji: "🚗" },
  { title: "Misión Formas de Nubes", desc: "Mira al cielo y encuentra una nube que tenga forma de animal o de cosa divertida y descríbela.", cat: "Calle", place: "calle", emoji: "☁️" },
  { title: "Equilibrio en la Línea", desc: "Camina poniendo un pie justo delante del otro siguiendo una línea del suelo sin salirte durante 15 pasos.", cat: "Calle", place: "calle", emoji: "➖" },
  { title: "El Radar de Perros", desc: "El primero en encontrar un perro paseando por la calle debe imitar su ladrido suavemente.", cat: "Calle", place: "calle", emoji: "🐕" },
  { title: "Detective de Hojas", desc: "Encuentra en el suelo una hoja seca y una hoja verde sin arrancar ninguna planta antes de 30 segundos.", cat: "Calle", place: "calle", emoji: "🍂", timeSeconds: 30 },
  { title: "Salto de Balcones", desc: "Cuenta cuántos balcones con plantas ves en la fachada más cercana antes de 10 segundos.", cat: "Calle", place: "calle", emoji: "🪴", timeSeconds: 10 },
  { title: "El Abrazo al Árbol", desc: "Camina a paso ligero hasta el árbol más cercano y dale un abrazo agradeciéndole por el oxígeno.", cat: "Calle", place: "calle", emoji: "🌲" },

  // CASA
  { title: "Búsqueda del Calcetín Gemelo", desc: "Toca con la punta del dedo un calcetín y vuelve a tu lugar en menos de 10 segundos.", cat: "Casa", place: "casa", emoji: "🧦", timeSeconds: 10 },
  { title: "El Guardián del Silencio", desc: "Cruza el pasillo o la habitación caminando como un ratoncito sin que el suelo cruja durante 15 segundos.", cat: "Casa", place: "casa", emoji: "🐭", timeSeconds: 15 },
  { title: "Tocar Madera", desc: "Toca 4 objetos distintos que estén hechos de madera auténtica en menos de 12 segundos.", cat: "Casa", place: "casa", emoji: "🪵", timeSeconds: 12 },
  { title: "Foco Frío", desc: "Corre y toca la puerta del frigorífico con el codo antes de 8 segundos.", cat: "Casa", place: "casa", emoji: "❄️", timeSeconds: 8 },
  { title: "La Almohada Malabarista", desc: "Toma un cojín, lánzalo al aire, da una palmada y atrápalo antes de que caiga.", cat: "Casa", place: "casa", emoji: "🛋️" },
  { title: "Orden Exprés", desc: "Encuentra una cosa que esté descolocada en el salón o tu cuarto y guárdala en su lugar exacto en menos de 20 segundos.", cat: "Casa", place: "casa", emoji: "✨", timeSeconds: 20 },
  { title: "El Monstruo de la Cama", desc: "Gatea por debajo de una mesa o ponte a ras del suelo y saluda como un simpático monstruo.", cat: "Casa", place: "casa", emoji: "👾" },

  // COORDINACIÓN Y HABILIDADES
  { title: "Giro de Helicóptero", desc: "Extiende los brazos y gira 5 veces a la derecha y 5 a la izquierda sin marearte.", cat: "Movimiento", place: "todos", emoji: "🚁" },
  { title: "Pancita y Cabeza", desc: "Frótate la barriga en círculos con una mano mientras te das palmaditas suaves en la cabeza con la otra durante 10 segundos.", cat: "Coordinación", place: "todos", emoji: "🤹", timeSeconds: 10 },
  { title: "La Carrera del Gusano", desc: "Túmbate en el suelo y muévete hacia adelante ondulando tu cuerpo sin usar las manos durante 15 segundos.", cat: "Movimiento", place: "casa", emoji: "🐛", timeSeconds: 15 },
  { title: "Mímica de Oficios", desc: "Imita ser un bombero apagando fuego o un astronauta hasta que adivinen tu profesión en 30 segundos.", cat: "Teatro", place: "todos", emoji: "👨‍🚒", timeSeconds: 30 },
  { title: "El Chiste Exprés", desc: "Cuenta tu mejor chiste o una frase cómica que haga sonreír a quien te escucha en menos de 20 segundos.", cat: "Risas", place: "todos", emoji: "😆", timeSeconds: 20 },
  { title: "Superhéroe en Despegue", desc: "Haz tu mejor pose de superhéroe volando y quédate firme como una roca 12 segundos.", cat: "Movimiento", place: "todos", emoji: "🦸", timeSeconds: 12 },
  { title: "Aplaude por la Espalda", desc: "Pasa los brazos por detrás de la espalda e intenta aplaudir 10 veces en menos de 10 segundos.", cat: "Coordinación", place: "todos", emoji: "👏", timeSeconds: 10 },
  { title: "El Salto de la Tijera", desc: "Haz 10 saltos de tijera abriendo y cerrando brazos y piernas a buen ritmo.", cat: "Movimiento", place: "todos", emoji: "⭐" },
  { title: "Adivina el Dibujo en la Espalda", desc: "Con tu dedo dibuja un sol, un corazón o un número en la espalda de tu compañero para que lo adivine en 20 segundos.", cat: "Ingenio", place: "todos", emoji: "✍️", timeSeconds: 20 },
  { title: "Párate sin Manos", desc: "Siéntate en el suelo con las piernas cruzadas e intenta ponerte de pie sin apoyar las manos.", cat: "Movimiento", place: "todos", emoji: "🧘" },
  { title: "La Carrera de Carretilla Invisible", desc: "Finge empujar una carretilla pesadísima con pasos gigantes y esfuerzo teatral durante 15 segundos.", cat: "Teatro", place: "todos", emoji: "🚜", timeSeconds: 15 },
  { title: "Grito Mudo", desc: "Haz la cara de gritar con toda tu fuerza pero sin que salga absolutamente ningún sonido durante 8 segundos.", cat: "Risas", place: "todos", emoji: "😱", timeSeconds: 8 },
  { title: "Tocar la Nariz Cruzada", desc: "Mano derecha a oreja izquierda y mano izquierda a la nariz. Cambia rápido de manos 5 veces.", cat: "Coordinación", place: "todos", emoji: "👃" },
  { title: "El Esquiador Veloz", desc: "Salta de lado a lado con los pies juntos como si estuvieras esquiando por la nieve 15 veces.", cat: "Movimiento", place: "todos", emoji: "⛷️" },
  { title: "La Palabra Más Larga", desc: "Piensa y pronuncia la palabra más larga que conozcas en español sin equivocarte en 15 segundos.", cat: "Mente", place: "todos", emoji: "📖", timeSeconds: 15 },
  { title: "El Duelo de Miradas", desc: "Mira fijamente a los ojos a tu rival durante 30 segundos. El primero en parpadear o reírse le da el punto al otro.", cat: "Risas", place: "todos", emoji: "👀", timeSeconds: 30 },
  { title: "Canto Operístico", desc: "Canta 'Cumpleaños Feliz' con voz de cantante de ópera muy dramático durante 15 segundos.", cat: "Risas", place: "todos", emoji: "🎤", timeSeconds: 15 },
  { title: "El Ninja Agachado", desc: "Haz una sentadilla profunda y aguanta abajo contando hasta 10 con una sonrisa.", cat: "Movimiento", place: "todos", emoji: "🥋", timeSeconds: 10 },
  { title: "Paso de Gigante y Enano", desc: "Da 3 zancadas gigantescas y luego 6 pasos diminutos pegando el talón a la punta.", cat: "Movimiento", place: "todos", emoji: "👣" },
  { title: "El Reloj Humano", desc: "Túmbate en el suelo y gira tu cuerpo usando las manos como si fueras la aguja de un reloj durante 15 segundos.", cat: "Movimiento", place: "casa", emoji: "⏰", timeSeconds: 15 },
  { title: "Adivina la Canción Tarareada", desc: "Tararea la melodía de una canción infantil o película sin decir palabras hasta que la descubran en 30 segundos.", cat: "Ingenio", place: "todos", emoji: "🎶", timeSeconds: 30 },
  { title: "5 Animales con Cola Larga", desc: "Nombra 5 animales que tengan una cola muy larga antes de que cuenten hasta 10.", cat: "Mente", place: "todos", emoji: "🐒", timeSeconds: 10 },
  { title: "El Paseo del Canguro", desc: "Da 5 saltos hacia adelante con ambos pies pegados y las manos recogidas en el pecho.", cat: "Movimiento", place: "todos", emoji: "🦘" },
  { title: "Toque del Talón", desc: "Toca con tu mano izquierda tu talón derecho por detrás 8 veces alternando de lado.", cat: "Coordinación", place: "todos", emoji: "👟" },
  { title: "El Detective Suave", desc: "Busca y toca algo que sea muy suave (una tela, un peluche, una prenda de lana) antes de 15 segundos.", cat: "Ingenio", place: "casa", emoji: "🧸", timeSeconds: 15 },
  { title: "El Detective Rugoso", desc: "Busca y toca una superficie que sea rasposa o rugosa (una pared, una corteza, una suela) antes de 15 segundos.", cat: "Ingenio", place: "todos", emoji: "🧱", timeSeconds: 15 },
  { title: "La Torre Humana", desc: "Estírate lo más alto que puedas de puntillas con las manos apuntando al cielo 10 segundos.", cat: "Movimiento", place: "todos", emoji: "🦒", timeSeconds: 10 },
  { title: "Sonidos de Granja", desc: "Haz el sonido de una vaca, un gallo, un cerdo y una oveja en menos de 8 segundos.", cat: "Risas", place: "todos", emoji: "🚜", timeSeconds: 8 },
  { title: "Cero Cosquillas", desc: "Deja que te hagan cosquillas en las plantas de los pies o costillas durante 5 segundos sin gritar.", cat: "Risas", place: "todos", emoji: "🪶", timeSeconds: 5 },
  { title: "Paso de Desfile", desc: "Marcha como en una banda de música levantando bien alto las rodillas durante 20 pasos.", cat: "Movimiento", place: "todos", emoji: "🥁" },
  { title: "Pelota Imaginaria", desc: "Juega un partido de tenis invisible con un amigo lanzando y devolviendo la bola durante 20 segundos.", cat: "Teatro", place: "todos", emoji: "🎾", timeSeconds: 20 },
  { title: "Buscador de Círculos", desc: "Señala 4 cosas redondas que veas a tu alrededor antes de que pasen 15 segundos.", cat: "Ingenio", place: "todos", emoji: "⭕", timeSeconds: 15 },
  { title: "El Baile Loco", desc: "Inventa un paso de baile que combine mover los hombros y saltar a la pata coja durante 15 segundos.", cat: "Risas", place: "todos", emoji: "💃", timeSeconds: 15 },
  { title: "El León Rugiente", desc: "Abre la boca, saca la lengua y suelta el rugido de león más potente y divertido que puedas durante 8 segundos.", cat: "Risas", place: "todos", emoji: "🦁", timeSeconds: 8 },
  { title: "Equilibrio con la Cabeza", desc: "Pon un objeto blando (calcetín o gorra) en tu cabeza y camina 5 pasos sin que se caiga.", cat: "Equilibrio", place: "casa", emoji: "🎩" },
  { title: "Pies en el Aire", desc: "Siéntate en el suelo y mantén los pies en el aire sin tocar nada durante 10 segundos.", cat: "Movimiento", place: "casa", emoji: "🦶", timeSeconds: 10 },
  { title: "La Serpiente Sigilosa", desc: "Pasa por debajo de los brazos en jarras de tu compañero sin rozarle el cuerpo.", cat: "Movimiento", place: "todos", emoji: "🐍" },
  { title: "Choca las 5 Sin Sonido", desc: "Choca las cinco con tu compañero pero frena la mano a un centímetro sin hacer ruido.", cat: "Control", place: "todos", emoji: "🖐️" },
  { title: "Carrera de Caracoles", desc: "Compite con tu amigo para ver quién llega más lento al otro lado sin parar de moverse durante 20 segundos.", cat: "Risas", place: "todos", emoji: "🐌", timeSeconds: 20 },
  { title: "El Abrazo Colectivo", desc: "Dales un abrazo fuerte de oso a todos los que estén jugando contigo en este momento.", cat: "Cariño", place: "todos", emoji: "🐻" },
  { title: "Buscador de Triángulos", desc: "Encuentra en menos de 15 segundos alguna forma triangular en tu entorno.", cat: "Ingenio", place: "todos", emoji: "📐", timeSeconds: 15 },
  { title: "Mueve las Orejas", desc: "Intenta mover las orejas sin tocarlas (o pon la cara más graciosa) durante 10 segundos.", cat: "Risas", place: "todos", emoji: "👂", timeSeconds: 10 },
  { title: "El Salto del Espantapájaros", desc: "Salta abriendo los brazos horizontalmente como si te soplara un vendaval.", cat: "Movimiento", place: "todos", emoji: "🌾" },
  { title: "Voz de Dibujo Animado", desc: "Di una frase entera con voz de ratoncito agudo como Mickey Mouse en 15 segundos.", cat: "Risas", place: "todos", emoji: "🧀", timeSeconds: 15 },
  { title: "Voz de Ogro Gigante", desc: "Di tu nombre y lo que más te gusta comer con tu voz más grave y cavernosa en 15 segundos.", cat: "Risas", place: "todos", emoji: "👹", timeSeconds: 15 },
  { title: "Contar con los Ojos Cerrados", desc: "Cierra los ojos e intenta adivinar cuándo han pasado exactamente 15 segundos en silencio.", cat: "Mente", place: "todos", emoji: "⏱️", timeSeconds: 15 },
  { title: "Equilibrio en un Dedo", desc: "Coloca la punta de tu dedo índice en tu nariz y gira 3 veces sobre ti mismo mirando el suelo.", cat: "Movimiento", place: "todos", emoji: "🌀" },
  { title: "Imita a un Bebé Llorón", desc: "Finge llorar como un bebé al que se le cayó el chupete durante 10 segundos y luego ríete.", cat: "Teatro", place: "todos", emoji: "🍼", timeSeconds: 10 },
  { title: "Simón Dice Relámpago", desc: "El otro jugador te da 3 órdenes seguidas súper rápidas (tócate la rodilla, salta, gira) y debes cumplirlas en 15 segundos.", cat: "Atención", place: "todos", emoji: "👑", timeSeconds: 15 },
  { title: "La Pelota Elástica", desc: "Rebota en el sitio como si fueras una pelota de goma súper botadora durante 12 botes.", cat: "Movimiento", place: "todos", emoji: "🏀" },
  { title: "Cero Parpadeo", desc: "Aguanta 12 segundos mirando al cielo o al techo sin parpadear ni una sola vez.", cat: "Control", place: "todos", emoji: "👀", timeSeconds: 12 },
  { title: "Pies Calientes", desc: "Trota en el sitio lo más rápido que puedas como si el suelo estuviera que hierve durante 10 segundos.", cat: "Movimiento", place: "todos", emoji: "🔥", timeSeconds: 10 },
  { title: "El Abrazo de Rodillas", desc: "Agáchate, abraza tus rodillas y balancéate suavemente hacia adelante y atrás durante 10 segundos sin caerte.", cat: "Equilibrio", place: "casa", emoji: "🥚", timeSeconds: 10 },
  { title: "Buscador de Letra O", desc: "Encuentra en menos de 10 segundos algo en tu entorno que sea perfectamente redondo como la letra O.", cat: "Ingenio", place: "todos", emoji: "⭕", timeSeconds: 10 },
  { title: "La Postura del Superhéroe Oculto", desc: "Invéntate una pose de superhéroe que nunca antes haya existido y mantenla firme durante 15 segundos.", cat: "Creatividad", place: "todos", emoji: "🦸‍♂️", timeSeconds: 15 },
  { title: "El Avión Supersónico", desc: "Abre los brazos, ponte a la pata coja echando la otra pierna hacia atrás e inclínate hacia adelante durante 10 segundos.", cat: "Equilibrio", place: "todos", emoji: "✈️", timeSeconds: 10 },
  { title: "Caras Raras", desc: "Haz 3 muecas diferentes y mantén cada una durante 3 segundos (total 10s).", cat: "Risas", place: "todos", emoji: "🤪", timeSeconds: 10 },
  { title: "El Director de Orquesta", desc: "Finge dirigir una gran orquesta moviendo los brazos con pasión mientras canturreas durante 15 segundos.", cat: "Teatro", place: "todos", emoji: "🎻", timeSeconds: 15 },
  { title: "Pisar Solo Líneas", desc: "Camina 10 pasos pisando únicamente las juntas o líneas de las baldosas del suelo.", cat: "Calle", place: "calle", emoji: "📐" },
  { title: "Nombres de Comidas Ricas", desc: "Di 5 comidas deliciosas que no sean dulces en menos de 8 segundos.", cat: "Mente", place: "todos", emoji: "🍝", timeSeconds: 8 },
  { title: "Tocar 3 Cosas Frías", desc: "Toca 3 objetos que se sientan fríos al tacto (metal, cristal, piedra) antes de 15 segundos.", cat: "Ingenio", place: "todos", emoji: "🧊", timeSeconds: 15 },
  { title: "El Desafío de la Sombra", desc: "Colócate de forma que tu sombra parezca más alta que la de tu compañero en menos de 15 segundos.", cat: "Calle", place: "calle", emoji: "👥", timeSeconds: 15 },
  { title: "Giro con Salto", desc: "Salta en el aire e intenta hacer medio giro (180 grados) aterrizando equilibrado.", cat: "Movimiento", place: "todos", emoji: "🌪️" },
  { title: "Aplauso con Pies", desc: "Túmbate bocarriba y junta las plantas de tus zapatillas o pies aplaudiendo en el aire 5 veces.", cat: "Risas", place: "casa", emoji: "🦶" },
  { title: "La Voz del Eco", desc: "Repite cada palabra que diga tu compañero como un eco durante 15 segundos.", cat: "Risas", place: "todos", emoji: "📣", timeSeconds: 15 },
  { title: "Acrobacia del Pulgar", desc: "Gira los pulgares uno alrededor del otro sin que se toquen lo más rápido que puedas durante 10 segundos.", cat: "Coordinación", place: "todos", emoji: "👍", timeSeconds: 10 },
  { title: "El Abrazo Propio", desc: "Cruza fuerte los brazos sobre tu pecho, date palmaditas en los hombros y di: '¡Soy un campeón/a!'.", cat: "Motivación", place: "todos", emoji: "🏆" },
  { title: "Caminar de Talones", desc: "Camina 15 pasos apoyando únicamente los talones sin que las puntas de los pies toquen el piso.", cat: "Movimiento", place: "todos", emoji: "🥾" },
  { title: "Caminar de Puntillas", desc: "Camina 15 pasos como una bailarina de ballet totalmente de puntillas y con la espalda recta.", cat: "Movimiento", place: "todos", emoji: "🩰" },
  { title: "La Mirada Láser", desc: "Elige un punto fijo en la pared o a lo lejos y no quites la vista de él mientras das 5 pasos hacia un lado.", cat: "Atención", place: "todos", emoji: "🎯" },
  { title: "El Barco en Oleaje", desc: "Separa los pies y balancéate de un lado a otro como si estuvieras en un barco con olas gigantes durante 12 segundos.", cat: "Movimiento", place: "todos", emoji: "⛵", timeSeconds: 12 },
  { title: "Adivina la Letra en el Aire", desc: "Dibuja con el dedo en el aire una letra gigante y los demás tienen 20 segundos para adivinar cuál es.", cat: "Ingenio", place: "todos", emoji: "🪄", timeSeconds: 20 },
  { title: "Mover la Nariz de Conejo", desc: "Arruga la nariz como un conejito comiendo zanahorias lo más rápido que puedas durante 10 segundos.", cat: "Risas", place: "todos", emoji: "🐰", timeSeconds: 10 },
  { title: "El Saludo Elegante", desc: "Haz una reverencia de rey o reina de cuento inclinándote con elegancia ante tu público.", cat: "Teatro", place: "todos", emoji: "👑" },
  { title: "El Escalador Invisible", desc: "Mueve brazos y piernas en el sitio como si estuvieras escalando una montaña muy empinada durante 15 segundos.", cat: "Movimiento", place: "todos", emoji: "🧗", timeSeconds: 15 },
  { title: "Lanza el Beso al Viento", desc: "Tira un beso con la mano al aire y síguelo con la mirada hasta que desaparezca en el cielo.", cat: "Risas", place: "todos", emoji: "💨" },
  { title: "El Chófer de Autobús", desc: "Conduce un autobús imaginario esquivando baches enormes y tocando el claxon '¡Pipí!' durante 15 segundos.", cat: "Teatro", place: "todos", emoji: "🚌", timeSeconds: 15 },
  { title: "5 Cosas que Vuelan", desc: "Nombra 5 cosas que vuelen que NO sean pájaros antes de que pasen 10 segundos.", cat: "Mente", place: "todos", emoji: "🚁", timeSeconds: 10 },
  { title: "La Risa Silenciosa", desc: "Ríete a carcajadas con todo el cuerpo pero sin emitir absolutamente ningún sonido audible durante 10 segundos.", cat: "Risas", place: "todos", emoji: "🤐", timeSeconds: 10 },
  { title: "El Salto de Tijera Cruzado", desc: "Haz saltos cruzando los pies alternativamente por delante y por detrás 6 veces.", cat: "Coordinación", place: "todos", emoji: "✂️" },
  { title: "El Escáner Corporal", desc: "Tócate la cabeza, los hombros, las rodillas y los pies en ese orden 3 veces aumentando la velocidad.", cat: "Coordinación", place: "todos", emoji: "🕺" },
  { title: "Tocar Algo Amarillo", desc: "¡Tienes 7 segundos para correr y tocar algo amarillo en tu entorno!", cat: "Ingenio", place: "todos", emoji: "🟡", timeSeconds: 7 },
  { title: "Tocar Algo Brillante", desc: "Encuentra y señala algo que brille con la luz del sol o de una lámpara antes de 10 segundos.", cat: "Ingenio", place: "todos", emoji: "✨", timeSeconds: 10 },
  { title: "El Monstruo Cosquilloso", desc: "Amenaza a tu compañero diciendo con voz de monstruo gracioso: '¡Te voy a atrapar para hacerte cosquillas!'.", cat: "Risas", place: "todos", emoji: "👹" },
  { title: "El Reloj de Cuco", desc: "Haz 'tic-tac, tic-tac' 5 veces y luego salta diciendo '¡Cu-cú!'.", cat: "Risas", place: "todos", emoji: "🕰️" },
  { title: "El Patinador Sobre Hielo", desc: "Desliza los pies suavemente por el suelo como si estuvieras en una pista de patinaje olímpica durante 15 segundos.", cat: "Movimiento", place: "casa", emoji: "⛸️", timeSeconds: 15 },
  { title: "La Muralla China", desc: "Ponte espalda contra espalda con tu compañero y empujad suavemente con las piernas flexionadas 5 segundos.", cat: "Fuerza", place: "todos", emoji: "🧱", timeSeconds: 5 },
  { title: "La Palma Rápida", desc: "Intenta aplaudir 15 veces en menos de 5 segundos contadas por el cronómetro.", cat: "Agilidad", place: "todos", emoji: "⚡", timeSeconds: 5 },
  { title: "Canción con la Letra A", desc: "Canta una estrofa de una canción cambiando todas las vocales por la letra 'A' durante 20 segundos.", cat: "Risas", place: "todos", emoji: "🎶", timeSeconds: 20 },
  { title: "El Paso Marciano", desc: "Camina dando un paso normal y en el siguiente elevando la rodilla hasta el pecho con sonido de nave.", cat: "Movimiento", place: "todos", emoji: "🛸" },
  { title: "La Tabla Firme", desc: "Ponte boca abajo apoyando los codos y la punta de los pies sin arquear la espalda durante 10 segundos.", cat: "Fuerza", place: "casa", emoji: "🛹", timeSeconds: 10 },
  { title: "Aplaude por Debajo", desc: "Eleva una pierna y aplaude por debajo de ella. Luego con la otra pierna. ¡Hazlo 6 veces seguidas!", cat: "Coordinación", place: "todos", emoji: "🦵" },
  { title: "La Mirada de Halcón", desc: "Mira a lo lejos y di qué es lo más lejano que tus ojos son capaces de ver con claridad.", cat: "Atención", place: "calle", emoji: "🦅" },
  { title: "El Saludo Secreto", desc: "Inventa en 10 segundos un saludo secreto con tu amigo (choque de codo, puño y vuelta).", cat: "Creatividad", place: "todos", emoji: "🤝", timeSeconds: 10 },
  { title: "Toque de Espalda", desc: "Intenta tocarte las dos manos por detrás de la espalda, una pasando por arriba del hombro y otra por abajo.", cat: "Flexibilidad", place: "todos", emoji: "🤸" },
  { title: "La Carrera del León Sigiloso", desc: "Avanza hacia un objetivo agachado sin levantar la cabeza como si fueras a cazar en la sabana durante 15 segundos.", cat: "Movimiento", place: "todos", emoji: "🐾", timeSeconds: 15 },
  { title: "Chiste de 'Se Abre el Telón'", desc: "Inventa un chiste corto de 'se abre el telón' o pregunta una adivinanza que te sepas en 20 segundos.", cat: "Mente", place: "todos", emoji: "🎭", timeSeconds: 20 },
  { title: "El Péndulo Humano", desc: "Párate recto y deja caer tu cuerpo hacia adelante y hacia atrás sujetándote solo con los tobillos durante 10 segundos.", cat: "Equilibrio", place: "todos", emoji: "⚓", timeSeconds: 10 },
  { title: "Caminar por la Cuerda Floja", desc: "Abre los brazos como si estuvieras a 100 metros de altura sobre una cuerda y da 8 pasos con concentración total.", cat: "Equilibrio", place: "todos", emoji: "🎪" },
  { title: "¡Victoria Total!", desc: "Salta al aire, levanta los dos brazos y grita con orgullo: '¡SOY EL REY/LA REINA DE LOS RETOS!'.", cat: "Celebración", place: "todos", emoji: "👑" }
];

export const RETOS: Reto[] = RETOS_RAW.map((r, index) => {
  const autoTime = r.timeSeconds ?? extractSecondsFromText(r.desc) ?? undefined;
  return {
    ...r,
    id: `reto-${index + 1}`,
    timeSeconds: autoTime,
  };
});
