import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/10 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div>
          <Link to="/" className="text-4xl font-black text-primary-container mb-4 font-headline uppercase italic tracking-tighter">
            ADHD SQUIRREL
          </Link>
          <p className="text-sm text-outline max-w-xs font-medium leading-relaxed uppercase tracking-tighter">
            Built somewhere between STRUCTURE AND CHAOS.<br />
            Nothing here is random.<br />
            It just looks that way.
          </p>
          <div className="flex gap-6 mt-8">
            {['Instagram', 'TikTok', 'Newsletter'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-primary-container hover:text-primary transition-all hover:translate-x-1 duration-300 font-headline text-xs font-bold uppercase tracking-widest"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-12">
          <div className="text-left md:text-right">
            <h5 className="font-headline text-primary uppercase font-black tracking-widest text-xs mb-4">NAVIGATE CHAOS</h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-outline hover:text-secondary-container transition-colors font-headline font-bold text-xs uppercase">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-outline hover:text-secondary-container transition-colors font-headline font-bold text-xs uppercase">
                  Return Portal
                </a>
              </li>
              <li>
                <Link to="/manifesto" className="text-outline hover:text-secondary-container transition-colors font-headline font-bold text-xs uppercase">
                  The Manifesto
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-xs font-black tracking-widest text-outline font-headline">
            © 2024 ADHD SQUIRREL - CONTROLLED NOISE.
          </div>
        </div>
      </div>
    </footer>
  );
}
