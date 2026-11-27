import { useEffect, useRef, useState } from "react";

// Avatar 3D hecho con Three.js a partir de formas simples (no carga modelos externos).
// Cada zona del cuerpo de METADATOS es un punto que se puede tocar.

export type Marca = "dom" | "base" | "ambas";

type Props = {
  /** Zona elegida para buscar (se ilumina en naranja y late). */
  seleccion?: string | null | undefined;
  /** Zonas de una seña: mano principal (naranja), de apoyo (azul) o ambas. */
  marcas?: Record<string, Marca> | undefined;
  /** Zonas que existen en los datos; las demás se ven apagadas. */
  disponibles?: string[] | undefined;
  onSelect?: ((zona: string) => void) | undefined;
  className?: string;
};

// [zona, x, y, z, radio] — y hacia arriba, z hacia el frente. Las zonas con lado se repiten.
const ZONAS: [string, number, number, number, number][] = [
  ["Cabeza", 0, 4.18, 0.05, 0.11],
  ["Frente", 0, 3.95, 0.43, 0.085],
  ["Ceja", 0.17, 3.83, 0.45, 0.045],
  ["Ceja", -0.17, 3.83, 0.45, 0.045],
  ["Sien", 0.44, 3.8, 0.22, 0.06],
  ["Sien", -0.44, 3.8, 0.22, 0.06],
  ["Ojo", 0.17, 3.72, 0.46, 0.05],
  ["Ojo", -0.17, 3.72, 0.46, 0.05],
  ["Oreja", 0.53, 3.62, 0, 0.07],
  ["Oreja", -0.53, 3.62, 0, 0.07],
  ["Nariz", 0, 3.58, 0.55, 0.055],
  ["Mejilla", 0.3, 3.5, 0.41, 0.065],
  ["Mejilla", -0.3, 3.5, 0.41, 0.065],
  ["Boca", 0, 3.38, 0.47, 0.06],
  ["Barbilla", 0, 3.19, 0.38, 0.06],
  ["Cuello", 0, 3.06, 0.2, 0.07],
  ["Hombro", 0.74, 2.9, 0.12, 0.09],
  ["Hombro", -0.74, 2.9, 0.12, 0.09],
  ["Pecho", 0, 2.62, 0.4, 0.11],
  ["Plexo", 0, 2.3, 0.38, 0.075],
  ["Abdomen", 0, 2.06, 0.36, 0.09],
  ["Cintura", 0, 1.84, 0.35, 0.08],
  ["Cadera", 0.4, 1.72, 0.27, 0.075],
  ["Cadera", -0.4, 1.72, 0.27, 0.075],
  ["Espalda", 0, 2.5, -0.4, 0.1],
  ["Brazo", 0.93, 2.45, 0.08, 0.075],
  ["Brazo", -0.93, 2.45, 0.08, 0.075],
  ["Muñeca", 1.07, 1.8, 0.09, 0.06],
  ["Muñeca", -1.07, 1.8, 0.09, 0.06],
  ["Mano", 1.12, 1.56, 0.12, 0.08],
  ["Mano", -1.12, 1.56, 0.12, 0.08],
];
export const NOMBRES_ZONAS = [...new Set(ZONAS.map((z) => z[0])), "Cara"];

const NARANJA = 0xf28a3c;
const AZUL = 0x3b82f6;

