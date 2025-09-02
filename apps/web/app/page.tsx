"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./menu.module.css";
import { attachGlitchHeading } from "../src/lib/glitchHeading";

const TITLE = "SYNTHOMA";

export default function HomePage() {
  const router = useRouter();
  const glitchRootRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    // First visit redirect to cinematic landing
    try {
      const first = localStorage.getItem("visited_once");
      if (!first) {
        localStorage.setItem("visited_once", "1");
        router.push("/landing-intro");
      }
    } catch {}
  }, [router]);

  // Aktivuj glitch efekt 1:1 jako na landing-intro
  useEffect(() => {
    const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const root = glitchRootRef.current as HTMLElement | null;
    if (!root) return;
    const detach = attachGlitchHeading(root, TITLE, { intervalMs: 260, chance: 0.08 });
    return () => { try { detach && detach(); } catch {} };
  }, []);

  return (
    <main className={styles.home} role="main" aria-label="Hlavní menu">
      {/* Nadpis musí být mimo panel sekci, 1:1 jako na landing-intro */}
      <h1 id="glitch-synthoma" className={`glitch-master`} ref={glitchRootRef as any} aria-label={TITLE}>
        <span className="glitch-fake1">{TITLE}</span>
        <span className="glitch-fake2">{TITLE}</span>
        <span className="glitch-real" aria-hidden="true">
          {TITLE.split("").map((ch, idx) => (
            <span key={idx} className="glitch-char">{ch}</span>
          ))}
        </span>
        <span className="sr-only">{TITLE}</span>
      </h1>
      <section className={`${styles.menu} panel ${styles.menuOffset}`} aria-label="Menu">
        <nav aria-label="Primární navigace">
          <ul className={styles.menuList}>
            <li>
              <article className={styles.card}>
              <Link className={styles.cardLink} href="/landing-intro">
                  <h2 className={styles.cardTitle}>Intro</h2>
                  <p className={styles.cardTeaser}>Vstupní manifest a glitch show. 🎬</p>
                </Link>
              </article>
            </li>
            <li>
              <article className={styles.card}>
              <Link className={styles.cardLink} href="/books">
                  <h2 className={styles.cardTitle}>Knihovna</h2>
                  <p className={styles.cardTeaser}>Zkratka do knihovny. 🚪</p>
                </Link>
              </article>
            </li>
            <li>
              <article className={styles.card}>
              <Link className={styles.cardLink} href="/archive">
                  <h2 className={styles.cardTitle}>Archiv</h2>
                  <p className={styles.cardTeaser}>Lore, pojmy, frakce. 🧠</p>
                </Link>
              </article>
            </li>
            <li>
              <article className={styles.card}>
                <Link className={styles.cardLink} href="/autor">
                  <h2 className={styles.cardTitle}>Autor</h2>
                  <p className={styles.cardTeaser}>Kdo to celé spáchal a proč. ✍️</p>
                </Link>
              </article>
            </li>
          </ul>
        </nav>
      </section>
    </main>
  );
}
