import SynthomaMediaLayer from '../synthoma-os/SynthomaMediaLayer';
import { SYNTHOMA_ASSETS } from '../../lib/brandAssets';

export default function HomeBackground() {
  return (
    <SynthomaMediaLayer src="/video/SYNTHOMA32.webm" poster={SYNTHOMA_ASSETS.background} className="synthoma-home__background">
      <img className="synthoma-media-layer__brand-art" src={SYNTHOMA_ASSETS.circle} alt="" />
      <img className="synthoma-media-layer__brand-art synthoma-media-layer__brand-art--title" src={SYNTHOMA_ASSETS.title} alt="" />
    </SynthomaMediaLayer>
  );
}
