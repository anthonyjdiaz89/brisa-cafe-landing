// ══════════ PLANTILLA 1 · PRODUCTO 360 ══════════
// El visitante recorre un producto 3D con el scroll: cada sección DOM fija un
// punto de cámara y el desplazamiento interpola suavemente entre ellos.
import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, useGLTF, ContactShadows, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { CONTENIDO } from '../config/contenido.js';

const BASE = import.meta.env.BASE_URL; // respeta /landing/ u otra base

// suavizado clásico para que la cámara no llegue seca a cada parada
const suave = (t) => t * t * (3 - 2 * t);

function Producto() {
  const { scene } = useGLTF(BASE + CONTENIDO.producto.glb, BASE + 'draco/');
  const ref = useRef();
  // auto-centrar y normalizar el modelo a un tamaño conocido
  const listo = useMemo(() => {
    const caja = new THREE.Box3().setFromObject(scene);
    const tam = caja.getSize(new THREE.Vector3());
    const esc = CONTENIDO.producto.escala / Math.max(tam.x, tam.y, tam.z);
    scene.scale.setScalar(esc);
    const caja2 = new THREE.Box3().setFromObject(scene);
    const centro = caja2.getCenter(new THREE.Vector3());
    scene.position.x -= centro.x;
    scene.position.z -= centro.z;
    scene.position.y -= caja2.min.y + 1.02; // la base descansa sobre el piso (y = -1.02)
    return scene;
  }, [scene]);
  // giro perpetuo sutil solo en la primera y última parada (cámara "en reposo")
  const scroll = useScroll();
  useFrame((_, dt) => {
    const n = CONTENIDO.secciones.length - 1;
    const enReposo = scroll.offset < 0.04 || scroll.offset > 1 - 0.04 / n;
    const objetivo = enReposo ? CONTENIDO.producto.giroIdle : 0;
    ref.current.rotation.y += objetivo * dt;
  });
  return <group ref={ref} rotation={[0, CONTENIDO.producto.giroBase || 0, 0]}><primitive object={listo} /></group>;
}

function CamaraRecorrido() {
  const scroll = useScroll();
  const { camera } = useThree();
  const mirar = useRef(new THREE.Vector3(0, 0.4, 0));
  const paradas = CONTENIDO.secciones.map((s) => ({
    pos: new THREE.Vector3(...s.camara.pos),
    mirar: new THREE.Vector3(...s.camara.mirar),
  }));
  useFrame(() => {
    const n = paradas.length - 1;
    const t = Math.min(scroll.offset * n, n - 0.0001);
    const i = Math.floor(t);
    const f = suave(t - i);
    camera.position.lerpVectors(paradas[i].pos, paradas[i + 1].pos, f);
    mirar.current.lerpVectors(paradas[i].mirar, paradas[i + 1].mirar, f);
    camera.lookAt(mirar.current);
  });
  return null;
}

function Escenario() {
  return (
    <>
      {/* luz de media manana como en la foto de referencia */}
      <ambientLight intensity={0.85} color="#ffe6c4" />
      <hemisphereLight args={[0xffe0b0, 0x2a1a0e, 0.9]} />
      <spotLight position={[7, 8, 5]} angle={0.55} penumbra={0.75} intensity={520} color="#fff1d6" castShadow />
      <spotLight position={[-8, 3, -4]} angle={0.7} penumbra={0.9} intensity={210} color="#e8b06a" />
      <spotLight position={[2, 2, -8]} angle={0.7} penumbra={0.9} intensity={150} color="#7a9a3a" />
      <ContactShadows position={[0, -1.02, 0]} opacity={0.7} scale={16} blur={2.2} far={4} />
      {/* mesa de madera */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} receiveShadow>
        <circleGeometry args={[26, 64]} />
        <meshStandardMaterial color="#3a2416" roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.03, 0]}>
        <ringGeometry args={[3.4, 3.48, 80]} />
        <meshBasicMaterial color="#e8b06a" transparent opacity={0.3} />
      </mesh>
      <GranosDeCafe />
      <Estrellas />
    </>
  );
}

