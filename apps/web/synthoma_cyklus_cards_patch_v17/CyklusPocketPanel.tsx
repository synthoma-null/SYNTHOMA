import type { CyklusRunState } from './cyklusTypes';
import type { SubjectProgression, PocketProgressionUiModel, CraftRecipeUiRow } from './cyklusProgression';
import { getPocketProgressionUiModel } from './cyklusProgression';

type Props = {
  progression: SubjectProgression;
  state?: CyklusRunState | null;
  title?: string;
  compact?: boolean;
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function renderRecipeStatus(recipe: CraftRecipeUiRow): string {
  switch (recipe.status) {
    case 'crafted': return 'vyrobeno';
    case 'craftable': return 'lze vyrobit';
    case 'locked': return 'zamčeno';
    case 'hidden': return 'skryto';
    default: return recipe.status;
  }
}

function renderCost(recipe: CraftRecipeUiRow): string {
  if (recipe.cost.length === 0) return 'bez ceny, což je v SYNTHOMĚ podezřelé';
  return recipe.cost.map((c) => `${c.label} ${c.owned}/${c.amount}`).join(' · ');
}

export function CyklusPocketPanel({ progression, state = null, title = 'Kapsa / Kapesní oltář', compact = false }: Props) {
  const model: PocketProgressionUiModel = getPocketProgressionUiModel(progression, state);
  const visibleRecipes = compact ? model.pocketRecipes.slice(0, 3) : model.pocketRecipes;
  const visibleItems = state ? model.carriedItems : model.knownItems;

  return (
    <section className={cx('cyklus-pocket-panel', compact && 'is-compact')} aria-label={title}>
      <header className="cyklus-panel-header">
        <div>
          <p className="cyklus-panel-kicker">POCKET_ECOLOGY</p>
          <h2>{title}</h2>
        </div>
        <div className={cx('void-room-badge', model.room.status === 'available' && 'is-available', model.room.status === 'maxed' && 'is-maxed')}>
          Oltář {model.room.level}/{model.room.maxLevel}
        </div>
      </header>

      <p className="pocket-ambient-text">{model.ambientText ?? model.ambientNote}</p>

      {model.moodSummary.length > 0 && (
        <div className="item-mood-strip" aria-label="Nálady předmětů v kapse">
          {model.moodSummary.map((row) => (
            <span key={row.mood} className={cx('item-mood-pill', row.className)}>
              {row.label}: {row.count}
            </span>
          ))}
        </div>
      )}

      <div className="cyklus-pocket-grid">
        <div className="cyklus-pocket-column">
          <h3>{state ? 'Nesené předměty' : 'Objevené předměty'}</h3>
          {visibleItems.length === 0 ? (
            <p className="cyklus-empty-note">Kapsa je prázdná. V SYNTHOMĚ je i tohle podezřelé, jen zatím levné.</p>
          ) : (
            <ul className="pocket-item-list">
              {visibleItems.map((item) => (
                <li key={item.id} className="pocket-item-row">
                  <div className="pocket-item-titleline">
                    <strong>{item.title}</strong>
                    {item.mood && <span className={cx('item-mood-pill', item.moodClassName)}>{item.moodLabel}</span>}
                  </div>
                  <p>{item.description}</p>
                  {item.resonancePools.length > 0 && (
                    <small>Rezonance: {item.resonancePools.slice(0, 4).join(' · ')}</small>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cyklus-pocket-column">
          <h3>Kapesní recepty</h3>
          {visibleRecipes.length === 0 ? (
            <p className="cyklus-empty-note">Žádný kapesní recept není vidět. Buď klid. Systém jen čeká, až něco rozbiješ použitelněji.</p>
          ) : (
            <ul className="craft-recipe-list">
              {visibleRecipes.map((recipe) => (
                <li key={recipe.id} className={cx('craft-recipe-row', `is-${recipe.status}`)}>
                  <div className="pocket-item-titleline">
                    <strong>{recipe.title}</strong>
                    <span className="craft-status-pill">{renderRecipeStatus(recipe)}</span>
                  </div>
                  <p>{recipe.description}</p>
                  <small>Výsledek: {recipe.resultTitle}</small>
                  <small>Cena: {renderCost(recipe)}</small>
                  {!compact && recipe.missingReasons.length > 0 && (
                    <ul className="missing-reason-list">
                      {recipe.missingReasons.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="cyklus-suggestion-box">
        <h3>Doporučení systému</h3>
        <ul>
          {model.suggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}
        </ul>
      </div>
    </section>
  );
}
