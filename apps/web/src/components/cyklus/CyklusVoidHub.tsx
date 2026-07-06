'use client';

import { useState, useCallback } from 'react';
import {
  loadSubjectProgression,
  getLoadoutLimits,
  getVoidRoomOverview,
  getProfileProtocolOverview,
  getAvailablePurchases,
  getAvailableCrafts,
  getRecommendedNextProgressionActions,
  getUpgradeStatus,
  upgradeVoidRoom,
  purchaseUpgrade,
  equipUpgrade,
  unequipUpgrade,
  purchaseProtocol,
  equipProtocol,
  unequipProtocol,
  craftRecipe,
  equipArtifact,
  unequipArtifact,
  setActiveScar,
  SUBJECT_UPGRADES,
  SUBJECT_SCARS,
  PROFILE_PROTOCOLS,
  CRAFTED_ARTIFACTS,
  CRAFT_RECIPES,
  VOID_ROOMS,
  CURRENCY_LABELS,
  MATERIAL_LABELS,
  type MetaCurrencyId,
  type CraftMaterialId,
  type SubjectProgression,
  type VoidRoomId,
  type RecipeId,
  type CraftedArtifactId,
} from '../../game/cyklus/cyklusProgression';
import type { ProfileKey } from '../../game/cyklus/cyklusTypes';
import { loadDiscovery } from '../../game/cyklus/cyklusDiscovery';
import { UI_THEMES } from '../../lib/themes';
import {
  loadStoryProgression,
  saveStoryProgression,
  setActiveThread,
  getStoryActTitle,
  getStoryActDescription,
  getAvailableStoryThreads,
  getActiveThreadInfo,
  type StoryProgression,
} from '../../game/cyklus/cyklusStory';

type Tab = 'overview' | 'rooms' | 'protocols' | 'upgrades' | 'pocket' | 'crafting' | 'scars' | 'story' | 'settings';

interface Props {
  onClose?: () => void;
  onStartRun?: () => void;
}

