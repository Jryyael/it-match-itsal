import React from 'react';

// Coordenadas calibradas sobre la imagen 2048x2048 (/oso-poses.jpg)
const POSE_META = {
  1: { col: 0, row: 0, label: 'Asistente IT Match saludando' },
  2: { col: 1, row: 0, label: 'Asistente IT Match con laptop' },
  3: { col: 2, row: 0, label: 'Asistente IT Match con formato oficial QR' },
  4: { col: 0, row: 1, label: 'Asistente IT Match indicando acción' },
  5: { col: 1, row: 1, label: 'Asistente IT Match graduado' },
  6: { col: 2, row: 1, label: 'Asistente IT Match analizando' },
  7: { col: 0, row: 2, label: 'Asistente IT Match confirmando' },
  8: { col: 1, row: 2, label: 'Asistente IT Match buscando' },
  9: { col: 2, row: 2, label: 'Asistente IT Match dando la bienvenida' },
};

// Posiciones exactas para avatar circular con backgroundSize: 380% 380%
// Oculta por completo los números 1-9 y cualquier fragmento de celdas vecinas
const AVATAR_X = ['4.8%', '50%', '95.2%'];
const AVATAR_Y = ['4.1%', '49.5%', '95.3%'];

export default function MascotSprite({
  pose = 1,
  variant = 'full', // 'full' | 'avatar'
  className = 'w-28',
  blend = true,
}) {
  const cfg = POSE_META[pose] || POSE_META[1];

  if (variant === 'avatar') {
    return (
      <div
        role="img"
        aria-label={cfg.label}
        className={`relative aspect-square overflow-hidden select-none bg-white ${
          blend ? 'mix-blend-multiply' : ''
        } ${className}`}
        style={{
          backgroundImage: "url('/oso-poses.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: '380% 380%',
          backgroundPosition: `${AVATAR_X[cfg.col]} ${AVATAR_Y[cfg.row]}`,
        }}
      />
    );
  }

  const xShift = -(cfg.col * 33.333);
  const rowStartsFull = [-1.4, -34.4, -67.6];
  const yShift = rowStartsFull[cfg.row];

  return (
    <div
      role="img"
      aria-label={cfg.label}
      className={`relative aspect-[100/91] overflow-hidden select-none ${className}`}
    >
      <img
        src="/oso-poses.jpg"
        alt={cfg.label}
        draggable={false}
        className={`pointer-events-none max-w-none select-none ${
          blend ? 'mix-blend-multiply' : ''
        }`}
        style={{
          width: '300%',
          height: 'auto',
          transform: `translate(${xShift}%, ${yShift}%)`,
        }}
      />
    </div>
  );
}