// granos de cafe regados sobre la mesa, como en la foto del cliente
function GranosDeCafe() {
  const granos = useMemo(() => {
    const lista = [];
    let semilla = 7;
    const azar = () => { semilla = (semilla * 16807) % 2147483647; return semilla / 2147483647; };
    for (let i = 0; i < 260; i++) {
      const ang = azar() * Math.PI * 2;
      const radio = 3.6 + azar() * 11;
      lista.push({
        pos: [Math.cos(ang) * radio, -0.97 + azar() * 0.05, Math.sin(ang) * radio],
        rot: [azar() * 3, azar() * 6, azar() * 3],
        esc: 0.11 + azar() * 0.07,
        tono: azar() > 0.5 ? '#4a2c17' : '#33200f',
      });
    }
    return lista;
  }, []);
  return (
    <group>
      {granos.map((g, i) => (
        <mesh key={i} position={g.pos} rotation={g.rot} scale={[g.esc * 1.35, g.esc, g.esc * 0.8]} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={g.tono} roughness={0.55} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

function Estrellas() {
  const geo = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 320; i++) {
      const a = Math.random() * Math.PI * 2, r = 8 + Math.random() * 14;
      pts.push(Math.cos(a) * r, Math.random() * 9 - 0.5, Math.sin(a) * r);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#8890c8" size={0.045} transparent opacity={0.8} />
    </points>
  );
}

function Cargador() {
  const { progress, active } = useProgress();
  const [oculto, setOculto] = useState(false);
  useEffect(() => {
    if (!active && progress >= 100) {
      const t = setTimeout(() => setOculto(true), 500);
      return () => clearTimeout(t);
    }
  }, [active, progress]);
  return (
    <div className={'cargador' + (oculto ? ' fuera' : '')}>
      <div className="barra"><i style={{ width: progress + '%' }} /></div>
      <span>Preparando el producto…</span>
    </div>
  );
}

function PistaScroll() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const alScroll = () => setVisible(false);
    addEventListener('wheel', alScroll, { once: true, passive: true });
    addEventListener('touchmove', alScroll, { once: true, passive: true });
  }, []);
  return (
    <div className="pista-scroll" style={{ opacity: visible ? 1 : 0 }}>
      <span>Desliza</span><i />
    </div>
  );
}

export default function Producto360() {
  const paginas = CONTENIDO.secciones.length;
  return (
    <>
      <div className="marca-banda" />
      <nav className="pd-nav">
        <div className="nav-izq">
          <div className="logo">
            {CONTENIDO.marca.logo ? <img src={BASE + CONTENIDO.marca.logo} alt="" /> : null}
            {CONTENIDO.marca.nombre} <span>{CONTENIDO.marca.acento}</span>
          </div>
        </div>
        <div className="handle">{CONTENIDO.marca.instagram}</div>
      </nav>
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 42, position: CONTENIDO.secciones[0].camara.pos }}
        gl={{ antialias: true }}
        style={{ position: 'fixed', inset: 0 }}
      >
        <color attach="background" args={['#1c1108']} />
        <fog attach="fog" args={['#120b06', 16, 34]} />
        <Suspense fallback={null}>
          <ScrollControls pages={paginas} damping={0.22}>
            <Producto />
            <CamaraRecorrido />
            <Escenario />
            <Scroll html style={{ width: '100%' }}>
              {CONTENIDO.secciones.map((s, i) => (
                <section className={'seccion ' + (s.lado || 'centro')} key={i}>
                  {s.foto && (
                    <div className="foto-fondo" style={{ backgroundImage: `url(${BASE + s.foto})` }} />
                  )}
                  <div className="eyebrow">{s.eyebrow}</div>
                  <h2>{s.titulo}</h2>
                  <p>{s.texto}</p>
                  {s.cta && (
                    <div className={'cta-pill' + (i === paginas - 1 ? ' primario' : '')}>{s.cta}</div>
                  )}
                </section>
              ))}
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
      <Cargador />
      <PistaScroll />
    </>
  );
}

useGLTF.preload(BASE + CONTENIDO.producto.glb, BASE + 'draco/');
