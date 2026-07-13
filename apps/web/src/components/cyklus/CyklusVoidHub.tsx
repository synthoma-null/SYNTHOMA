'use client';

import { useMemo, useState } from 'react';
import type {
  CraftRecipeUiRow,
  ProgressionCostRow,
  ProgressionLoadoutEntry,
  RunReward,
  SubjectProgression,
  VoidHubTabId,
  VoidHubUiModel,
  VoidRoomUiRow,
  VoidHubTabUiRow,
} from '../../game/cyklus/cyklusProgression';
import { CURRENCY_LABELS, MATERIAL_LABELS, SUBJECT_SCARS, VOID_ROOMS, getVoidHubUiModel } from '../../game/cyklus/cyklusProgression';
import type { CyklusRunFocus, CyklusRunState } from '../../game/cyklus/cyklusTypes';
import { CyklusPocketPanel } from './CyklusPocketPanel';
import { CyklusProgressionDashboard } from './CyklusProgressionDashboard';

export type CyklusVoidHubActionPayload = {
  id: string;
  kind?: ProgressionLoadoutEntry['kind'] | 'room' | 'recipe';
};

export type CyklusVoidHubActions = {
  onStartRun?: () => void;
  onStartFocusedRun?: (focus: CyklusRunFocus) => void;
  onUpgradeRoom?: (roomId: string) => void;
  onCraftRecipe?: (recipeId: string) => void;
  onEquipLoadout?: (payload: CyklusVoidHubActionPayload) => void;
  onUnequipLoadout?: (payload: CyklusVoidHubActionPayload) => void;
  onRefresh?: () => void;
};

export const FOCUS_RUN_OPTIONS: Array<CyklusRunFocus & { actionLabel: string }> = [
  { type: 'sector', id: 'archive', label: 'Archiv', strictness: 'soft', remainingCards: 10, actionLabel: 'Vstoupit do Archivu' },
  { type: 'sector', id: 'memory_sandbox', label: 'Pískoviště paměti', strictness: 'soft', remainingCards: 10, actionLabel: 'Vstoupit do Pískoviště paměti' },
  { type: 'sector', id: 'glitchka_nest', label: 'Glitchčino hnízdo', strictness: 'soft', remainingCards: 10, actionLabel: 'Vstoupit ke Glitchce' },
  { type: 'sector', id: 'sarkasma_terminal', label: 'Sarkasmin terminál', strictness: 'soft', remainingCards: 10, actionLabel: 'Vstoupit k Sarkasmě' },
  { type: 'sector', id: 'tai_core', label: 'T-AI jádro', strictness: 'strong', remainingCards: 5, actionLabel: 'Vstoupit do T-AI jádra' },
  { type: 'appendix', id: 'toll_dvanactnik', label: 'Mýtnice Dvanáctníka', strictness: 'strong', remainingCards: 5, actionLabel: 'Dodatek: Mýtnice Dvanáctníka' },
  { type: 'appendix', id: 'detective_echo_case', label: 'Případ ozvěny', strictness: 'strong', remainingCards: 4, actionLabel: 'Dodatek: Případ ozvěny' },
  { type: 'appendix', id: 'sarkasma_therapy', label: 'Sarkasmina terapie', strictness: 'strong', remainingCards: 4, actionLabel: 'Dodatek: Sarkasmina terapie' },
  { type: 'appendix', id: 'glitchka_chat', label: 'Pokec s Glitchkou', strictness: 'strong', remainingCards: 3, actionLabel: 'Dodatek: Pokec s Glitchkou' },
];

type Props = {
  progression: SubjectProgression;
  state?: CyklusRunState | null;
  initialTab?: VoidHubTabId;
  actions?: CyklusVoidHubActions;
  compact?: boolean;
  recentReward?: RunReward | null;
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

function preferredTabForRecommendation(action: string): VoidHubTabId {
  const lower = action.toLocaleLowerCase('cs');
  if (lower.includes('místnost') || lower.includes('prázdnot')) return 'rooms';
  if (lower.includes('craft') || lower.includes('vyrob')) return 'crafting';
  if (lower.includes('loadout') || lower.includes('vybav') || lower.includes('upgrade')) return 'loadout';
  if (lower.includes('protokol') || lower.includes('jizv')) return 'protocols';
  if (lower.includes('kaps')) return 'pocket';
  return 'overview';
}

function getRewardReturnChanges(reward: RunReward | null | undefined): string[] {
  if (!reward) return [];
  const changes: string[] = [];
  const residuum = reward.currencies.residuum ?? 0;
  if (residuum > 0) changes.push(`${CURRENCY_LABELS.residuum}: +${residuum}`);

  const material = (Object.entries(reward.craftingMaterials) as [keyof typeof MATERIAL_LABELS, number | undefined][])
    .filter(([, amount]) => (amount ?? 0) > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))[0];
  if (material) {
    const [id, amount] = material;
    changes.push(`${MATERIAL_LABELS[id]}: +${amount ?? 0}`);
  }

  const stabilizationCore = reward.currencies.stabilizationCore ?? 0;
  if (stabilizationCore > 0) {
    changes.push(`${CURRENCY_LABELS.stabilizationCore}: +${stabilizationCore}`);
  } else if (reward.unlockedScars[0]) {
    const scarId = reward.unlockedScars[0];
    changes.push(`Nová jizva: ${SUBJECT_SCARS[scarId]?.title ?? scarId}`);
  }

  if (reward.voidRoomHints[0]) {
    const roomId = reward.voidRoomHints[0];
    changes.push(`Doporučená místnost: ${VOID_ROOMS[roomId]?.title ?? roomId}`);
  } else if (reward.recommendedActions[0]) {
    changes.push(reward.recommendedActions[0]);
  }

  return [...new Set(changes)].slice(0, 3);
}

