'use client';

import { useMemo, useState } from 'react';
import type {
  CraftRecipeUiRow,
  ProgressionCostRow,
  ProgressionLoadoutEntry,
  SubjectProgression,
  VoidHubTabId,
  VoidHubUiModel,
  VoidRoomUiRow,
  VoidHubTabUiRow,
} from '../../game/cyklus/cyklusProgression';
import { getVoidHubUiModel } from '../../game/cyklus/cyklusProgression';
import type { CyklusRunState } from '../../game/cyklus/cyklusTypes';
import { CyklusPocketPanel } from './CyklusPocketPanel';
import { CyklusProgressionDashboard } from './CyklusProgressionDashboard';

export type CyklusVoidHubActionPayload = {
  id: string;
  kind?: ProgressionLoadoutEntry['kind'] | 'room' | 'recipe';
};

export type CyklusVoidHubActions = {
  onStartRun?: () => void;
  onUpgradeRoom?: (roomId: string) => void;
  onCraftRecipe?: (recipeId: string) => void;
  onEquipLoadout?: (payload: CyklusVoidHubActionPayload) => void;
  onUnequipLoadout?: (payload: CyklusVoidHubActionPayload) => void;
  onRefresh?: () => void;
};

type Props = {
  progression: SubjectProgression;
  state?: CyklusRunState | null;
  initialTab?: VoidHubTabId;
  actions?: CyklusVoidHubActions;
  compact?: boolean;
};

const TAB_ORDER: VoidHubTabId[] = ['overview', 'pocket', 'crafting', 'rooms', 'loadout', 'protocols'];

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function costText(cost: ProgressionCostRow[]): string {
  if (cost.length === 0) return 'bez viditelné ceny, což je v SYNTHOMĚ prakticky výhrůžka';
  return cost.map((row) => `${row.label} ${row.owned}/${row.amount}`).join(' · ');
}

function recipeStatusLabel(status: CraftRecipeUiRow['status']): string {
  if (status === 'craftable') return 'lze vyrobit';
  if (status === 'crafted') return 'vyrobeno';
  if (status === 'locked') return 'zamčeno';
  return 'skryto';
}

function roomStatusLabel(status: VoidRoomUiRow['status']): string {
  if (status === 'available') return 'lze vylepšit';
  if (status === 'maxed') return 'maximum';
  return 'zamčeno';
}

function loadoutKindLabel(kind: ProgressionLoadoutEntry['kind']): string {
  switch (kind) {
    case 'upgrade': return 'upgrade';
    case 'artifact': return 'artefakt';
    case 'protocol': return 'protokol';
    case 'scar': return 'jizva';
    default: return kind;
  }
}

function ActionButton({
  children,
  disabled,
  onClick,
  title,
}: {
  children: string;
  disabled?: boolean;
  onClick?: (() => void) | undefined;
  title?: string | undefined;
}) {
  return (
    <button 
      className="void-hub-action-button" 
      type="button" 
      disabled={disabled || !onClick} 
      onClick={onClick ?? undefined} 
      title={title ?? undefined}
    >
      {children}
    </button>
  );
}

