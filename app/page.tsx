"use client";

import { useEffect, useRef, useState } from "react";

const works = [
  {
    title: 'KizunaAI “Hello, Fortnite”',
    date: "2026 01.17",
    image: "/assets/works/kizuna.webp",
    tags: ["In-Game-Concert", "fortnite", "metaverse"],
  },
  {
    title: "WEAR GO LAND",
    date: "2025 05.16",
    image: "/assets/works/third.webp",
    tags: ["fashion", "metaverse", "cloud rendering"],
  },
  {
    title: "DISCOAT 2025SS EXHIBITION in virtual",
    date: "2025 02.20",
    image: "/assets/works/discoat.webp",
    tags: ["stellla", "unreal engine", "metaverse"],
  },
];

const services = [
  {
    title: "Fortnite Creative Works",
    video: "/assets/service/uefn.mp4",
    icon: "/assets/fortnite.png",
    jp: "Fortnite上での体験制作に強みを持ち、エンターテインメント性と拡張性のある空間を企画・制作。ブランドやIP、アーティストの世界観を表現します。",
    en: "We specialize in creating scalable, participatory experiences in Fortnite for audiences around the world.",
  },
  {
    title: "Unreal Engine Works",
    video: "/assets/service/ue.mp4",
    icon: "/assets/ue2.png",
    jp: "クラウドレンダリングから各デバイス向けのコンテンツを制作。ゲームエンジンの可能性を従来の枠組みを超えたエンターテインメント領域に展開します。",
    en: "From cloud rendering to mobile and PC, we create immersive worlds with Unreal Engine.",
  },
];

