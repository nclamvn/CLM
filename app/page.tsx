import type { Metadata } from 'next';
import { NavDark } from '@/components/dark/NavDark';
import { HeroDark } from '@/components/dark/HeroDark';
import { TapeDark } from '@/components/dark/TapeDark';
import { MetricsBand } from '@/components/dark/MetricsBand';
import { PipelineDark } from '@/components/dark/PipelineDark';
import { MatrixHeatmap } from '@/components/dark/MatrixHeatmap';
import { ProvenanceGraph } from '@/components/dark/ProvenanceGraph';
import { InterpChart } from '@/components/dark/InterpChart';
import { PillarsDark } from '@/components/dark/PillarsDark';
import { VerticalsDark } from '@/components/dark/VerticalsDark';
import { CTADark } from '@/components/dark/CTADark';
import { FooterDark } from '@/components/dark/FooterDark';
import { dk } from '@/lib/content';
import '@/styles/touch-landing.css';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/** Dau section: tag mono do + h2 (focal nghieng) + lead. */
function SecHead({
  tag,
  pre,
  em,
  tail,
  lead,
}: {
  tag: string;
  pre: string;
  em: string;
  tail: string;
  lead?: string;
}) {
  return (
    <div className="lp-sec-head">
      <span className="lp-sec-head__tag">{tag}</span>
      <h2 className="lp-sec-head__h2">
        {pre}
        <span className="is-accent">{em}</span>
        {tail}
      </h2>
      {lead ? <p className="lp-sec-head__lead">{lead}</p> : null}
    </div>
  );
}

/** Landing toi (control-room, huong C): 9 khoi, moi visual la mot component. */
export default function LandingPage() {
  return (
    <div className="dk">
      <div className="dk-grid-tex" aria-hidden="true" />
      <NavDark />
      <main id="main">
        <HeroDark />
        <TapeDark />
        <MetricsBand />

        <section className="lp-sec" id="pipeline">
          <div className="portal-container">
            <SecHead
              tag={dk.pipeline.tag}
              pre={dk.pipeline.h2pre}
              em={dk.pipeline.h2em}
              tail={dk.pipeline.h2tail}
              lead={dk.pipeline.lead}
            />
            <div className="lp-board surface-executive">
              <PipelineDark />
              <div className="lp-board__divider" aria-hidden="true" />
              <MatrixHeatmap />
              <p className="lp-board__note">Dùng để minh họa kiến trúc engine. Không phải kết quả matching thật.</p>
            </div>
          </div>
        </section>

        <section className="lp-sec" id="data">
          <div className="portal-container">
            <SecHead
              tag={dk.data.tag}
              pre={dk.data.h2pre}
              em={dk.data.h2em}
              tail={dk.data.h2tail}
              lead={dk.data.lead}
            />
            <div className="lp-pi-grid">
              <ProvenanceGraph />
              <InterpChart />
            </div>
            <p className="lp-mod-note">Cả hai là ví dụ minh họa kiến trúc dữ liệu. Không phải match hay dự báo thật.</p>
          </div>
        </section>

        <section className="lp-sec" id="why">
          <div className="portal-container">
            <SecHead
              tag={dk.pillars.tag}
              pre={dk.pillars.h2pre}
              em={dk.pillars.h2em}
              tail={dk.pillars.h2tail}
            />
            <PillarsDark />
          </div>
        </section>

        <section className="lp-sec" id="vertical">
          <div className="portal-container">
            <SecHead
              tag={dk.vertical.tag}
              pre={dk.vertical.h2pre}
              em={dk.vertical.h2em}
              tail={dk.vertical.h2tail}
            />
            <VerticalsDark />
          </div>
        </section>

        <CTADark />
      </main>
      <FooterDark />
    </div>
  );
}