function getProgressionReturnChanges(progression: SubjectProgression, model: VoidHubUiModel): string[] {
  const changes: string[] = [];
  const currency = model.dashboard.currencies.find((row) => row.amount > 0);
  if (currency) changes.push(`${currency.label}: ${currency.amount}`);
  const material = model.dashboard.materials.find((row) => row.amount > 0);
  if (material) changes.push(`${material.label}: ${material.amount}`);
  const loadout = model.dashboard.loadout.available[0];
  if (loadout) changes.push(`Nová možnost loadoutu: ${loadout.title}`);
  const room = model.dashboard.availableRooms[0];
  if (room) changes.push(`Místnost připravená k vylepšení: ${room.title}`);
  if (progression.activeScar) changes.push(`Aktivní jizva: ${SUBJECT_SCARS[progression.activeScar]?.title ?? progression.activeScar}`);
  return [...new Set(changes)].slice(0, 3);
}

function VoidReturnSummary({
  progression,
  model,
  recentReward,
  state,
}: {
  progression: SubjectProgression;
  model: VoidHubUiModel;
  recentReward?: RunReward | null;
  state: CyklusRunState | null;
}) {
  const shouldShow = Boolean(recentReward) || ((!state || state.status !== 'playing') && progression.totalRuns === 1);
  if (!shouldShow) return null;
  const changes = recentReward ? getRewardReturnChanges(recentReward) : getProgressionReturnChanges(progression, model);
  const visibleChanges = changes.length > 0 ? changes : ['Prázdnota eviduje nový záznam. Zní to suše, ale něco se opravdu změnilo.'];
  return (
    <section className="void-hub-return-summary" aria-labelledby="void-hub-return-summary-title">
      <p className="cyklus-panel-kicker">PRÁZDNOTA SE ZMĚNILA</p>
      <h3 id="void-hub-return-summary-title">Prázdnota se změnila</h3>
      <p>Systém tvrdí, že se nic nestalo. Lže. Zůstalo reziduum, otisk a pár možností, jak příště neumřít stejně elegantně.</p>
      <ul>
        {visibleChanges.map((change) => <li key={change}>{change}</li>)}
      </ul>
    </section>
  );
}

function VoidHubNextAction({
  model,
  state,
  actions,
  onSelectTab,
}: {
  model: VoidHubUiModel;
  state: CyklusRunState | null;
  actions: CyklusVoidHubActions | undefined;
  onSelectTab: (tab: VoidHubTabId) => void;
}) {
  const activeRun = state?.status === 'playing';
  const recommendation = model.dashboard.recommendedActions[0];
  const room = model.dashboard.availableRooms[0];
  const targetTab = recommendation ? preferredTabForRecommendation(recommendation) : 'overview';

  return (
    <section className="void-hub-next-action" aria-labelledby="void-hub-next-action-title">
      <div>
        <p className="cyklus-panel-kicker">DALŠÍ KROK</p>
        <h3 id="void-hub-next-action-title">Co teď</h3>
        <p>{recommendation ?? 'Prázdnota zatím nemá chytrý plán. Má jen ticho a velmi podezřelou židli.'}</p>
      </div>
      <div className="void-hub-next-action__actions">
        {!activeRun && (
          <div className="void-hub-action-with-note">
            <ActionButton onClick={actions?.onStartRun} title={actions?.onStartRun ? undefined : 'Napoj onStartRun pro spuštění běhu.'}>
              Spustit další běh
            </ActionButton>
            <span>Smíšený běh</span>
          </div>
        )}
        {recommendation && (
          <ActionButton onClick={() => onSelectTab(targetTab)}>
            Otevřít doporučení
          </ActionButton>
        )}
        {room ? (
          <ActionButton onClick={() => onSelectTab('rooms')}>
            Vylepšit doporučenou místnost
          </ActionButton>
        ) : (
          <p className="void-hub-next-action__empty">Zatím nemáš dost materiálu. Tragédie malého rozsahu. Další běh to spraví nebo zhorší.</p>
        )}
      </div>
    </section>
  );
}

