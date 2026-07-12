import HomeBackground from './HomeBackground';
import HomeMemorySignal from './HomeMemorySignal';
import HomePrimaryAction from './HomePrimaryAction';
import HomeSectorLinks from './HomeSectorLinks';
import HomeSystemStatus from './HomeSystemStatus';
import SynthomaWordmark from '../synthoma/SynthomaWordmark';

export default function SynthomaHome() {
  return (
    <main className="synthoma-home" aria-labelledby="synthoma-home-title">
      <HomeBackground />
      <div className="synthoma-home__grid synthoma-local-scrim">
        <HomeSystemStatus />
        <section className="synthoma-home__primary">
          <SynthomaWordmark id="synthoma-home-title" context="home" className="synthoma-home__brand" />
          <p className="synthoma-home__designation">OS // BLACK MEMORY INTERFACE</p>
          <p className="synthoma-home__statement">Rozbitý terapeutický systém, který si pamatuje víc, než by měl. Vyber další stopu. Systém už si vybral tebe.</p>
          <HomePrimaryAction />
        </section>
        <HomeSectorLinks />
        <HomeMemorySignal />
      </div>
    </main>
  );
}