export default function Home() {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [activeWork, setActiveWork] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [activeSection, setActiveSection] = useState("TOP");

  useEffect(() => {
    let disposed = false;
    let frame = 0;
    let cleanup = () => {};

    async function mountScene() {
      const THREE = await import("three");
      const host = canvasHostRef.current;
      if (!host || disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.domElement.setAttribute("aria-label", "Interactive glass D emblem");
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 9.4);

      const environment = new THREE.CubeTextureLoader()
        .setPath("/assets/envmap/")
        .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
      environment.colorSpace = THREE.SRGBColorSpace;
      scene.environment = environment;

      const logoRoot = new THREE.Group();
      logoRoot.scale.setScalar(1.22);
      logoRoot.rotation.x = -0.055;
      scene.add(logoRoot);

      const dShape = new THREE.Shape();
      dShape.moveTo(-1.48, -2.02);
      dShape.lineTo(-1.48, 2.02);
      dShape.lineTo(-0.18, 2.02);
      dShape.bezierCurveTo(1.62, 2.02, 2.34, 1.08, 2.34, 0);
      dShape.bezierCurveTo(2.34, -1.08, 1.62, -2.02, -0.18, -2.02);
      dShape.closePath();

      const counter = new THREE.Path();
      counter.moveTo(-0.02, -0.98);
      counter.lineTo(0.24, -0.98);
      counter.bezierCurveTo(0.98, -0.98, 1.28, -0.54, 1.28, 0);
      counter.bezierCurveTo(1.28, 0.54, 0.98, 0.98, 0.24, 0.98);
      counter.lineTo(-0.02, 0.98);
      counter.closePath();
      dShape.holes.push(counter);

      const dGeometry = new THREE.ExtrudeGeometry(dShape, {
        depth: 0.82,
        steps: 1,
        curveSegments: 36,
        bevelEnabled: true,
        bevelThickness: 0.17,
        bevelSize: 0.16,
        bevelOffset: -0.035,
        bevelSegments: 8,
      });
      dGeometry.center();
      dGeometry.computeVertexNormals();

      const glass = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#6c4935"),
        envMap: environment,
        roughness: 0.055,
        metalness: 0.06,
        transmission: 0.64,
        thickness: 1.45,
        ior: 1.48,
        dispersion: 0.78,
        attenuationColor: new THREE.Color("#6f3518"),
        attenuationDistance: 2.5,
        clearcoat: 1,
        clearcoatRoughness: 0.025,
        iridescence: 0.18,
        iridescenceIOR: 1.33,
        envMapIntensity: 3.3,
        side: THREE.DoubleSide,
      });
      const dMesh = new THREE.Mesh(dGeometry, glass);
      dMesh.castShadow = true;
      logoRoot.add(dMesh);

      const innerGlow = new THREE.Mesh(
        dGeometry.clone(),
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#b96e35"),
          roughness: 0.18,
          metalness: 0.12,
          transmission: 0.16,
          transparent: true,
          opacity: 0.2,
          envMap: environment,
          envMapIntensity: 1.8,
          side: THREE.BackSide,
        }),
      );
      innerGlow.scale.set(0.965, 0.965, 0.88);
      logoRoot.add(innerGlow);

      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(dGeometry, 21),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.68 }),
      );
      logoRoot.add(edge);

      let particleSeed = 2719;
      const random = () => {
        particleSeed = (particleSeed * 16807) % 2147483647;
        return (particleSeed - 1) / 2147483646;
      };
      const particlePositions: number[] = [];
      for (let attempts = 0; attempts < 4200 && particlePositions.length < 1080; attempts += 1) {
        const y = random() * 3.74 - 1.87;
        const x = random() * 3.58 - 1.35;
        const outerRight = -0.08 + 2.29 * Math.sqrt(Math.max(0, 1 - (y / 2.02) ** 2));
        const insideOuter = x <= outerRight;
        const innerRight = 0.12 + 1.16 * Math.sqrt(Math.max(0, 1 - (y / 0.98) ** 2));
        const insideCounter = Math.abs(y) < 0.98 && x > -0.02 && x < innerRight;
        if (insideOuter && !insideCounter) particlePositions.push(x, y, random() * 0.56 - 0.28);
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
      const sparkles = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
          color: 0xffd4a3,
          size: 0.018,
          transparent: true,
          opacity: 0.78,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        }),
      );
      logoRoot.add(sparkles);

      const whiteKey = new THREE.PointLight(0xd9efff, 22, 20);
      whiteKey.position.set(-4.3, 1.2, 4.6);
      scene.add(whiteKey);
      const amberFill = new THREE.PointLight(0xff7a2d, 34, 16);
      amberFill.position.set(3.2, -1.8, 3.4);
      scene.add(amberFill);
      scene.add(new THREE.AmbientLight(0xffffff, 0.18));
      setReady(true);

      const pointer = new THREE.Vector2();
      const pointerTarget = new THREE.Vector2();
      const onPointerMove = (event: PointerEvent) => {
        pointerTarget.set(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight * 2 - 1));
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      const onResize = () => {
        renderer.setSize(host.clientWidth, host.clientHeight);
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      const animationStartedAt = performance.now();
      const render = () => {
        const t = (performance.now() - animationStartedAt) / 1000;
        pointer.lerp(pointerTarget, 0.055);
        logoRoot.rotation.x += ((-0.055 + pointer.y * 0.11) - logoRoot.rotation.x) * 0.035;
        logoRoot.rotation.y += ((Math.sin(t * 0.17) * 0.07 + pointer.x * 0.18) - logoRoot.rotation.y) * 0.04;
        logoRoot.position.y = -0.26 + Math.sin(t * 0.48) * 0.035;
        sparkles.rotation.z = Math.sin(t * 0.16) * 0.014;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      render();

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", onResize);
        logoRoot.traverse((object) => {
          const renderable = object as THREE.Mesh;
          renderable.geometry?.dispose?.();
          const materials = Array.isArray(renderable.material) ? renderable.material : renderable.material ? [renderable.material] : [];
          materials.forEach((material) => material.dispose());
        });
        renderer.dispose();
        environment.dispose();
        renderer.domElement.remove();
      };
    }

    mountScene();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  useEffect(() => {
    const labels: Record<string, string> = {
      top: "TOP", works: "WORKS", about: "ABOUT", vision: "VISION", service: "SERVICE", stellla: "STELLLA", contact: "END",
    };
    const sections = [...document.querySelectorAll<HTMLElement>("[data-section]")];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(labels[visible.target.id] || visible.target.id.toUpperCase());
    }, { threshold: [0.32, 0.55, 0.75] });
    sections.forEach((section) => observer.observe(section));

    const onScroll = () => {
      const workSection = document.getElementById("works");
      const serviceSection = document.getElementById("service");
      if (workSection) {
        const rect = workSection.getBoundingClientRect();
        const progress = Math.max(0, Math.min(0.999, -rect.top / Math.max(1, rect.height - window.innerHeight)));
        setActiveWork(Math.min(works.length - 1, Math.floor(progress * works.length)));
      }
      if (serviceSection) {
        const rect = serviceSection.getBoundingClientRect();
        const progress = Math.max(0, Math.min(0.999, -rect.top / Math.max(1, rect.height - window.innerHeight)));
        setActiveService(Math.min(services.length - 1, Math.floor(progress * services.length)));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Alche home">ALCHE</a>
        <nav className="main-nav" aria-label="Primary navigation">
          <a href="#news">News</a><a href="#works">Works</a><a href="#about">About</a><a href="#stellla">stellla</a>
        </nav>
        <a className="contact-pill" href="#contact">Contact / Recruit</a>
        <button className="sound" type="button" aria-label="Toggle sound" aria-pressed={soundOn} onClick={() => setSoundOn((value) => !value)}>{soundOn ? "ⅡⅠ" : "Ⅲ"}</button>
      </header>

      <aside className="section-rail" aria-hidden="true">
        <span>{activeSection}</span>
        <i /><i /><i /><i /><i /><i /><i /><i /><i />
      </aside>

      <section className="hero" id="top" data-section aria-label="Alche home">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-blocks" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="hero-word" aria-hidden="true">ALCHE</div>
        <div ref={canvasHostRef} className={`hero-canvas ${ready ? "is-ready" : ""}`} aria-label="Interactive smoky glass letter D" />

        <div className="news-panel" id="news">
          <span className="eyebrow">NEWS</span>
          <p><time>2025 06.26</time>Unreal Fest Bali 2025で登壇しました</p>
          <p><time>2025 05.16</time>次世代ファッションメタバースアプリを開発</p>
          <p><time>2024 10.29</time>クリエイティブチーム「ReIMAGINE」を結成</p>
        </div>

        <div className="debug-panel material-panel" aria-hidden="true">
          <b>D Glass Material</b><span>roughness <i style={{ width: "18%" }} /> 0.055</span><span>transmission <i style={{ width: "64%" }} /> 0.64</span><span>color <em style={{ background: "#6c4935" }} /> {'{r:108, g:73, b:53}'}</span>
        </div>
        <div className="debug-panel quaternion-panel" aria-hidden="true">
          <b>MainLogo Quaternion</b><span className="quat-values">● &nbsp; .00&nbsp; .00&nbsp; .00&nbsp; 1.0</span><div className="quat-orbit"><i>X</i><i>Y</i><i>Z</i></div><button type="button" tabIndex={-1}>Reset Quaternion</button>
        </div>
      </section>

      <section className="works-section dark-grid" id="works" data-section aria-labelledby="works-heading">
        <div className="works-sticky">
          <div className="works-word" aria-hidden="true">WORKS</div>
          <div className="works-card-stage">
            {works.map((work, index) => (
              <article className={`work-card ${activeWork === index ? "is-active" : ""}`} key={work.title} aria-hidden={activeWork !== index}>
                <img src={work.image} alt="" />
                <div className="work-copy">
                  <time>{work.date}</time>
                  <h2 id={index === 0 ? "works-heading" : undefined}>{work.title}</h2>
                  <p>{work.title}</p>
                  <ul>{work.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </div>
              </article>
            ))}
            <a className="more-works" href="#about">More Works ↗</a>
          </div>
          <div className="work-dots" aria-label="Selected work">
            {works.map((work, index) => <button type="button" key={work.title} aria-label={`Show ${work.title}`} aria-pressed={activeWork === index} onClick={() => document.getElementById("works")?.scrollIntoView({ behavior: "smooth", block: "start" })} />)}
          </div>
        </div>
      </section>

      <section className="mission-section light-grid" id="about" data-section aria-labelledby="mission-heading">
        <div className="outline-a" aria-hidden="true"><i /></div>
        <div className="mission-copy">
          <h2 id="mission-heading"><span>これまでにない</span><span>没入型・体験型のエンターテインメントを</span><span>生み出す</span></h2>
          <p>Pioneering immersive<br />and experiential entertainment like no other.</p>
        </div>
      </section>

      <section className="vision-section light-grid" id="vision" data-section aria-labelledby="vision-heading">
        <div className="outline-a" aria-hidden="true"><i /></div>
        <div className="iridescent-slash" aria-hidden="true" />
        <h2 id="vision-heading" className="vision-title">VISION</h2>
        <p className="vision-en">Architect worlds<br />that move hearts and spark hope.</p>
        <p className="vision-jp"><span>心を揺さぶり、希望を持てる</span><span>“世界”を作る</span></p>
        <div className="screen-debug" aria-hidden="true">MainLogo Screen&nbsp;&nbsp; Ⅱ<br /><small>noiseScale ━━━━━━ 1.0</small></div>
      </section>

      <section className="service-section dark-grid" id="service" data-section aria-labelledby="service-heading">
        <div className="service-sticky">
          {services.map((service, index) => (
            <article className={`service-slide ${activeService === index ? "is-active" : ""}`} key={service.title}>
              <video src={service.video} autoPlay loop muted={!soundOn} playsInline preload="metadata" />
              <div className="service-vignette" />
              <div className="service-copy">
                <img src={service.icon} alt="" />
                <h2 id={index === 0 ? "service-heading" : undefined}>{service.title}</h2>
                <p>{service.jp}</p>
                <p className="service-en">{service.en}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="stellla-section" id="stellla" data-section aria-labelledby="stellla-heading">
        <video src="/assets/service/stellla.mp4" autoPlay loop muted={!soundOn} playsInline preload="metadata" />
        <div className="stellla-shade" />
        <div className="stellla-frame"><i /><i /><i /><i /></div>
        <div className="stellla-copy">
          <h2 id="stellla-heading">stellla<span>(↗)</span></h2>
          <p>メタバース構築基盤として、ライブイベント、ファッションショー、<br />そして工場・都市計画など産業系デジタル空間まで幅広く対応。<br />多人数同時接続・アバターカスタマイズなど基本機能を、<br />PC/モバイル/VR向けに提供。</p>
          <p className="stellla-en">A metaverse platform for diverse digital applications from live events to industrial environments.<br />Supports multi-user access, avatars, e-commerce, and 3D audio.</p>
        </div>
      </section>

      <section className="outro" id="contact" data-section aria-label="Contact and footer">
        <div className="outro-glow" />
        <div className="outro-word">ALCHE</div>
        <footer>
          <nav aria-label="Footer navigation"><a href="#top">Top</a><a href="#news">News</a><a href="#works">Works</a><a href="#about">About</a><a href="#stellla">stellla</a><a href="#contact">Contact</a></nav>
          <div className="footer-links"><b>Links ▼</b><span>TECH BLOG</span><span>note</span><span>X&nbsp;&nbsp;YouTube</span></div>
          <div className="footer-contact"><span>Contact ↗</span><span>Recruit ↗</span><small>Privacy Policy&nbsp;&nbsp; License</small></div>
          <strong>©2025 Alche, inc.</strong>
        </footer>
      </section>
    </main>
  );
}