export function Avatar3D({ seleccion = null, marcas, disponibles, onSelect, className }: Props) {
  const caja = useRef<HTMLDivElement>(null);
  const estado = useRef({ seleccion, marcas, disponibles, onSelect });
  estado.current = { seleccion, marcas, disponibles, onSelect };
  const [hover, setHover] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    let vivo = true;
    let limpiar = () => {};

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (!vivo) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setError(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
      renderer.domElement.style.touchAction = "none";

      const escena = new THREE.Scene();
      const camara = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camara.position.set(0, 2.9, 7.2);

      escena.add(new THREE.HemisphereLight(0xffffff, 0x1b2547, 1.4));
      const sol = new THREE.DirectionalLight(0xffffff, 2.2);
      sol.position.set(3, 6, 5);
      escena.add(sol);
      const contra = new THREE.DirectionalLight(0x9db8ff, 0.8);
      contra.position.set(-4, 3, -4);
      escena.add(contra);

      const piel = new THREE.MeshStandardMaterial({ color: 0xe2c19c, roughness: 0.62 });
      const ropa = new THREE.MeshStandardMaterial({ color: 0x2f55d4, roughness: 0.75 });
      const pantalon = new THREE.MeshStandardMaterial({ color: 0x1b2547, roughness: 0.8 });
      const pelo = new THREE.MeshStandardMaterial({ color: 0x2a1d16, roughness: 0.9 });
      const ojos = new THREE.MeshStandardMaterial({ color: 0x14213d, roughness: 0.4 });

      const cuerpo = new THREE.Group();
      escena.add(cuerpo);
      const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
      // Cilindro redondeado entre dos puntos (brazos, piernas, cuello).
      const hueso = (
        a: import("three").Vector3,
        b: import("three").Vector3,
        r: number,
        mat: import("three").Material,
      ) => {
        const largo = a.distanceTo(b);
        const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, largo, 8, 16), mat);
        m.position.copy(a).add(b).multiplyScalar(0.5);
        m.quaternion.setFromUnitVectors(v(0, 1, 0), b.clone().sub(a).normalize());
        cuerpo.add(m);
        return m;
      };

      // Cabeza (al tocarla fuera de un punto se elige «Cara»)
      const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.5, 40, 32), piel.clone());
      cabeza.scale.set(1, 1.15, 0.98);
      cabeza.position.set(0, 3.66, 0);
      cabeza.userData["zona"] = "Cara";
      cuerpo.add(cabeza);
      const cabello = new THREE.Mesh(
        new THREE.SphereGeometry(0.53, 40, 32, 0, Math.PI * 2, 0, Math.PI * 0.36),
        pelo,
      );
      cabello.scale.set(1, 1.12, 1);
      cabello.position.set(0, 3.72, -0.04);
      cuerpo.add(cabello);
      for (const x of [-0.17, 0.17]) {
        const o = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), ojos);
        o.position.set(x, 3.72, 0.47);
        cuerpo.add(o);
      }
      hueso(v(0, 3.0, 0), v(0, 3.25, 0), 0.17, piel);
      // Torso y cadera
      const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.95, 10, 24), ropa);
      torso.scale.set(1.32, 1, 0.82);
      torso.position.set(0, 2.42, 0);
      cuerpo.add(torso);
      const cadera = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 16), pantalon);
      cadera.scale.set(1.0, 0.55, 0.7);
      cadera.position.set(0, 1.72, 0);
      cuerpo.add(cadera);
      // Brazos (manga y antebrazo) y manos
      for (const s of [-1, 1]) {
        hueso(v(0.74 * s, 2.92, 0), v(0.97 * s, 2.2, 0.04), 0.14, ropa);
        hueso(v(0.97 * s, 2.2, 0.04), v(1.07 * s, 1.78, 0.08), 0.11, piel);
        const mano = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 16), piel);
        mano.scale.set(0.8, 1.15, 0.6);
        mano.position.set(1.12 * s, 1.56, 0.1);
        cuerpo.add(mano);
        hueso(v(0.24 * s, 1.6, 0), v(0.26 * s, 0.2, 0.02), 0.17, pantalon);
        const zapato = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), ojos);
        zapato.scale.set(1, 0.6, 1.6);
        zapato.position.set(0.26 * s, 0.06, 0.12);
        cuerpo.add(zapato);
      }
      // Sombra en el piso
      const sombra = new THREE.Mesh(
        new THREE.CircleGeometry(1.1, 40),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 }),
      );
      sombra.rotation.x = -Math.PI / 2;
      sombra.position.y = 0.001;
      escena.add(sombra);

      // Puntos de las zonas
      const puntos = ZONAS.map(([zona, x, y, z, r]) => {
        const mat = new THREE.MeshStandardMaterial({
          color: NARANJA,
          emissive: NARANJA,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.55,
          roughness: 0.4,
        });
        const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 16), mat);
        m.position.set(x, y, z);
        m.userData["zona"] = zona;
        cuerpo.add(m);
        return m;
      });

      const controles = new OrbitControls(camara, renderer.domElement);
      controles.target.set(0, 2.55, 0);
      controles.enablePan = false;
      controles.enableDamping = true;
      controles.minDistance = 3.2;
      controles.maxDistance = 9;
      controles.minPolarAngle = Math.PI * 0.25;
      controles.maxPolarAngle = Math.PI * 0.6;
      controles.update();

      const ray = new THREE.Raycaster();
      const puntero = new THREE.Vector2();
      const tocables = [...puntos, cabeza];
      let sobre: string | null = null;
      const zonaEn = (ev: PointerEvent) => {
        const r = renderer.domElement.getBoundingClientRect();
        puntero.set(
          ((ev.clientX - r.left) / r.width) * 2 - 1,
          -((ev.clientY - r.top) / r.height) * 2 + 1,
        );
        ray.setFromCamera(puntero, camara);
        const hit = ray.intersectObjects(tocables, false)[0];
        return (hit?.object.userData["zona"] as string | undefined) ?? null;
      };
      const mover = (ev: PointerEvent) => {
        const z = zonaEn(ev);
        if (z !== sobre) {
          sobre = z;
          setHover(z);
          renderer.domElement.style.cursor = z && estado.current.onSelect ? "pointer" : "grab";
        }
      };
      let inicio = { x: 0, y: 0 };
      const bajar = (ev: PointerEvent) => (inicio = { x: ev.clientX, y: ev.clientY });
      const soltar = (ev: PointerEvent) => {
        if (Math.hypot(ev.clientX - inicio.x, ev.clientY - inicio.y) > 6) return; // fue un giro, no un toque
        const z = zonaEn(ev);
        if (z) estado.current.onSelect?.(z);
      };
      renderer.domElement.addEventListener("pointermove", mover);
      renderer.domElement.addEventListener("pointerdown", bajar);
      renderer.domElement.addEventListener("pointerup", soltar);

      const ajustar = () => {
        const w = el.clientWidth,
          h = el.clientHeight;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        camara.aspect = w / Math.max(h, 1);
        camara.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(ajustar);
      ro.observe(el);
      ajustar();

      const reloj = new THREE.Clock();
      const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let cuadro = 0;
      const pintar = () => {
        cuadro = requestAnimationFrame(pintar);
        const t = reloj.getElapsedTime();
        const { seleccion: sel, marcas: mk, disponibles: disp } = estado.current;
        const latido = quieto ? 1 : 1 + Math.sin(t * 4) * 0.18;
        for (const p of puntos) {
          const z = p.userData["zona"] as string;
          const mat = p.material as import("three").MeshStandardMaterial;
          const marca = mk?.[z];
          const apagado = !mk && disp && !disp.includes(z);
          if (marca) {
            const color = marca === "base" ? AZUL : NARANJA;
            mat.color.setHex(color);
            mat.emissive.setHex(color);
            mat.opacity = 1;
            mat.emissiveIntensity = 0.9;
            p.scale.setScalar(marca === "ambas" ? 1.5 * latido : 1.35 * latido);
          } else if (z === sel) {
            mat.color.setHex(NARANJA);
            mat.emissive.setHex(NARANJA);
            mat.opacity = 1;
            mat.emissiveIntensity = 1.1;
            p.scale.setScalar(1.45 * latido);
          } else {
            mat.color.setHex(NARANJA);
            mat.emissive.setHex(NARANJA);
            mat.opacity = mk ? 0.12 : apagado ? 0.15 : z === sobre ? 0.95 : 0.5;
            mat.emissiveIntensity = z === sobre ? 0.9 : 0.35;
            p.scale.setScalar(z === sobre ? 1.25 : 1);
          }
        }
        const cara = cabeza.material as import("three").MeshStandardMaterial;
        const caraMarca = mk?.["Cara"];
        cara.emissive.setHex(caraMarca === "base" ? AZUL : NARANJA);
        cara.emissiveIntensity =
          caraMarca || sel === "Cara" ? 0.35 * latido : sobre === "Cara" ? 0.15 : 0;
        if (!quieto && !sobre) cuerpo.rotation.y = Math.sin(t * 0.4) * 0.12;
        controles.update();
        renderer.render(escena, camara);
      };
      pintar();

      limpiar = () => {
        cancelAnimationFrame(cuadro);
        ro.disconnect();
        controles.dispose();
        renderer.domElement.removeEventListener("pointermove", mover);
        renderer.domElement.removeEventListener("pointerdown", bajar);
        renderer.domElement.removeEventListener("pointerup", soltar);
        escena.traverse((o) => {
          const m = o as import("three").Mesh;
          m.geometry?.dispose();
          const mat = m.material as import("three").Material | undefined;
          mat?.dispose?.();
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      vivo = false;
      limpiar();
    };
  }, []);

  return (
    <div className={"relative " + (className ?? "")}>
      <div
        ref={caja}
        className="absolute inset-0"
        role="img"
        aria-label="Avatar 3D. Toca una zona del cuerpo o elígela en la lista de abajo."
      />
      {hover && (
        <span className="pointer-events-none absolute left-4 top-4 rounded-md bg-accent px-3 py-1.5 font-display text-sm font-semibold text-accent-foreground shadow-lg">
          {hover}
        </span>
      )}
      {error && (
        <p className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-hero-muted">
          Este navegador no puede mostrar 3D. Usa la lista de zonas.
        </p>
      )}
    </div>
  );
}