function CraftingTab({ model, actions }: { model: VoidHubUiModel; actions?: CyklusVoidHubActions }) {
  const visibleCrafts = model.dashboard.crafts.filter((recipe) => recipe.status !== 'hidden');
  const craftable = visibleCrafts.filter((recipe) => recipe.status === 'craftable');
  const rest = visibleCrafts.filter((recipe) => recipe.status !== 'craftable');
  const ordered = [...craftable, ...rest];

  return (
    <section className="void-hub-tab-panel" aria-label="Crafting">
      <header className="void-hub-section-header">
        <p className="cyklus-panel-kicker">CRAFTING_TABLE</p>
        <h3>Výroba následků</h3>
        <p>Materiály nejsou odměna. Jsou to zbytky toho, co přežilo dost dlouho, aby se z toho dal udělat další problém.</p>
      </header>

      {ordered.length === 0 ? (
        <p className="cyklus-empty-note">Žádné známé recepty. Prázdnota zatím neví, co z tebe vyrobit. Podezřele laskavé.</p>
      ) : (
        <ul className="craft-recipe-list void-hub-list">
          {ordered.map((recipe) => (
            <li key={recipe.id} className={cx('craft-recipe-row', `is-${recipe.status}`, recipe.pocketRelevant && 'is-pocket-relevant')}>
              <div className="pocket-item-titleline">
                <strong>{recipe.title}</strong>
                <span className="craft-status-pill">{recipeStatusLabel(recipe.status)}</span>
              </div>
              <p>{recipe.description}</p>
              <small>Výsledek: {recipe.resultTitle} · Cena: {costText(recipe.cost)}</small>
              {recipe.drawback && <small>Háček: {recipe.drawback}</small>}
              {recipe.missingReasons.length > 0 && recipe.status !== 'crafted' && (
                <ul className="missing-reason-list">
                  {recipe.missingReasons.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}
                </ul>
              )}
              <ActionButton
                disabled={recipe.status !== 'craftable'}
                onClick={recipe.status === 'craftable' ? () => actions?.onCraftRecipe?.(recipe.id) : undefined}
                title={actions?.onCraftRecipe ? undefined : 'Napoj onCraftRecipe v rodičovské komponentě.'}
              >
                Vyrobit
              </ActionButton>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function RoomsTab({ model, actions }: { model: VoidHubUiModel; actions?: CyklusVoidHubActions }) {
  const rooms = [...model.dashboard.rooms].sort((a, b) => {
    const priority = { available: 0, maxed: 1, locked: 2 } as const;
    return priority[a.status] - priority[b.status] || a.title.localeCompare(b.title, 'cs');
  });

  return (
    <section className="void-hub-tab-panel" aria-label="Místnosti v Prázdnotě">
      <header className="void-hub-section-header">
        <p className="cyklus-panel-kicker">VOID_ROOMS</p>
        <h3>Prázdnota jako základna</h3>
        <p>Checkpoint není bezpečí. Je to místo, kde systém počítá ztráty a občas dovolí přistavět poličku.</p>
      </header>
      <ul className="void-room-list void-hub-list">
        {rooms.map((room) => (
          <li key={room.id} className={cx('void-room-row', `is-${room.status}`, room.isPocketRoom && 'is-pocket-room')}>
            <div className="pocket-item-titleline">
              <strong>{room.title}</strong>
              <span className="craft-status-pill">{roomStatusLabel(room.status)} · {room.level}/{room.maxLevel}</span>
            </div>
            <p>{room.description}</p>
            <small>Efekt: {room.effectPreview}</small>
            <small>Cena: {costText(room.nextCost)}</small>
            <ActionButton
              disabled={room.status !== 'available'}
              onClick={room.status === 'available' ? () => actions?.onUpgradeRoom?.(room.id) : undefined}
              title={actions?.onUpgradeRoom ? undefined : 'Napoj onUpgradeRoom v rodičovské komponentě.'}
            >
              Vylepšit
            </ActionButton>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LoadoutEntryCard({ entry, actions }: { key?: string; entry: ProgressionLoadoutEntry; actions?: CyklusVoidHubActions | undefined }) {
  const action = entry.equipped ? actions?.onUnequipLoadout : actions?.onEquipLoadout;
  return (
    <li className={cx('loadout-entry', entry.equipped && 'is-equipped')}>
      <div className="pocket-item-titleline">
        <strong>{entry.title}</strong>
        <span className="craft-status-pill">{loadoutKindLabel(entry.kind)} · {entry.equipped ? 'vybaveno' : 'k dispozici'}</span>
      </div>
      <p>{entry.description}</p>
      {entry.drawback && <small>Daň: {entry.drawback}</small>}
      {entry.tags.length > 0 && <span>{entry.tags.join(' · ')}</span>}
      <ActionButton
        onClick={action ? () => action({ id: entry.id, kind: entry.kind }) : undefined}
        title={action ? undefined : entry.equipped ? 'Napoj onUnequipLoadout.' : 'Napoj onEquipLoadout.'}
      >
        {entry.equipped ? 'Sundat' : 'Vybavit'}
      </ActionButton>
    </li>
  );
}

function LoadoutTab({ model, actions, protocolsOnly = false }: { model: VoidHubUiModel; actions?: CyklusVoidHubActions; protocolsOnly?: boolean }) {
  const equipped = model.dashboard.loadout.equipped.filter((entry) => protocolsOnly ? entry.kind === 'protocol' || entry.kind === 'scar' : entry.kind !== 'protocol' && entry.kind !== 'scar');
  const available = model.dashboard.loadout.available.filter((entry) => protocolsOnly ? entry.kind === 'protocol' || entry.kind === 'scar' : entry.kind !== 'protocol' && entry.kind !== 'scar');

  return (
    <section className="void-hub-tab-panel" aria-label={protocolsOnly ? 'Protokoly a jizvy' : 'Loadout'}>
      <header className="void-hub-section-header">
        <p className="cyklus-panel-kicker">{protocolsOnly ? 'PROFILE_PROTOCOLS' : 'LOADOUT'}</p>
        <h3>{protocolsOnly ? 'Protokoly a jizvy' : 'Co si bereš do dalšího běhu'}</h3>
        <p>
          {protocolsOnly
            ? 'Profilové protokoly nejsou osobnost. Jsou to berličky s uživatelskou licencí. Jizvy jsou horší: ty si licenci ani nevyžádaly.'
            : `Sloty: ${model.dashboard.loadout.equipped.length}/${model.dashboard.loadout.limits.upgradeSlots + model.dashboard.loadout.limits.artifactSlots + model.dashboard.loadout.limits.protocolSlots + model.dashboard.loadout.limits.scarSlots}. Výbava je slib, že příště budeš kolabovat profesionálněji.`}
        </p>
      </header>

      <div className="void-hub-loadout-columns">
        <article className="progression-card loadout-card">
          <h4>Vybaveno</h4>
          {equipped.length === 0 ? (
            <p className="cyklus-empty-note">Nic vybaveného. Minimalismus je hezký, dokud nezačne křičet.</p>
          ) : (
            <ul className="void-hub-list loadout-entry-grid">{equipped.map((entry) => <LoadoutEntryCard key={`${entry.kind}-${entry.id}`} entry={entry} actions={actions} />)}</ul>
          )}
        </article>
        <article className="progression-card loadout-card">
          <h4>K dispozici</h4>
          {available.length === 0 ? (
            <p className="cyklus-empty-note">Nic dalšího k dispozici. Systém šetří tvé možnosti, což je od něj skoro podezřelé.</p>
          ) : (
            <ul className="void-hub-list loadout-entry-grid">{available.map((entry) => <LoadoutEntryCard key={`${entry.kind}-${entry.id}`} entry={entry} actions={actions} />)}</ul>
          )}
        </article>
      </div>
    </section>
  );
}

export function CyklusVoidHub({ progression, state = null, initialTab = 'overview', actions, compact = false }: Props) {
  const [activeTab, setActiveTab] = useState<VoidHubTabId>(initialTab);
  const model = useMemo(() => getVoidHubUiModel(progression, state), [progression, state]);
  const active = TAB_ORDER.includes(activeTab) ? activeTab : 'overview';
  const activePanelId = `void-hub-panel-${active}`;

  return (
    <section className={cx('cyklus-void-hub', compact && 'is-compact')} aria-label="Prázdnota SYNTHOMA">
      <header className="void-hub-hero">
        <div>
          <p className="cyklus-panel-kicker">VOID_HUB</p>
          <h2>Prázdnota jako operační místnost</h2>
          <p>{model.summary}</p>
          <p className="void-hub-pulse">{model.pulseText}</p>
        </div>
        <div className="void-hub-hero-actions">
          <ActionButton onClick={actions?.onStartRun} title={actions?.onStartRun ? undefined : 'Napoj onStartRun pro spuštění běhu.'}>Spustit běh</ActionButton>
          <ActionButton onClick={actions?.onRefresh} title={actions?.onRefresh ? undefined : 'Napoj onRefresh pro obnovu dat.'}>Obnovit</ActionButton>
        </div>
      </header>

      <div className="void-hub-alerts" aria-label="Doporučení Prázdnoty">
        {model.alerts.map((alert: string) => <p key={alert}>{alert}</p>)}
      </div>

      <nav className="void-hub-tabs" aria-label="Sekce Prázdnoty" role="tablist">
        {model.tabs.map((tab: VoidHubTabUiRow) => (
          <button
            key={tab.id}
            id={`void-hub-tab-${tab.id}`}
            type="button"
            role="tab"
            className={cx('void-hub-tab', active === tab.id && 'is-active', `is-${tab.priority}`)}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={active === tab.id}
            aria-controls={active === tab.id ? activePanelId : undefined}
          >
            <span>{tab.title}</span>
            {tab.badge && <small>{tab.badge}</small>}
          </button>
        ))}
      </nav>

      <div id={activePanelId} role="tabpanel" aria-labelledby={`void-hub-tab-${active}`}>
        {active === 'overview' && <CyklusProgressionDashboard progression={progression} state={state} />}
        {active === 'pocket' && <CyklusPocketPanel progression={progression} state={state} />}
        {active === 'crafting' && actions && <CraftingTab model={model} actions={actions} />}
        {active === 'rooms' && actions && <RoomsTab model={model} actions={actions} />}
        {active === 'loadout' && actions && <LoadoutTab model={model} actions={actions} />}
        {active === 'protocols' && actions && <LoadoutTab model={model} actions={actions} protocolsOnly />}
      </div>
    </section>
  );
}
