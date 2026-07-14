import { absolutePublicUrl, PUBLIC_CONTENT_UPDATED_AT } from './config';
import { getPublicArchive, getPublicAuthor, getPublicChapters } from './contentService';

export async function llmsIndex(): Promise<string> {
  const chapters = (await getPublicChapters('en')).filter((chapter) => chapter.visibility === 'publicFull');
  return `# SYNTHOMA

> Czech glitch-noir interactive book, archive and deterministic narrative card game. Public AI access includes free chapters, public Archive records, Author information, public Cyklus cards and a stateless gameplay API.

## Start
- [AI overview](${absolutePublicUrl('/ai/en/index.md')})
- [Human homepage](${absolutePublicUrl('/')})

## Free book
- [Book index](${absolutePublicUrl('/ai/en/books/synthoma-null.md')})
${chapters.map((chapter) => `- [${chapter.title}](${absolutePublicUrl(`/ai/en/chapters/${chapter.id}.md`)})`).join('\n')}

## Archive
- [Public Archive Markdown](${absolutePublicUrl('/ai/en/archive.md')})
- [Archive JSON API](${absolutePublicUrl('/api/public/v1/archive?locale=en')})

## Author
- [Author Markdown](${absolutePublicUrl('/ai/en/author.md')})
- [Author page](${absolutePublicUrl('/autor')})

## Cyklus cards
- [Card catalog](${absolutePublicUrl('/cards')})
- [Card JSON API](${absolutePublicUrl('/api/public/v1/cards?locale=en')})

## Play Cyklus
- [Rules](${absolutePublicUrl('/api/public/v1/cyklus/rules?locale=en')})
- [API docs](${absolutePublicUrl('/ai/api')})
- [OpenAPI](${absolutePublicUrl('/api/public/openapi.json')})

## Languages
- [Czech index](${absolutePublicUrl('/ai/cs/index.md')})
- [English index](${absolutePublicUrl('/ai/en/index.md')})

## Usage
- [AI access policy](${absolutePublicUrl('/ai-policy')})
- Cite SYNTHOMA, the content title, stable ID and canonical URL.
`;
}

export async function llmsFull(): Promise<string> {
  const [author, chapters] = await Promise.all([getPublicAuthor('en'), getPublicChapters('en')]);
  const archive = getPublicArchive('en');
  const freeChapters = chapters.filter((chapter) => chapter.visibility === 'publicFull');
  const publicArchive = archive.filter((entry) => entry.visibility === 'publicFull');
  return `# SYNTHOMA public corpus

- Updated: ${PUBLIC_CONTENT_UPDATED_AT}
- Canonical: ${absolutePublicUrl('/')}
- Scope: public material only; paid chapters, private data and user whispers are excluded.

## Author

${author.markdown}

## Free chapters

${freeChapters.map((chapter) => `### ${chapter.title}\n\nID: \`${chapter.id}\`\n\n${chapter.markdown ?? ''}`).join('\n\n')}

## Public Archive

${publicArchive.map((entry) => `### ${entry.title}\n\nID: \`${entry.id}\`\n\n${entry.quote ? `> ${entry.quote}\n\n` : ''}${entry.body.join('\n\n')}`).join('\n\n')}

## Cyklus

Public card catalog: ${absolutePublicUrl('/cards')}

Rules and stateless agent API: ${absolutePublicUrl('/api/public/v1/cyklus/rules?locale=en')}
`;
}
