import React from 'react';

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6">
        <header className="max-w-2xl">
          <p className="font-headline text-xs font-black uppercase tracking-[0.35em] text-secondary-container">
            POLICY // SHIPPING
          </p>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter leading-[0.9] md:text-7xl">
            SHIPPING.
            <span className="block text-primary-container">CLEAR ENOUGH.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-outline md:text-lg">
            No surprise shipping charge games. The listed price already includes standard shipping for the orders this store is built to handle.
          </p>
        </header>

        <div className="mt-12 space-y-10">
          <section className="border-l-2 border-primary-container/30 pl-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight">Shipping Cost</h2>
            <p className="mt-3 max-w-3xl text-outline leading-relaxed">
              Standard shipping is already baked into the product price. If that changes later, the site copy needs to change with it. Until then, what you see is the shipped price.
            </p>
          </section>

          <section className="border-l-2 border-primary-container/30 pl-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight">Processing Time</h2>
            <p className="mt-3 max-w-3xl text-outline leading-relaxed">
              Most orders are made to order. Give production a few business days before shipment. During heavier periods, it can take longer. If something is clearly stuck, reach out.
            </p>
          </section>

          <section className="border-l-2 border-primary-container/30 pl-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight">Tracking</h2>
            <p className="mt-3 max-w-3xl text-outline leading-relaxed">
              Once the order ships, you should receive tracking through the checkout information tied to the order. If tracking looks wrong or never updates, contact the store and include your order details.
            </p>
          </section>

          <section className="border-l-2 border-primary-container/30 pl-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight">Address Problems</h2>
            <p className="mt-3 max-w-3xl text-outline leading-relaxed">
              Double-check the shipping address before placing the order. If you catch an address mistake quickly, send it right away. Once an order is in production or already shipped, changes get harder fast.
            </p>
          </section>

          <section className="border-l-2 border-primary-container/30 pl-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight">Missing Packages</h2>
            <p className="mt-3 max-w-3xl text-outline leading-relaxed">
              If a carrier marks a package as delivered but it is not there, check the obvious spots first and give it a short window in case the scan jumped early. If it still does not show up, contact the store with the order information.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
