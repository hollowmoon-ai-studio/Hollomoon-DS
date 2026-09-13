import React from 'react';
import { HeroSection } from '../sections/HeroSection';
import { ServicesOverview } from '../sections/ServicesOverview';
import { HollowmoonOSBlueprint } from '../sections/HollowmoonOSBlueprint';
import { LiveTelemetryInfographic } from '../sections/LiveTelemetryInfographic';
import { RoiCalculator } from '../sections/RoiCalculator';
import { BenchmarkRadarInfographic } from '../sections/BenchmarkRadarInfographic';
import { FeaturedCaseStudies } from '../sections/FeaturedCaseStudies';
import { LeadCaptureSection } from '../sections/LeadCaptureSection';
import { Language } from '../../types';

interface HomePageProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, lang }) => {
  return (
    <div className="space-y-0">
      <HeroSection onNavigate={onNavigate} lang={lang} />
      <ServicesOverview onNavigate={onNavigate} lang={lang} />
      <HollowmoonOSBlueprint onNavigate={onNavigate} lang={lang} />
      <LiveTelemetryInfographic lang={lang} />
      <RoiCalculator onNavigate={onNavigate} lang={lang} />
      <BenchmarkRadarInfographic lang={lang} />
      <FeaturedCaseStudies onNavigate={onNavigate} lang={lang} />
      <LeadCaptureSection onNavigate={onNavigate} lang={lang} />
    </div>
  );
};
