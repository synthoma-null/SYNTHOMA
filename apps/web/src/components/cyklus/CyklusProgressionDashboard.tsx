import type { CyklusRunState } from '../../game/cyklus/cyklusTypes';
import type { SubjectProgression, ProgressionDashboardUiModel, VoidRoomUiRow, CraftRecipeUiRow, ProgressionCostRow } from '../../game/cyklus/cyklusProgression';
import { getProgressionDashboardUiModel } from '../../game/cyklus/cyklusProgression';
import { CyklusPocketPanel } from './CyklusPocketPanel';

type Props = {
  progression: SubjectProgression;
  state?: CyklusRunState | null;
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function costText(cost: ProgressionCostRow[]): string {
  if (cost.length === 0) return 'žádná viditelná cena';
  return cost.map((c) => `${c.label} ${c.owned}/${c.amount}`).join(' · ');
}

function roomStatusLabel(status: VoidRoomUiRow['status']): string {
  if (status === 'available') return 'lze vylepšit';
  if (status === 'maxed') return 'maximum';
  return 'zamčeno';
}

function recipeStatusLabel(status: CraftRecipeUiRow['status']): string {
  if (status === 'craftable') return 'lze vyrobit';
  if (status === 'crafted') return 'vyrobeno';
  if (status === 'locked') return 'chybí podmínky';
  return 'skryto';
}

export function CyklusProgressionDashboard({ progression, state = null }: Props) {
  const model: ProgressionDashboardUiModel = getProgressionDashboardUiModel(progression, state);
  const visibleRooms = model.rooms.filter((room) => room.status !== 'locked' || room.level > 0).slice(0, 8);
  const visibleCrafts = model.crafts.filter((recipe) => recipe.status !== 'hidden').slice(0, 8);

  return (
    <section className="cyklus-progression-dashboard" aria-label="SYNTHOMA meta progression">
      <header className="cyklus-dashboard-hero">
        <p className="cyklus-panel-kicker">VOID_META</p>
        <h2>Prázdnota si vede účetnictví</h2>
        <p>{model.summary}</p>
      </header>

      <div className="progression-resource-grid">
        <article className="progression-card">
          <h3>Měny</h3>
          <div className="resource-pill-list">
            {model.currencies.map((row) => <span key={row.id} className="resource-pill">{row.label}: {row.amount}</span>)}
          </div>
        </article>
        <article className="progression-card">
          <h3>Materiály</h3>
          {model.materials.length === 0 ? (
            <p className="cyklus-empty-note">Žádné materiály. Prázdnota ještě nemá z čeho vyrábět tvoje další špatná rozhodnutí.</p>
          ) : (
            <div className="resource-pill-list">
              {model.materials.map((row) => <span key={row.id} className="resource-pill material">{row.label}: {row.amount}</span>)}
            </div>
          )}
        </article>
      </div>

      <CyklusPocketPanel progression={progression} state={state} compact />

      <div className="progression-section-grid">
        <article className="progression-card progression-rooms-card">
          <h3>Místnosti v Prázdnotě</h3>
          <ul className="void-room-list">
            {visibleRooms.map((room) => (
              <li key={room.id} className={cx('void-room-row', room.isPocketRoom && 'is-pocket-room', `is-${room.status}`)}>
                <div className="pocket-item-titleline">
                  <strong>{room.title}</strong>
                  <span className="craft-status-pill">{roomStatusLabel(room.status)} · {room.level}/{room.maxLevel}</span>
                </div>
                <p>{room.description}</p>
                <small>Další efekt: {room.effectPreview}</small>
                <small>Cena: {costText(room.nextCost)}</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="progression-card progression-crafts-card">
          <h3>Crafting</h3>
          {visibleCrafts.length === 0 ? (
            <p className="cyklus-empty-note">Žádný recept k zobrazení. Ještě ani chaos neumí vařit bez surovin.</p>
          ) : (
            <ul className="craft-recipe-list">
              {visibleCrafts.map((recipe) => (
                <li key={recipe.id} className={cx('craft-recipe-row', `is-${recipe.status}`)}>
                  <div className="pocket-item-titleline">
                    <strong>{recipe.title}</strong>
                    <span className="craft-status-pill">{recipeStatusLabel(recipe.status)}</span>
                  </div>
                  <p>{recipe.description}</p>
                  <small>Výsledek: {recipe.resultTitle}</small>
                  <small>Cena: {costText(recipe.cost)}</small>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      <article className="progression-card loadout-card">
        <h3>Loadout</h3>
        <p className="cyklus-empty-note">
          Sloty: upgrady {model.loadout.equipped.filter((e) => e.kind === 'upgrade').length}/{model.loadout.limits.upgradeSlots} · artefakty {model.loadout.equipped.filter((e) => e.kind === 'artifact').length}/{model.loadout.limits.artifactSlots} · protokoly {model.loadout.equipped.filter((e) => e.kind === 'protocol').length}/{model.loadout.limits.protocolSlots}
        </p>
        <div className="loadout-entry-grid">
          {model.loadout.equipped.length === 0 ? (
            <p className="cyklus-empty-note">Nic není vybavené. Minimalismus je krásný, dokud tě nezabije první špatně označená vzpomínka.</p>
          ) : model.loadout.equipped.map((entry) => (
            <div key={`${entry.kind}-${entry.id}`} className="loadout-entry">
              <strong>{entry.title}</strong>
              <span>{entry.kind}</span>
              <p>{entry.description}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="cyklus-suggestion-box dashboard-actions">
        <h3>Další kroky</h3>
        <ul>
          {model.recommendedActions.map((action) => <li key={action}>{action}</li>)}
        </ul>
      </article>
    </section>
  );
}
