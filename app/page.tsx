"use client";

import { useEffect, useRef, useState } from "react";

const signals = [
  {
    title: "AWAKENING / SIGNAL 01",
    date: "2026 08.19",
    image: "/assets/idoi/portrait-signal-a.png",
    tags: ["virtual idol", "light fiber", "real-time persona"],
  },
  {
    title: "PULSE / SILVER SKIN",
    date: "2026 07.07",
    image: "/assets/idoi/visual-pulse.jpg",
    tags: ["visual film", "chromatic", "digital human"],
  },
  {
    title: "ECHO / LIVE FRAME",
    date: "2026 05.20",
    image: "/assets/idoi/visual-echo.jpg",
    tags: ["performance", "live signal", "mirage"],
  },
];

const liveSignals = [
  {
    code: "LIVE_01",
    title: "MIRAGE MODE",
    image: "/assets/idoi/portrait-signal-b.png",
    cn: "实时捕捉情绪、声音与光，让每一次线上相遇都成为只发生一次的数字演出。",
    en: "A real-time virtual performance where emotion, voice and refracted light become one signal.",
  },
  {
    code: "LIVE_02",
    title: "FROST FREQUENCY",
    image: "/assets/idoi/visual-frost.jpg",
    cn: "冷光、纤维与未来声场共同构成 IDOI 的舞台语言，在现实与虚拟之间持续闪烁。",
    en: "Cold light, fiber optics and future sound define the visual language of IDOI.",
  },
];

const archive = [
  ["ZERO", "/assets/idoi/visual-zero.jpg"],
  ["SIGNAL", "/assets/idoi/visual-signal.jpg"],
  ["PULSE", "/assets/idoi/visual-pulse.jpg"],
  ["AXIS", "/assets/idoi/visual-axis.jpg"],
  ["NEXT", "/assets/idoi/visual-next.jpg"],
  ["ORBIT", "/assets/idoi/visual-orbit.jpg"],
  ["FROST", "/assets/idoi/visual-frost.jpg"],
  ["ECHO", "/assets/idoi/visual-echo.jpg"],
  ["MASTER", "/assets/idoi/artifact-master.jpg"],
  ["INSPIRATION", "/assets/idoi/artifact-inspiration.jpg"],
  ["IDENTITY / D", "/assets/idoi/symbol-d.png"],
  ["SIGNAL / A", "/assets/idoi/portrait-signal-a.png"],
  ["SIGNAL / B", "/assets/idoi/portrait-signal-b.png"],
] as const;

