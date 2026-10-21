import React from 'react';
import { ArrowDownRight, ArrowRight, MapPin, Sprout } from 'lucide-react';
import type { ProductCategory } from '../types';

interface HeroProps {
  onExploreClick: () => void;
  onPostRFQClick: () => void;
  onCategorySelect: (cat: ProductCategory) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onPostRFQClick, onCategorySelect }) => (
  <section className="launch-hero">
    <div className="launch-hero-media">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=85"
      >
        <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
      </video>
      <div className="launch-hero-overlay" />
      <div className="launch-hero-brand">AGRIFLOW</div>
      <div className="launch-hero-kicker">CAMEROON / FARM TO MARKET / 2026</div>
      <div className="launch-hero-product-label">
        <span>Fresh from Penja</span>
        <strong>Move the harvest.</strong>
      </div>
      <button className="launch-hero-corner" type="button" onClick={onExploreClick} aria-label="Explore marketplace">
        <ArrowDownRight size={22} />
      </button>
    </div>

    <div className="launch-hero-intro">
      <div>
        <span className="eyebrow"><Sprout size={14} /> Cameroon’s agricultural exchange</span>
        <h1>From Cameroon’s soil<br /><em>to the world.</em></h1>
      </div>
      <div className="launch-hero-copy">
        <p>Discover real produce from family farms and cooperatives across Penja, Foumbot, Buea and beyond. Built for buyers who want provenance, not promises.</p>
        <div className="launch-hero-actions">
          <button className="lime-button" type="button" onClick={onExploreClick}>Explore harvest <ArrowRight size={16} /></button>
          <button className="text-button" type="button" onClick={onPostRFQClick}>Post a wholesale request</button>
        </div>
      </div>
    </div>

    <div className="launch-hero-grid">
      <button className="launch-feature launch-feature-image" type="button" onClick={() => onCategorySelect('vegetables')}>
        <img src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=1000&q=85" alt="Fresh vegetables from a Cameroon farm" />
        <span>01 / Fresh harvest</span>
      </button>
      <div className="launch-feature launch-feature-copy">
        <span className="eyebrow">Traceable by design</span>
        <h2>Know the farm.<br /><em>Trust the route.</em></h2>
        <p>See supplier details, growing practices, availability and delivery coverage before you buy.</p>
        <button className="arrow-link" type="button" onClick={() => onCategorySelect('all')}>Browse the catalog <ArrowRight size={16} /></button>
      </div>
      <div className="launch-feature launch-feature-note">
        <MapPin size={18} />
        <strong>Douala → Yaoundé</strong>
        <span>Regional trade routes</span>
        <small>Penja pepper / plantain / cocoa / ginger</small>
      </div>
    </div>

    <div className="launch-hero-footer">
      <span>Scroll to discover</span>
      <span>Real records only <span className="lime-dot" /></span>
      <span>Wholesale & retail</span>
    </div>
  </section>
);