export default function CyklusVoidHub({ onClose, onStartRun }: Props) {
  const [progression, setProgression] = useState(loadSubjectProgression);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [message, setMessage] = useState<string | null>(null);
  const [story, setStory] = useState<StoryProgression>(loadStoryProgression);
  const [currentTheme, setCurrentTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'synthoma'; } catch { return 'synthoma'; }
  });

  const refresh = useCallback(() => {
    setProgression(loadSubjectProgression());
    setStory(loadStoryProgression());
  }, []);

  const showMessage = useCallback((text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const limits = getLoadoutLimits(progression);
  const overview = getProgressionOverview(progression);
  const recommendations = getRecommendedNextProgressionActions(null, progression);
  const discovery = loadDiscovery();

  function renderCurrencyBlock() {
    return (
      <div className="cyklus-void-grid">
        {(Object.entries(CURRENCY_LABELS) as [MetaCurrencyId, string][]).map(([id, label]) => {
          const value = progression.currencies[id] ?? 0;
          if (value === 0) return null;
          return (
            <div key={id} className="cyklus-void-card">
              <div className="cyklus-void-card__title">{label}</div>
              <div className="cyklus-void-card__value">{value}</div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderMaterialBlock() {
    const hasAny = Object.values(progression.craftingInventory).some((v) => v && v > 0);
    if (!hasAny) return null;
    return (
      <div className="cyklus-void-grid">
        {(Object.entries(MATERIAL_LABELS) as [CraftMaterialId, string][]).map(([id, label]) => {
          const value = progression.craftingInventory[id] ?? 0;
          if (value === 0) return null;
          return (
            <div key={id} className="cyklus-void-card">
              <div className="cyklus-void-card__title">{label}</div>
              <div className="cyklus-void-card__value">{value}</div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderOverview() {
    return (
      <div className="cyklus-void-panel">
        <p className="cyklus-void-flavour">
          Prázdnota tvrdí, že je stejná. Lže. V koutě přibyla věc, která si pamatuje tvůj poslední kolaps.
        </p>
        <div className="cyklus-void-section">
          <div className="cyklus-void-section__title">Měny</div>
          {renderCurrencyBlock()}
        </div>
        {renderMaterialBlock() && (
          <div className="cyklus-void-section">
            <div className="cyklus-void-section__title">Suroviny</div>
            {renderMaterialBlock()}
          </div>
        )}
        <div className="cyklus-void-section">
          <div className="cyklus-void-section__title">Subjekt</div>
          <div className="cyklus-void-stats">
            <div className="cyklus-void-stat">Průchodů: {progression.totalRuns}</div>
            <div className="cyklus-void-stat">Stabilizovaných: {progression.stabilizedRuns}</div>
            <div className="cyklus-void-stat">Celkem rezidua: {progression.totalResiduumEarned}</div>
          </div>
        </div>
        <div className="cyklus-void-section">
          <div className="cyklus-void-section__title">Loadout</div>
          <div className="cyklus-void-stats">
            <div className="cyklus-void-stat">Upgrady: {progression.equippedUpgrades.length} / {limits.upgradeSlots}</div>
            <div className="cyklus-void-stat">Artefakty: {progression.equippedArtifacts.length} / {limits.artifactSlots}</div>
            <div className="cyklus-void-stat">Protokoly: {progression.equippedProtocols.length} / {limits.protocolSlots}</div>
            <div className="cyklus-void-stat">Jizva: {progression.activeScar ? SUBJECT_SCARS[progression.activeScar]?.title ?? '?' : 'žádná'}</div>
          </div>
        </div>
        {recommendations.length > 0 && (
          <div className="cyklus-void-section">
            <div className="cyklus-void-section__title">Doporučení</div>
            <ul className="cyklus-void-list">
              {recommendations.map((r, i) => (
                <li key={i} className="cyklus-void-list__item">{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  function renderRooms() {
    const rooms = getVoidRoomOverview(progression);
    return (
      <div className="cyklus-void-panel">
        <div className="cyklus-void-grid">
          {rooms.map((room) => {
            const status = room.status;
            const maxed = status === 'maxed';
            const available = status === 'available';
            const handleUpgrade = () => {
              if (upgradeVoidRoom(room.id as VoidRoomId)) {
                refresh();
                showMessage('Prázdnota změnila tvar. Systém předstírá, že si toho nevšiml.');
              }
            };
            return (
              <div key={room.id} className={`cyklus-void-card ${maxed ? 'cyklus-void-card--maxed' : ''} ${!available && !maxed ? 'cyklus-void-card--locked' : ''}`}>
                <div className="cyklus-void-card__title">{room.title}</div>
                <div className="cyklus-void-card__desc">{room.description}</div>
                <div className="cyklus-void-card__level">Level {room.state.level} / {room.maxLevel}</div>
                {!maxed && (
                  <div className="cyklus-void-cost">
                    {Object.entries(VOID_ROOMS[room.id].costByLevel[room.state.level] ?? {}).map(([k, v]) => {
                      if (!v) return null;
                      return <div key={k}>{CURRENCY_LABELS[k as MetaCurrencyId]}: {v}</div>;
                    })}
                  </div>
                )}
                <div className="cyklus-void-actions">
                  {maxed ? (
                    <button className="cyklus-void-button cyklus-void-button--disabled" disabled>MAX</button>
                  ) : available ? (
                    <button className="cyklus-void-button" onClick={handleUpgrade}>VYLEPŠIT</button>
                  ) : (
                    <button className="cyklus-void-button cyklus-void-button--disabled" disabled>NEDOSTATEK</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderProtocols() {
    const protocols = getProfileProtocolOverview(progression);
    return (
      <div className="cyklus-void-panel">
        <div className="cyklus-void-section__title">Profilové protokoly: {progression.equippedProtocols.length} / {limits.protocolSlots}</div>
        <div className="cyklus-void-grid">
          {protocols.map((protocol) => {
            const canBuy = protocol.masteryMet && !protocol.unlocked && Object.entries(protocol.cost).every(([k, v]) => (progression.currencies[k as MetaCurrencyId] ?? 0) >= (v ?? 0));
            const handleBuy = () => {
              if (purchaseProtocol(protocol.id)) {
                refresh();
                showMessage('Protokol zakoupen. Subjekt si zapamatoval další způsob čtení.');
              }
            };
            const handleEquip = () => {
              if (protocol.equipped ? unequipProtocol(protocol.id) : equipProtocol(protocol.id)) {
                refresh();
                showMessage('Loadout upraven. Subjekt si zvolil další způsob, jak se nerozpadnout úplně stejně.');
              }
            };
            return (
              <div key={protocol.id} className={`cyklus-void-card ${protocol.equipped ? 'cyklus-void-card--equipped' : ''} ${!protocol.unlocked ? 'cyklus-void-card--locked' : ''}`}>
                <div className="cyklus-void-card__title">{protocol.title}</div>
                <div className="cyklus-void-card__desc">{protocol.description}</div>
                <div className="cyklus-void-card__meta">Požadavek: {Object.entries(protocol.requiresProfile).map(([k, v]) => `${k} ${v}`).join(', ')}</div>
                <div className="cyklus-void-card__meta">Nevýhoda: {protocol.drawback}</div>
                <div className="cyklus-void-actions">
                  {!protocol.unlocked && canBuy && (
                    <button className="cyklus-void-button" onClick={handleBuy}>KOUPIT</button>
                  )}
                  {protocol.unlocked && (
                    <button className="cyklus-void-button" onClick={handleEquip}>
                      {protocol.equipped ? 'SUNDAT' : 'NASADIT'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderUpgrades() {
    const upgrades = Object.values(SUBJECT_UPGRADES);
    return (
      <div className="cyklus-void-panel">
        <div className="cyklus-void-section__title">Upgrady: {progression.equippedUpgrades.length} / {limits.upgradeSlots}</div>
        <div className="cyklus-void-grid">
          {upgrades.map((upgrade) => {
            const status = getUpgradeStatus(progression, upgrade.id);
            const purchased = status === 'purchased' || status === 'equipped';
            const equipped = status === 'equipped';
            const canBuy = status === 'available';
            const handleBuy = () => {
              if (purchaseUpgrade(upgrade.id)) {
                refresh();
                showMessage('Upgrade zakoupen. Subjekt investoval do svého přežití.');
              }
            };
            const handleEquip = () => {
              if (equipped ? unequipUpgrade(upgrade.id) : equipUpgrade(upgrade.id)) {
                refresh();
                showMessage('Loadout upraven. Subjekt si zvolil další způsob, jak se nerozpadnout úplně stejně.');
              }
            };
            return (
              <div key={upgrade.id} className={`cyklus-void-card ${equipped ? 'cyklus-void-card--equipped' : ''} ${!purchased && !canBuy ? 'cyklus-void-card--locked' : ''}`}>
                <div className="cyklus-void-card__title">{upgrade.title}</div>
                <div className="cyklus-void-card__desc">{upgrade.description}</div>
                <div className="cyklus-void-card__meta">Kategorie: {upgrade.category}</div>
                <div className="cyklus-void-card__meta">Nevýhoda: {upgrade.drawback}</div>
                <div className="cyklus-void-actions">
                  {canBuy && (
                    <button className="cyklus-void-button" onClick={handleBuy}>KOUPIT</button>
                  )}
                  {purchased && (
                    <button className="cyklus-void-button" onClick={handleEquip}>
                      {equipped ? 'SUNDAT' : 'NASADIT'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderPocket() {
    const equipped = progression.equippedArtifacts;
    const crafted = progression.craftedArtifacts;
    const all = Object.values(CRAFTED_ARTIFACTS);
    return (
      <div className="cyklus-void-panel">
        <div className="cyklus-void-section__title">Artefakty: {equipped.length} / {limits.artifactSlots}</div>
        <div className="cyklus-void-grid">
          {all.map((artifact) => {
            const isCrafted = crafted.includes(artifact.id as CraftedArtifactId);
            const isEquipped = equipped.includes(artifact.id as CraftedArtifactId);
            const handleEquip = () => {
              if (isEquipped ? unequipArtifact(artifact.id as CraftedArtifactId) : equipArtifact(artifact.id as CraftedArtifactId)) {
                refresh();
                showMessage('Loadout upraven. Subjekt si zvolil další způsob, jak se nerozpadnout úplně stejně.');
              }
            };
            return (
              <div key={artifact.id} className={`cyklus-void-card ${isEquipped ? 'cyklus-void-card--equipped' : ''} ${!isCrafted ? 'cyklus-void-card--locked' : ''}`}>
                <div className="cyklus-void-card__title">{artifact.title}</div>
                <div className="cyklus-void-card__desc">{artifact.description}</div>
                <div className="cyklus-void-card__meta">Efekt: {artifact.effects.startFlags?.join(', ')}</div>
                <div className="cyklus-void-card__meta">Nevýhoda: {artifact.drawback}</div>
                <div className="cyklus-void-actions">
                  {isCrafted && (
                    <button className="cyklus-void-button" onClick={handleEquip}>
                      {isEquipped ? 'SUNDAT' : 'NASADIT'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderCrafting() {
    const known = progression.knownRecipes;
    const craftable = getAvailableCrafts(progression);
    const craftableIds = new Set(craftable.map((r) => r.id));
    const recipes = Object.values(CRAFT_RECIPES);

    function renderRecipe(recipe: typeof recipes[0], craftable: boolean) {
      const handleCraft = () => {
        if (craftRecipe(recipe.id as RecipeId)) {
          refresh();
          showMessage('Předměty se nespojily. Domluvily se.');
        }
      };
      const missing: string[] = [];
      if (recipe.requiresRoom && (progression.voidRooms[recipe.requiresRoom]?.level ?? 0) < (recipe.requiresRoomLevel ?? 1)) {
        missing.push(`${VOID_ROOMS[recipe.requiresRoom]?.title ?? recipe.requiresRoom} level ${recipe.requiresRoomLevel ?? 1}`);
      }
      (recipe.itemIds ?? []).forEach((id) => {
        if (!discovery.items.includes(id)) missing.push(`Předmět: ${id}`);
      });
      (recipe.imprintIds ?? []).forEach((id) => {
        if (!discovery.imprints.includes(id)) missing.push(`Otisk: ${id}`);
      });
      (recipe.findingIds ?? []).forEach((id) => {
        if (!discovery.findings.includes(id)) missing.push(`Nález: ${id}`);
      });
      (Object.entries(recipe.materialCosts ?? {}) as [CraftMaterialId, number][]).forEach(([id, amount]) => {
        if (amount && (progression.craftingInventory[id] ?? 0) < amount) missing.push(`${MATERIAL_LABELS[id]} ${amount}`);
      });
      (Object.entries(recipe.currencyCosts ?? {}) as [MetaCurrencyId, number][]).forEach(([id, amount]) => {
        if (amount && (progression.currencies[id] ?? 0) < amount) missing.push(`${CURRENCY_LABELS[id]} ${amount}`);
      });
      return (
        <div key={recipe.id} className={`cyklus-void-card ${craftable ? 'cyklus-void-card--available' : 'cyklus-void-card--locked'}`}>
          <div className="cyklus-void-card__title">{recipe.title}</div>
          <div className="cyklus-void-card__desc">{recipe.description}</div>
          {recipe.requiresRoom && (
            <div className="cyklus-void-card__meta">Vyžaduje: {VOID_ROOMS[recipe.requiresRoom]?.title ?? recipe.requiresRoom} level {recipe.requiresRoomLevel ?? 1}</div>
          )}
          {recipe.result.type === 'artifact' && (
            <div className="cyklus-void-card__meta">Výsledek: {CRAFTED_ARTIFACTS[recipe.result.artifactId]?.title ?? recipe.result.artifactId}</div>
          )}
          <div className="cyklus-void-card__meta">Nevýhoda: {recipe.drawback}</div>
          {missing.length > 0 && (
            <div className="cyklus-void-missing">
              <div className="cyklus-void-missing__title">Chybí:</div>
              <ul className="cyklus-void-list">
                {missing.map((m, i) => (
                  <li key={i} className="cyklus-void-list__item">{m}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="cyklus-void-actions">
            {craftable ? (
              <button className="cyklus-void-button" onClick={handleCraft}>VYROBIT</button>
            ) : (
              <button className="cyklus-void-button cyklus-void-button--disabled" disabled>NELZE VYROBIT</button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="cyklus-void-panel">
        {recipes.length === 0 && (
          <p className="cyklus-void-flavour">
            Stůl mlčí. Buď nemáš recept, nebo se předměty ještě nerozhodly, že spolu budou mluvit.
          </p>
        )}
        {recipes.some((r) => craftableIds.has(r.id)) && (
          <div className="cyklus-void-section">
            <div className="cyklus-void-section__title">Vyrobitelné</div>
            <div className="cyklus-void-grid">
              {recipes.filter((r) => craftableIds.has(r.id)).map((r) => renderRecipe(r, true))}
            </div>
          </div>
        )}
        {recipes.some((r) => known.includes(r.id) && !craftableIds.has(r.id)) && (
          <div className="cyklus-void-section">
            <div className="cyklus-void-section__title">Známé, ale chybí požadavky</div>
            <div className="cyklus-void-grid">
              {recipes.filter((r) => known.includes(r.id) && !craftableIds.has(r.id)).map((r) => renderRecipe(r, false))}
            </div>
          </div>
        )}
        {recipes.some((r) => !known.includes(r.id)) && (
          <div className="cyklus-void-section">
            <div className="cyklus-void-section__title">Neznámé recepty</div>
            <div className="cyklus-void-grid">
              {recipes.filter((r) => !known.includes(r.id)).map((r) => renderRecipe(r, false))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderScars() {
    const scars = Object.values(SUBJECT_SCARS);
    return (
      <div className="cyklus-void-panel">
        <div className="cyklus-void-grid">
          {scars.map((scar) => {
            const unlocked = progression.unlockedScars.includes(scar.id);
            const active = progression.activeScar === scar.id;
            const handleToggle = () => {
              if (setActiveScar(active ? undefined : scar.id)) {
                refresh();
                showMessage(active ? 'Jizva uložena. Příště se bolest neopře.' : 'Jizva nasazena. Příští run si vezmeš bolest jako nástroj.');
              }
            };
            return (
              <div key={scar.id} className={`cyklus-void-card ${active ? 'cyklus-void-card--equipped' : ''} ${!unlocked ? 'cyklus-void-card--locked' : ''}`}>
                <div className="cyklus-void-card__title">{scar.title}</div>
                <div className="cyklus-void-card__desc">{scar.description}</div>
                <div className="cyklus-void-card__meta">Start: {scar.stat} +{scar.startBonus}, {scar.startPenaltyStat} -{scar.startPenalty}</div>
                <div className="cyklus-void-actions">
                  {unlocked && (
                    <button className="cyklus-void-button" onClick={handleToggle}>
                      {active ? 'SUNDAT' : 'NASADIT'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderStory() {
    const activeThread = getActiveThreadInfo(story);
    const availableThreads = getAvailableStoryThreads(story, discovery, progression);
    const handleSetThread = (threadId: StoryProgression['activeThread']) => {
      const updated = setActiveThread(story, threadId);
      saveStoryProgression(updated);
      setStory(updated);
      showMessage(activeThread?.id === threadId ? 'Stopa zůstává aktivní.' : 'Příběhová stopa vybrána. Příští run začne jinde.');
    };
    return (
      <div className="cyklus-void-panel">
        <div className="cyklus-void-section">
          <div className="cyklus-void-section__title">Akt: {getStoryActTitle(story.currentAct)}</div>
          <p className="cyklus-void-flavour">{getStoryActDescription(story.currentAct)}</p>
        </div>
        {activeThread && (
          <div className="cyklus-void-section">
            <div className="cyklus-void-section__title">Aktivní stopa</div>
            <div className="cyklus-void-card cyklus-void-card--equipped">
              <div className="cyklus-void-card__title">{activeThread.title}</div>
              <div className="cyklus-void-card__desc">{activeThread.description}</div>
              <div className="cyklus-void-card__meta">Sektor: {activeThread.preferredSector}</div>
            </div>
          </div>
        )}
        {story.completedEpisodes.length > 0 && (
          <div className="cyklus-void-section">
            <div className="cyklus-void-section__title">Dokončené epizody</div>
            <ul className="cyklus-void-list">
              {story.completedEpisodes.map((ep) => (
                <li key={ep} className="cyklus-void-list__item">{ep}</li>
              ))}
            </ul>
          </div>
        )}
        {availableThreads.length > 0 && (
          <div className="cyklus-void-section">
            <div className="cyklus-void-section__title">Dostupné další stopy</div>
            <div className="cyklus-void-grid">
              {availableThreads.map((thread) => (
                <div key={thread.id} className={`cyklus-void-card ${story.activeThread === thread.id ? 'cyklus-void-card--equipped' : ''}`}>
                  <div className="cyklus-void-card__title">{thread.title}</div>
                  <div className="cyklus-void-card__desc">{thread.description}</div>
                  <div className="cyklus-void-card__meta">Sektor: {thread.preferredSector}</div>
                  <div className="cyklus-void-actions">
                    <button className="cyklus-void-button" onClick={() => handleSetThread(thread.id)}>
                      {story.activeThread === thread.id ? 'AKTIVNÍ' : 'VYBRAT'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeThread && (
          <div className="cyklus-void-actions">
            <button className="cyklus-void-button cyklus-void-button--danger" onClick={() => handleSetThread(undefined)}>
              ZRUŠIT AKTIVNÍ STOPU
            </button>
          </div>
        )}
      </div>
    );
  }

  function applyThemeFromHub(themeId: string) {
    try { document.body.setAttribute('data-theme', themeId); } catch {}
    try { document.documentElement.setAttribute('data-theme', themeId); } catch {}
    try { localStorage.setItem('theme', themeId); } catch {}
    setCurrentTheme(themeId);
    showMessage(`Motiv změněn: ${UI_THEMES.find((t) => t.id === themeId)?.label ?? themeId}`);
  }

  function renderSettings() {
    return (
      <div className="cyklus-void-panel">
        <div className="cyklus-void-section">
          <div className="cyklus-void-section__title">Barevný motiv</div>
          <div className="cyklus-void-grid">
            {UI_THEMES.map((theme) => (
              <button
                key={theme.id}
                className={`cyklus-void-button ${currentTheme === theme.id ? 'cyklus-void-button--primary' : ''}`}
                onClick={() => applyThemeFromHub(theme.id)}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Přehled' },
    { id: 'story', label: 'Příběh' },
    { id: 'rooms', label: 'Místnosti' },
    { id: 'protocols', label: 'Protokoly' },
    { id: 'upgrades', label: 'Upgrady' },
    { id: 'pocket', label: 'Kapsa' },
    { id: 'crafting', label: 'Crafting' },
    { id: 'scars', label: 'Jizvy' },
    { id: 'settings', label: 'Nastavení' },
  ];

  return (
    <div className="cyklus-void-hub">
      <div className="cyklus-void-hub__frame">
        <div className="cyklus-void-hub__header">
          <div className="cyklus-void-hub__title">PRÁZDN0TA</div>
          <div className="cyklus-void-hub__actions">
            {onStartRun && (
              <button className="cyklus-void-button cyklus-void-button--primary" onClick={onStartRun}>DALŠÍ CYKLUS</button>
            )}
            {onClose && (
              <button className="cyklus-void-button cyklus-void-button--danger" onClick={onClose}>ZAVŘÍT</button>
            )}
          </div>
        </div>
        {message && (
          <div className="cyklus-void-hub__message">{message}</div>
        )}
        <div className="cyklus-void-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`cyklus-void-tab ${activeTab === tab.id ? 'cyklus-void-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="cyklus-void-hub__content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'story' && renderStory()}
          {activeTab === 'rooms' && renderRooms()}
          {activeTab === 'protocols' && renderProtocols()}
          {activeTab === 'upgrades' && renderUpgrades()}
          {activeTab === 'pocket' && renderPocket()}
          {activeTab === 'crafting' && renderCrafting()}
          {activeTab === 'scars' && renderScars()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
}

function getProgressionOverview(progression: SubjectProgression) {
  return {
    currencies: progression.currencies,
    craftingInventory: progression.craftingInventory,
    totalRuns: progression.totalRuns,
    stabilizedRuns: progression.stabilizedRuns,
    totalResiduumEarned: progression.totalResiduumEarned,
    equippedLoadout: {
      upgrades: progression.equippedUpgrades,
      artifacts: progression.equippedArtifacts,
      protocols: progression.equippedProtocols,
      scar: progression.activeScar,
    },
    loadoutLimits: getLoadoutLimits(progression),
  };
}
