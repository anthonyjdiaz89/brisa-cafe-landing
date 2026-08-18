// ══════════ CONTENIDO DE LA LANDING ══════════
// CLIENTE DEMO (empresa ficticia para probar el flujo): Brisa Café.
// Esta es la ÚNICA pieza que se toca para vestir la plantilla con un cliente.
export const CONTENIDO = {
  marca: {
    nombre: 'BRISA',
    acento: 'CAFÉ',
    logo: '',
    instagram: '@brisacafe',
  },
  producto: {
    glb: 'modelos/taza.glb',
    escala: 5.4,
    giroIdle: 0.14,
    giroBase: 0,
  },
  secciones: [
    {
      eyebrow: 'Café de origen · Barranquilla',
      titulo: 'El Caribe,\nen una taza.',
      texto: 'Tostamos cada lote en Barranquilla con granos de la Sierra Nevada. Recórrelo con el scroll: esto no es una foto, es la taza real en 3D.',
      cta: 'Desliza para recorrerlo',
      camara: { pos: [-2.6, 1.9, 8.2], mirar: [-1.5, 0.05, 0] },
      lado: 'izquierda',
    },
    {
      eyebrow: 'El tueste',
      titulo: 'Medio,\ncomo debe ser.',
      texto: 'Ni tan claro que se pierda el cuerpo, ni tan oscuro que se queme el dulce. Notas a panela, naranja y cacao.',
      camara: { pos: [7.4, 2.2, 5.4], mirar: [0.6, 0.0, 0] },
      lado: 'izquierda',
    },
    {
      eyebrow: 'El detalle',
      titulo: 'Se nota\nen el primer sorbo.',
      texto: 'Molemos al momento del pedido y sellamos con válvula, para que llegue igual de vivo a tu casa.',
      camara: { pos: [-4.6, 1.2, 6.4], mirar: [-1.2, 0.1, 0] },
      lado: 'derecha',
    },
    {
      eyebrow: 'Desde arriba',
      titulo: 'Crema densa,\ncolor avellana.',
      texto: 'La señal de un espresso bien extraído. Así se ve el nuestro en la barra de la 84.',
      camara: { pos: [2.6, 8.4, 4.2], mirar: [0.5, -0.2, 0] },
      lado: 'izquierda',
    },
    {
      eyebrow: 'Pídelo',
      foto: 'foto-cafe.jpg',
      titulo: 'Te lo llevamos\nrecién tostado.',
      texto: 'Domicilios en Barranquilla el mismo día y envíos a todo el país. Escríbenos y te contamos del lote de esta semana.',
      cta: 'Escríbenos por WhatsApp',
      camara: { pos: [-3.2, 2.0, 9.0], mirar: [-1.6, 0.0, 0] },
      lado: 'centro',
    },
  ],
};
