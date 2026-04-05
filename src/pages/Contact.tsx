import React from 'react';

const HELLO_EMAIL = 'hello@adhdsquirrelshop.com';
const SUPPORT_EMAIL = 'support@adhdsquirrelshop.com';

export default function Contact() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <header className="max-w-3xl">
          <p className="font-headline text-xs font-black uppercase tracking-[0.35em] text-secondary-container">
            CONTACT // HUMAN ENOUGH
          </p>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter leading-[0.9] md:text-7xl">
            CONTACT US.
            <span className="block text-primary-container">USE THE RIGHT DOOR.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-outline md:text-lg">
            General questions do not need to go through support. Order problems do not need to go through the front door.
          </p>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section className="rounded-[2rem] border border-primary-container/20 bg-surface-container-low px-6 py-7">
            <p className="font-headline text-xs font-black uppercase tracking-[0.35em] text-secondary-container">
              GENERAL
            </p>
            <h2 className="mt-4 font-headline text-3xl font-black uppercase tracking-tight">
              Hello.
            </h2>
            <p className="mt-3 text-outline leading-relaxed">
              Press, collabs, brand questions, or anything that does not involve a live order.
            </p>
            <a
              href={`mailto:${HELLO_EMAIL}`}
              className="mt-6 inline-flex rounded-full border border-primary-container/30 bg-primary px-5 py-3 font-headline text-xs font-black uppercase tracking-[0.22em] text-black transition-colors hover:bg-secondary-container"
            >
              {HELLO_EMAIL}
            </a>
          </section>

          <section className="rounded-[2rem] border border-primary-container/20 bg-surface-container-low px-6 py-7">
            <p className="font-headline text-xs font-black uppercase tracking-[0.35em] text-secondary-container">
              SUPPORT
            </p>
            <h2 className="mt-4 font-headline text-3xl font-black uppercase tracking-tight">
              Orders.
            </h2>
            <p className="mt-3 text-outline leading-relaxed">
              Shipping problems, damaged items, wrong item, wrong print, or anything tied to an actual order.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-6 inline-flex rounded-full border border-primary-container/30 bg-primary px-5 py-3 font-headline text-xs font-black uppercase tracking-[0.22em] text-black transition-colors hover:bg-secondary-container"
            >
              {SUPPORT_EMAIL}
            </a>
          </section>
        </div>

        <section className="mt-10 border-l-2 border-primary-container/30 pl-6">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tight">If It Is About An Order</h2>
          <p className="mt-3 max-w-3xl text-outline leading-relaxed">
            Include the order number, what went wrong, and clear photos if the issue is visual. That removes a full round trip of avoidable email.
          </p>
        </section>
      </div>
    </div>
  );
}