export default function Home() {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const bubbleLayerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [fxOn, setFxOn] = useState(true);
  const [activeSignal, setActiveSignal] = useState(0);
  const [activeLive, setActiveLive] = useState(0);
  const [activeSection, setActiveSection] = useState("TOP");

  const selectSignal = (index: number) => {
    setActiveSignal((index + signals.length) % signals.length);
  };

  useEffect(() => {
    document.documentElement.dataset.idoiReact = "ready";
    return () => {
      delete document.documentElement.dataset.idoiReact;
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    let frame = 0;
    let cleanup = () => {};

    async function mountScene() {
      const THREE = await import("three");
      const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { ShaderPass }, { RGBShiftShader }] = await Promise.all([
        import("three/examples/jsm/postprocessing/EffectComposer.js"),
        import("three/examples/jsm/postprocessing/RenderPass.js"),
        import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
        import("three/examples/jsm/postprocessing/ShaderPass.js"),
        import("three/examples/jsm/shaders/RGBShiftShader.js"),
      ]);
      const host = canvasHostRef.current;
      if (!host || disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-label", "Interactive crystal D emblem");
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 9.4);

      const composer = new EffectComposer(renderer);
      composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      composer.setSize(host.clientWidth, host.clientHeight);
      const renderPass = new RenderPass(scene, camera);
      renderPass.clearAlpha = 0;
      composer.addPass(renderPass);
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(host.clientWidth, host.clientHeight), 0.78, 0.42, 0.74);
      composer.addPass(bloomPass);
      const rgbShiftPass = new ShaderPass(RGBShiftShader);
      rgbShiftPass.uniforms.amount.value = 0.00175;
      rgbShiftPass.uniforms.angle.value = 0.42;
      composer.addPass(rgbShiftPass);

      const environment = new THREE.CubeTextureLoader()
        .setPath("/assets/envmap/")
        .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
      environment.colorSpace = THREE.SRGBColorSpace;
      scene.environment = environment;

      const heroTexture = new THREE.TextureLoader().load("/assets/idoi/hero-bg.png");
      heroTexture.colorSpace = THREE.SRGBColorSpace;
      const backdrop = new THREE.Mesh(
        new THREE.PlaneGeometry(18.2, 10.2),
        new THREE.MeshBasicMaterial({ map: heroTexture, transparent: true, opacity: 0.34, toneMapped: false }),
      );
      backdrop.position.z = -3.4;
      scene.add(backdrop);

      const logoRoot = new THREE.Group();
      logoRoot.scale.setScalar(1.25);
      logoRoot.rotation.x = -0.055;
      scene.add(logoRoot);

      const dShape = new THREE.Shape();
      dShape.moveTo(-1.18, -2.02);
      dShape.lineTo(-1.18, 2.02);
      dShape.lineTo(-0.25, 2.02);
      dShape.bezierCurveTo(1.52, 2.02, 2.3, 1.08, 2.3, 0);
      dShape.bezierCurveTo(2.3, -1.08, 1.52, -2.02, -0.25, -2.02);
      dShape.closePath();

      const counter = new THREE.Path();
      counter.moveTo(-0.7, -1.06);
      counter.lineTo(0.18, -1.01);
      counter.bezierCurveTo(1.02, -1.01, 1.35, -0.54, 1.35, 0);
      counter.bezierCurveTo(1.35, 0.54, 1.02, 1.01, 0.18, 1.01);
      counter.lineTo(-0.7, 1.06);
      counter.closePath();
      dShape.holes.push(counter);

      const dGeometry = new THREE.ExtrudeGeometry(dShape, {
        depth: 0.88,
        steps: 1,
        curveSegments: 48,
        bevelEnabled: true,
        bevelThickness: 0.18,
        bevelSize: 0.15,
        bevelOffset: -0.025,
        bevelSegments: 10,
      });
      dGeometry.center();
      dGeometry.computeVertexNormals();

      const glass = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f4fbff"),
        envMap: environment,
        roughness: 0.006,
        metalness: 0,
        transmission: 0.985,
        thickness: 1.08,
        ior: 1.68,
        dispersion: 1,
        attenuationColor: new THREE.Color("#dff6ff"),
        attenuationDistance: 10,
        clearcoat: 1,
        clearcoatRoughness: 0.001,
        iridescence: 0.72,
        iridescenceIOR: 1.52,
        iridescenceThicknessRange: [90, 650],
        envMapIntensity: 7.4,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const dMesh = new THREE.Mesh(dGeometry, glass);
      logoRoot.add(dMesh);

      const innerGlow = new THREE.Mesh(
        dGeometry.clone(),
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#cdeeff"),
          roughness: 0.01,
          transmission: 0.92,
          transparent: true,
          opacity: 0.12,
          envMap: environment,
          envMapIntensity: 6.2,
          iridescence: 0.75,
          iridescenceIOR: 1.55,
          iridescenceThicknessRange: [80, 720],
          depthWrite: false,
          side: THREE.BackSide,
        }),
      );
      innerGlow.scale.set(0.972, 0.972, 0.9);
      logoRoot.add(innerGlow);

      const edgeGeometry = new THREE.EdgesGeometry(dGeometry, 19);
      const whiteEdge = new THREE.LineSegments(
        edgeGeometry,
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.94, blending: THREE.AdditiveBlending }),
      );
      logoRoot.add(whiteEdge);

      const redEdgeMaterial = new THREE.LineBasicMaterial({ color: 0xff2d8a, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
      const greenEdgeMaterial = new THREE.LineBasicMaterial({ color: 0xb8ff2f, transparent: true, opacity: 0.48, blending: THREE.AdditiveBlending });
      const blueEdgeMaterial = new THREE.LineBasicMaterial({ color: 0x2075ff, transparent: true, opacity: 0.66, blending: THREE.AdditiveBlending });
      const redEdge = new THREE.LineSegments(edgeGeometry, redEdgeMaterial);
      const greenEdge = new THREE.LineSegments(edgeGeometry, greenEdgeMaterial);
      const blueEdge = new THREE.LineSegments(edgeGeometry, blueEdgeMaterial);
      redEdge.position.set(0.025, -0.008, -0.02);
      greenEdge.position.set(-0.018, 0.018, 0.01);
      blueEdge.position.set(-0.012, -0.015, 0.028);
      logoRoot.add(redEdge, greenEdge, blueEdge);

      let particleSeed = 2719;
      const random = () => {
        particleSeed = (particleSeed * 16807) % 2147483647;
        return (particleSeed - 1) / 2147483646;
      };
      const particlePositions: number[] = [];
      const particleColors: number[] = [];
      for (let attempts = 0; attempts < 3800 && particlePositions.length < 600; attempts += 1) {
        const y = random() * 3.74 - 1.87;
        const x = random() * 3.32 - 1.1;
        const outerRight = -0.08 + 2.25 * Math.sqrt(Math.max(0, 1 - (y / 2.02) ** 2));
        const insideOuter = x <= outerRight;
        const innerRight = 0.12 + 1.25 * Math.sqrt(Math.max(0, 1 - (y / 1.05) ** 2));
        const insideCounter = Math.abs(y) < 1.05 && x > -0.7 && x < innerRight;
        if (insideOuter && !insideCounter) {
          particlePositions.push(x, y, random() * 0.64 - 0.32);
          const particleColor = new THREE.Color().setHSL(random(), 1, 0.64 + random() * 0.22);
          particleColors.push(particleColor.r, particleColor.g, particleColor.b);
        }
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
      particleGeometry.setAttribute("color", new THREE.Float32BufferAttribute(particleColors, 3));
      const sparkles = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
          vertexColors: true,
          size: 0.014,
          transparent: true,
          opacity: 0.42,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        }),
      );
      logoRoot.add(sparkles);

      const whiteKey = new THREE.PointLight(0xffffff, 46, 20);
      whiteKey.position.set(-4.3, 1.3, 4.6);
      const topHighlight = new THREE.PointLight(0xffffff, 72, 16);
      topHighlight.position.set(0, 4.5, 2.7);
      const magentaLight = new THREE.PointLight(0xff218e, 22, 14);
      magentaLight.position.set(-2.8, -1.2, 2.4);
      const acidLight = new THREE.PointLight(0xc6ff2f, 14, 13);
      acidLight.position.set(2.7, -0.7, 2.1);
      const blueLight = new THREE.PointLight(0x2575ff, 24, 13);
      blueLight.position.set(0.7, 2.5, 2.6);
      scene.add(whiteKey, topHighlight, magentaLight, acidLight, blueLight, new THREE.AmbientLight(0xdde5ff, 0.11));
      setReady(true);

      const pointer = new THREE.Vector2();
      const pointerTarget = new THREE.Vector2();
      const onPointerMove = (event: PointerEvent) => {
        pointerTarget.set((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY / window.innerHeight) * 2 - 1));
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      const onResize = () => {
        renderer.setSize(host.clientWidth, host.clientHeight);
        composer.setSize(host.clientWidth, host.clientHeight);
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      const startedAt = performance.now();
      const render = () => {
        const t = (performance.now() - startedAt) / 1000;
        pointer.lerp(pointerTarget, 0.055);
        logoRoot.rotation.x += (-0.055 + pointer.y * 0.11 - logoRoot.rotation.x) * 0.035;
        logoRoot.rotation.y += (Math.sin(t * 0.17) * 0.07 + pointer.x * 0.18 - logoRoot.rotation.y) * 0.04;
        logoRoot.position.y = -0.22 + Math.sin(t * 0.48) * 0.04;
        sparkles.rotation.z = Math.sin(t * 0.16) * 0.018;
        redEdgeMaterial.opacity = 0.52 + (Math.sin(t * 0.77) + 1) * 0.09;
        greenEdgeMaterial.opacity = 0.42 + (Math.sin(t * 0.69 + 2) + 1) * 0.07;
        blueEdgeMaterial.opacity = 0.55 + (Math.sin(t * 0.84 + 4) + 1) * 0.09;
        magentaLight.intensity = 19 + Math.sin(t * 0.72) * 5;
        acidLight.intensity = 13 + Math.sin(t * 0.61 + 1.4) * 4;
        blueLight.intensity = 21 + Math.sin(t * 0.83 + 2.1) * 5;
        rgbShiftPass.uniforms.amount.value = 0.0015 + (Math.sin(t * 0.47) + 1) * 0.00028;
        composer.render();
        frame = requestAnimationFrame(render);
      };
      render();

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", onResize);
        scene.traverse((object) => {
          const renderable = object as THREE.Mesh;
          renderable.geometry?.dispose?.();
          const materials = Array.isArray(renderable.material) ? renderable.material : renderable.material ? [renderable.material] : [];
          materials.forEach((material) => material.dispose());
        });
        composer.dispose();
        renderer.dispose();
        environment.dispose();
        heroTexture.dispose();
        renderer.domElement.remove();
      };
    }

    mountScene().catch((error) => {
      if (!disposed) {
        setReady(false);
        console.error("IDOI crystal model could not start; using the image fallback.", error);
      }
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  useEffect(() => {
    const layer = bubbleLayerRef.current;
    if (!layer) return;
    const bubbles = [...layer.querySelectorAll<HTMLElement>(".hero-bubble")];
    const motion = bubbles.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    const pointer = { x: -9999, y: -9999 };
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    const tick = () => {
      const layerRect = layer.getBoundingClientRect();
      bubbles.forEach((bubble, index) => {
        const item = motion[index];
        const centerX = layerRect.left + bubble.offsetLeft + bubble.offsetWidth / 2 + item.x;
        const centerY = layerRect.top + bubble.offsetTop + bubble.offsetHeight / 2 + item.y;
        const dx = centerX - pointer.x;
        const dy = centerY - pointer.y;
        const distance = Math.hypot(dx, dy);
        let targetX = 0;
        let targetY = 0;
        if (distance < 240) {
          const force = (1 - distance / 240) * (92 + index * 3);
          const safeDistance = Math.max(distance, 1);
          targetX = (dx / safeDistance) * force;
          targetY = (dy / safeDistance) * force;
        }
        item.vx += (targetX - item.x) * 0.065;
        item.vy += (targetY - item.y) * 0.065;
        item.vx *= 0.83;
        item.vy *= 0.83;
        item.x += item.vx;
        item.y += item.vy;
        bubble.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
      });
      frame = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  useEffect(() => {
    const labels: Record<string, string> = {
      top: "TOP",
      signals: "SIGNAL",
      profile: "PROFILE",
      manifest: "MANIFEST",
      live: "LIVE",
      archive: "ARCHIVE",
      contact: "END",
    };
    const sections = [...document.querySelectorAll<HTMLElement>("[data-section]")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(labels[visible.target.id] || visible.target.id.toUpperCase());
      },
      { threshold: [0.28, 0.5, 0.72] },
    );
    sections.forEach((section) => observer.observe(section));

    const onScroll = () => {
      const signalSection = document.getElementById("signals");
      const liveSection = document.getElementById("live");
      if (signalSection) {
        const rect = signalSection.getBoundingClientRect();
        const progress = Math.max(0, Math.min(0.999, -rect.top / Math.max(1, rect.height - window.innerHeight)));
        setActiveSignal(Math.min(signals.length - 1, Math.floor(progress * signals.length)));
      }
      if (liveSection) {
        const rect = liveSection.getBoundingClientRect();
        const progress = Math.max(0, Math.min(0.999, -rect.top / Math.max(1, rect.height - window.innerHeight)));
        setActiveLive(Math.min(liveSignals.length - 1, Math.floor(progress * liveSignals.length)));
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
    <main className={`site-shell ${fxOn ? "" : "fx-off"}`}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="IDOI home">IDOI</a>
        <nav className="main-nav" aria-label="Primary navigation">
          <a href="#signals">Signal</a>
          <a href="#profile">Profile</a>
          <a href="#live">Live</a>
          <a href="#archive">Archive</a>
        </nav>
        <a className="contact-pill" href="#contact">Enter the signal</a>
        <button className="fx-toggle" type="button" aria-label="Toggle visual effects" aria-pressed={fxOn} onClick={() => setFxOn((value) => !value)}>
          FX {fxOn ? "ON" : "OFF"}
        </button>
      </header>

      <aside className="section-rail" aria-hidden="true">
        <span>{activeSection}</span>
        <i /><i /><i /><i /><i /><i /><i /><i /><i />
      </aside>

      <section className="hero" id="top" data-section aria-label="IDOI virtual idol home">
        <div className="hero-image-bg" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div ref={bubbleLayerRef} className="hero-bubbles" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => <i className="hero-bubble" key={index} />)}
        </div>
        <div className="hero-word" aria-hidden="true">IDOI</div>
        <img
          className={`hero-d-fallback ${ready ? "is-model-ready" : ""}`}
          src="/assets/idoi/symbol-d.png"
          alt=""
          aria-hidden="true"
        />
        <div ref={canvasHostRef} className={`hero-canvas ${ready ? "is-ready" : ""}`} aria-label="Interactive transparent crystal letter D" />

        <div className="hero-kicker">
          <span>VIRTUAL IDOL / SIGNAL 01</span>
          <b>Born in light.<br />Alive in your frequency.</b>
        </div>

        <div className="news-panel" id="news">
          <span className="eyebrow">CURRENT SIGNAL</span>
          <p><time>2026 08.19</time>IDOI SIGNAL_01 正式上线</p>
          <p><time>2026 07.07</time>虚拟演出协议「MIRAGE」公开</p>
          <p><time>2026 05.20</time>视觉档案 ZERO—PULSE 释出</p>
        </div>

        <div className="debug-panel material-panel" aria-hidden="true">
          <b>IDOI Optical Core</b><span>transmission <i style={{ width: "98.5%" }} /> 0.985</span><span>dispersion <i style={{ width: "100%" }} /> RGB</span><span>frequency <em /> 08.19</span>
        </div>
        <div className="debug-panel quaternion-panel" aria-hidden="true">
          <b>Signal Vector / D</b><span className="quat-values">● &nbsp; .00&nbsp; .00&nbsp; .00&nbsp; 1.0</span><div className="quat-orbit"><i>X</i><i>Y</i><i>Z</i></div><button type="button" tabIndex={-1}>Tracking Active</button>
        </div>
      </section>

      <section className="signals-section dark-grid" id="signals" data-section aria-labelledby="signals-heading">
        <div className="signals-sticky">
          <div className="signals-word" aria-hidden="true">SIGNAL</div>
          <div className="signals-stage">
            {signals.map((signal, index) => (
              <article className={`signal-card ${activeSignal === index ? "is-active" : ""}`} key={signal.title} aria-hidden={activeSignal !== index}>
                <button
                  className="signal-image-button"
                  type="button"
                  data-signal-next
                  tabIndex={activeSignal === index ? 0 : -1}
                  aria-label={`查看下一张：${signals[(index + 1) % signals.length].title}`}
                  onClick={() => selectSignal(index + 1)}
                >
                  <img src={signal.image} alt={signal.title} />
                  <span>CLICK / NEXT</span>
                </button>
                <div className="signal-copy">
                  <time>{signal.date}</time>
                  <h2 id={index === 0 ? "signals-heading" : undefined}>{signal.title}</h2>
                  <p>IDOI / VISUAL TRANSMISSION {String(index + 1).padStart(2, "0")}</p>
                  <ul>{signal.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </div>
              </article>
            ))}
            <a className="more-signals" href="#archive">Open Archive ↗</a>
          </div>
          <div className="signal-controls" aria-label="轮播控制">
            <button className="signal-prev" type="button" aria-label="上一张" onClick={() => selectSignal(activeSignal - 1)}>←</button>
            <output aria-live="polite">{String(activeSignal + 1).padStart(2, "0")} / {String(signals.length).padStart(2, "0")}</output>
            <button className="signal-next" type="button" aria-label="下一张" onClick={() => selectSignal(activeSignal + 1)}>→</button>
          </div>
          <div className="signal-dots" aria-label="选择轮播图片">
            {signals.map((signal, index) => (
              <button
                type="button"
                className={activeSignal === index ? "is-active" : ""}
                key={signal.title}
                data-signal-index={index}
                aria-label={`切换到 ${signal.title}`}
                aria-current={activeSignal === index ? "true" : undefined}
                onClick={() => selectSignal(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="profile-section ice-grid" id="profile" data-section aria-labelledby="profile-heading">
        <div className="profile-image-wrap">
          <img src="/assets/idoi/portrait-signal-a.png" alt="IDOI with luminous fiber-optic hair" />
          <span>SUBJECT / IDOI_01</span>
        </div>
        <div className="profile-copy">
          <span className="section-index">PROFILE / 01</span>
          <h2 id="profile-heading">我存在于<br />信号与情绪之间。</h2>
          <p>IDOI 是诞生于折射光、实时声音与数字记忆中的虚拟偶像。她没有固定的边界；每一次观看、每一次互动，都会让她的形态发生细微变化。</p>
          <p className="profile-en">IDOI is a virtual idol born from refracted light, real-time sound and shared digital memory.</p>
          <dl>
            <div><dt>FORM</dt><dd>OPTICAL HUMAN</dd></div>
            <div><dt>VOICE</dt><dd>SYNTHETIC / LIVE</dd></div>
            <div><dt>STATUS</dt><dd>TRANSMITTING</dd></div>
          </dl>
        </div>
        <div className="profile-mark" aria-hidden="true">D</div>
      </section>

      <section className="manifest-section dark-grid" id="manifest" data-section aria-labelledby="manifest-heading">
        <img className="manifest-portrait" src="/assets/idoi/portrait-signal-b.png" alt="IDOI reaching toward the viewer" />
        <div className="manifest-shade" />
        <div className="manifest-copy">
          <span className="section-index">MANIFEST / 02</span>
          <h2 id="manifest-heading"><span>FEEL THE LIGHT.</span><span>FOLLOW THE SIGNAL.</span></h2>
          <p>虚拟不意味着遥远。IDOI 用光作为皮肤、以声音作为呼吸，在屏幕的另一端与你建立真实连接。</p>
        </div>
        <div className="manifest-orbit" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <section className="live-section dark-grid" id="live" data-section aria-labelledby="live-heading">
        <div className="live-sticky">
          {liveSignals.map((signal, index) => (
            <article className={`live-slide ${activeLive === index ? "is-active" : ""}`} key={signal.title}>
              <img src={signal.image} alt={signal.title} />
              <div className="live-vignette" />
              <div className="live-copy">
                <span>{signal.code}</span>
                <h2 id={index === 0 ? "live-heading" : undefined}>{signal.title}</h2>
                <p>{signal.cn}</p>
                <p className="live-en">{signal.en}</p>
              </div>
              <div className="live-counter">0{index + 1} / 0{liveSignals.length}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="archive-section" id="archive" data-section aria-labelledby="archive-heading">
        <header className="archive-heading">
          <span className="section-index">VISUAL DATABASE / 03</span>
          <h2 id="archive-heading">IDOI ARCHIVE</h2>
          <p>Fragments of a virtual existence.<br />持续更新中的视觉、造型与演出切片。</p>
        </header>
        <div className="archive-grid">
          {archive.map(([title, image], index) => (
            <figure className={`archive-card archive-card-${(index % 5) + 1}`} key={`${title}-${image}`}>
              <img src={image} alt={`${title} visual from the IDOI archive`} loading="lazy" />
              <figcaption><span>{String(index + 1).padStart(2, "0")}</span><b>{title}</b><i>↗</i></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="outro" id="contact" data-section aria-label="Contact IDOI">
        <div className="outro-glow" />
        <div className="outro-word" aria-hidden="true">IDOI</div>
        <p className="outro-call">NEXT TRANSMISSION<br />COMING SOON</p>
        <footer>
          <nav aria-label="Footer navigation"><a href="#top">Top</a><a href="#signals">Signal</a><a href="#profile">Profile</a><a href="#live">Live</a><a href="#archive">Archive</a></nav>
          <div className="footer-links"><b>Follow the signal</b><span>X / YouTube</span><span>TikTok / Bilibili</span><span>Weibo / RED</span></div>
          <div className="footer-contact"><span>Collaboration ↗</span><span>Fan Contact ↗</span><small>Privacy&nbsp;&nbsp; Credits</small></div>
          <strong>©2026 IDOI</strong>
        </footer>
      </section>
    </main>
  );
}