function FocusRunPanel({ actions }: { actions: CyklusVoidHubActions | undefined }) {
  const [selected, setSelected] = useState<CyklusRunFocus | null>(null);

  const selectFocus = (focus: CyklusRunFocus) => {
    setSelected(focus);
    actions?.onStartFocusedRun?.(focus);
  };

  return (
    <section className="void-hub-focus" aria-labelledby="void-hub-focus-title">
      <div>
        <p className="cyklus-panel-kicker">SMĚR BĚHU</p>
        <h3 id="void-hub-focus-title">Držet konkrétní stopu</h3>
        <p>Vyber oblast nebo dodatek. Běh se jí bude držet, ale nouzové dveře zůstanou odemčené.</p>
      </div>
      <div className="void-hub-focus__options">
        {FOCUS_RUN_OPTIONS.map((focus) => (
          <button
            key={`${focus.type}-${focus.id}`}
            className={cx(
              'void-hub-focus__button',
              `is-${focus.type}`,
              focus.strictness === 'strong' && 'is-strong',
            )}
            type="button"
            disabled={!actions?.onStartFocusedRun}
            onClick={() => selectFocus(focus)}
            aria-label={`${focus.actionLabel}. ${focus.type === 'appendix' ? 'Dodatek bude mít přednost.' : 'Oblast bude mít přednost.'}`}
          >
            <span>{focus.actionLabel}</span>
            <small>
              <span>{(focus.remainingCards ?? 0) <= 5 ? 'Krátká stopa' : focus.strictness === 'strong' ? 'Uzavřenější běh' : 'Volnější oblast'}</span>
              <span aria-hidden="true"> · </span>
              <span>{focus.remainingCards ?? 0} karet</span>
            </small>
          </button>
        ))}
      </div>
      {selected && (
        <p className="void-hub-focus__confirmation" role="status">
          Následující běh drží stopu: {selected.label}
        </p>
      )}
    </section>
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

export function CyklusVoidHub({ progression, state = null, initialTab = 'overview', actions, compact = false, recentReward = null }: Props) {
  const [activeTab, setActiveTab] = useState<VoidHubTabId>(initialTab);
  const model = useMemo(() => getVoidHubUiModel(progression, state), [progression, state]);
  const active = TAB_ORDER.includes(activeTab) ? activeTab : 'overview';
  const activePanelId = `void-hub-panel-${active}`;

  return (
    <section className={cx('cyklus-no-select', 'cyklus-void-hub', compact && 'is-compact')} aria-label="Prázdnota SYNTHOMA">
      <header className="void-hub-hero">
        <div className="void-hub-hero__identity">
          <p className="cyklus-panel-kicker">SYNTHOMA OS / PRÁZDN0TA</p>
          <h2>PRÁZDN0TA</h2>
          <p className="void-hub-hero__role">Operační místnost identity</p>
          <p>{model.summary}</p>
          <p className="void-hub-pulse">{model.pulseText}</p>
        </div>
        <div className="void-hub-hero-actions">
          <ActionButton onClick={actions?.onRefresh} title={actions?.onRefresh ? undefined : 'Napoj onRefresh pro obnovu dat.'}>Obnovit</ActionButton>
        </div>
        <div className="void-hub-status-rail" aria-label="Stav subjektu v Prázdnotě">
          <span><small>SUBJEKT</small><strong>NULL-1</strong></span>
          <span><small>BĚHY</small><strong>{progression.totalRuns}</strong></span>
          <span><small>REZIDUUM</small><strong>{progression.currencies.residuum ?? 0}</strong></span>
          <span><small>PAMĚŤ</small><strong>{state ? `${state.history.length} záz.` : `${progression.totalRuns} archiv.`}</strong></span>
          <span><small>POSLEDNÍ NÁVRAT</small><strong>{recentReward ? 'NOVÁ DATA' : progression.totalRuns > 0 ? 'EVIDOVÁN' : 'BEZ ZÁZNAMU'}</strong></span>
        </div>
      </header>

      <VoidReturnSummary progression={progression} model={model} state={state} recentReward={recentReward} />
      <VoidHubNextAction model={model} state={state} actions={actions} onSelectTab={setActiveTab} />
      {state?.status !== 'playing' && <FocusRunPanel actions={actions} />}

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
