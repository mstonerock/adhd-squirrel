import React from 'react';

export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6">
        <header className="max-w-2xl">
          <p className="font-headline text-xs font-black uppercase tracking-[0.35em] text-secondary-container">
            POLICY // RETURNS
          </p>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter leading-[0.9] md:text-7xl">
            RETURNS.
            <span className="block text-primary-container">NO MYSTERY.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-outline md:text-lg">
            This store is set up around made-to-order apparel, so the return policy needs to be honest about that instead of pretending everything is warehouse stock.
          </p>
        </header>

        <div className="mt-12 space-y-10">
          <section className="border-l-2 border-primary-container/30 pl-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight">Made-To-Order Items</h2>
            <p className="mt-3 max-w-3xl text-outline leading-relaxed">
              Because these products are made to order, returns or exchanges for buyer&apos;s remorse, preference changes, or ordering the wrong size are not guaranteed. Use the size guide before ordering.
            </p>
          </section>

          <section className="border-l-2 border-primary-container/30 pl-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight">If Something Is Wrong</h2>
            <p className="mt-3 max-w-3xl text-outline leading-relaxed">
              If the order arrives misprinted, damaged, or as the wrong item, contact the store within 14 days of delivery. Include the order information and clear photos so the issue can be reviewed fast.
            </p>
          </section>

          <section className="border-l-2 border-primary-container/30 pl-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight">Resolution</h2>
            <p className="mt-3 max-w-3xl text-outline leading-relaxed">
              If the issue is verified, the usual fix is a replacement or refund, depending on what makes the most sense for the order.
            </p>
          </section>

          <section className="border-l-2 border-primary-container/30 pl-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight">Order Changes</h2>
            <p className="mt-3 max-w-3xl text-outline leading-relaxed">
              If you need to change or cancel an order, do it as quickly as possible. Once production has started, there may not be a clean way to stop it.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
