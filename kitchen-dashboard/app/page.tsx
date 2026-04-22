'use client';

import { useKitchenOrders } from '../src/hooks/useKitchenOrders';

function shortCode(orderId: string): string {
  return orderId.slice(-6).toUpperCase();
}

export default function KitchenPage() {
  const { isConnected, preparingOrders } = useKitchenOrders();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col p-6 md:p-10">
      <header className="mb-8 flex items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 shadow-xl backdrop-blur">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Delivery System App</p>
          <h1 className="text-2xl font-black text-ink md:text-3xl">Pantalla de Cocina</h1>
        </div>
        <div
          className={`rounded-full px-4 py-2 text-sm font-bold ${
            isConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
          }`}
        >
          {isConnected ? 'Socket conectado' : 'Socket desconectado'}
        </div>
      </header>

      <section className="rounded-3xl border border-orange-500/40 bg-slate-900/80 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold uppercase tracking-wide text-accent">En Preparacion</h2>
          <span className="rounded-md bg-orange-500/20 px-3 py-1 text-sm font-semibold text-orange-300">
            {preparingOrders.length} pedidos
          </span>
        </div>

        {preparingOrders.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
            Esperando nuevos pedidos por WebSocket...
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {preparingOrders.map((order) => (
              <li key={order.id} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Codigo pedido</p>
                    <p className="text-3xl font-black text-orange-300">#{shortCode(order.id)}</p>
                  </div>
                  <span className="rounded-md bg-orange-500/15 px-2 py-1 text-xs font-bold text-orange-200">
                    PREPARING
                  </span>
                </div>

                <ul className="space-y-2 text-sm text-slate-200">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3 border-b border-slate-800 pb-1">
                      <span className="truncate">{item.product.name}</span>
                      <span className="font-bold">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
