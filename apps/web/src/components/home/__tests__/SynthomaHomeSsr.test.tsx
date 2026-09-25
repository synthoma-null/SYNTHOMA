/** @jest-environment node */

import { renderToStaticMarkup } from 'react-dom/server';
import SynthomaHome from '../SynthomaHome';
import { LangProvider } from '../../../lib/LangContext';

jest.mock('next-auth/react', () => ({ useSession: () => ({ data: null, status: 'unauthenticated' }) }));

describe('Synthoma Home server HTML', () => {
  it('leaves canonical legal links to the global shell footer', () => {
    const html = renderToStaticMarkup(<SynthomaHome />);

    expect(html.match(/<footer\b/g)).toBeNull();
    expect(html).not.toContain('synthoma-home__legal');
    expect(html).not.toContain('SUBJECT_CONTACT');
    expect(html).not.toContain('SPOUSTIT');
    expect(html).toContain('SPUSTIT');
  });

  it('explains the project and exposes all guest entry paths before secondary auth', () => {
    const html = renderToStaticMarkup(<SynthomaHome />);
    const descriptor = 'SYNTHOMA je interaktivní psychologický román, diagnostická karetní hra a živý archiv uvnitř rozbitého terapeutického systému.';

    expect(html).toContain(descriptor);
    expect(html).toContain('Tma nikdy není opravdová, je jen světlem, které se vzdalo smyslu.');
    expect(html).not.toContain('href="/landing-intro?replay=1"');
    expect(html).toContain('href="/chapter/0-inf-restart"');
    expect(html).toContain('href="/cyklus"');
    expect(html).toContain('href="/archive"');
    expect(html).toContain('Bez registrace');
    expect(html.indexOf('href="/chapter/0-inf-restart"')).toBeLessThan(html.indexOf('href="/login"'));
    expect(html.split('href="/archive"')).toHaveLength(2);
    expect(html).not.toContain('Comet');
    expect(html).not.toContain('Reader surface opacity');
  });

  it('renders the complete English first-contact contract without JavaScript', () => {
    const html = renderToStaticMarkup(<LangProvider initialLang="en"><SynthomaHome /></LangProvider>);

    expect(html).toContain('SYNTHOMA is an interactive psychological novel, a diagnostic card game, and a living archive inside a broken therapeutic system.');
    expect(html).toContain('Start reading for free');
    expect(html).toContain('CYKLUS');
    expect(html).toContain('ARCHIVE');
    expect(html).toContain('No account required');
    expect(html).toContain('href="/chapter/0-inf-restart?locale=en"');
  });

  it('keeps one accessible copy of the motto after the reading action', () => {
    const html = renderToStaticMarkup(<SynthomaHome />);
    const motto = 'Tma nikdy není opravdová, je jen světlem, které se vzdalo smyslu.';
    expect(html.split(motto)).toHaveLength(2);
    expect(html.indexOf('href="/chapter/0-inf-restart"')).toBeLessThan(html.indexOf(motto));
    expect(html).toContain('data-animated="false"');
  });});
