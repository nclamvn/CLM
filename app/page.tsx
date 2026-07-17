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
import { MatchCard } from '@/components/shared/MatchCard';
import { ViewSwitch } from '@/components/shared/ViewSwitch';
import { dk, demoMatch } from '@/lib/content';

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
    <div className="dk-sec-head">
      <span className="dk-sec-tag">{tag}</span>
      <h2>
        {pre}
        <em>{em}</em>
        {tail}
      </h2>
      {lead ? <p>{lead}</p> : null}
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

        <section className="dk-sec" id="pipeline">
          <div className="wrap">
            <SecHead
              tag={dk.pipeline.tag}
              pre={dk.pipeline.h2pre}
              em={dk.pipeline.h2em}
              tail={dk.pipeline.h2tail}
              lead={dk.pipeline.lead}
            />
            <PipelineDark />
          </div>
        </section>

        <section className="dk-sec" id="data">
          <div className="wrap">
            <SecHead
              tag={dk.data.tag}
              pre={dk.data.h2pre}
              em={dk.data.h2em}
              tail={dk.data.h2tail}
              lead={dk.data.lead}
            />
            <div className="dk-grid-2">
              <MatrixHeatmap />
              <ProvenanceGraph />
            </div>
          </div>
        </section>

        <section className="dk-sec" id="matching">
          <div className="wrap">
            <SecHead
              tag={dk.matching.tag}
              pre={dk.matching.h2pre}
              em={dk.matching.h2em}
              tail={dk.matching.h2tail}
              lead={dk.matching.lead}
            />
            <div className="dk-grid-2">
              <InterpChart />
              <MatchCard data={demoMatch} />
            </div>
          </div>
        </section>

        <section className="dk-sec" id="why">
          <div className="wrap">
            <SecHead
              tag={dk.pillars.tag}
              pre={dk.pillars.h2pre}
              em={dk.pillars.h2em}
              tail={dk.pillars.h2tail}
            />
            <PillarsDark />
          </div>
        </section>

        <section className="dk-sec" id="vertical">
          <div className="wrap">
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
      <ViewSwitch active="landing" fixed />
    </div>
  );
}
