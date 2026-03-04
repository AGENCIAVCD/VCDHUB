"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Stage = {
  id: number;
  name: string;
  order: number;
};

type Deal = {
  id: number;
  stage_id: number;
  contact_id: number;
  contact_name: string;
  phone: string;
  created_at: string;
};

type PipelineBoardProps = {
  stages: Stage[];
  deals: Deal[];
};

export function PipelineBoard({ stages, deals }: PipelineBoardProps) {
  const router = useRouter();
  const [localDeals, setLocalDeals] = useState(deals);
  const [draggingDealId, setDraggingDealId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const grouped = useMemo(() => {
    return stages.map((stage) => ({
      ...stage,
      deals: localDeals.filter((deal) => deal.stage_id === stage.id),
    }));
  }, [stages, localDeals]);

  async function moveDeal(dealId: number, stageId: number) {
    const previous = localDeals;
    setError(null);

    setLocalDeals((current) =>
      current.map((deal) => (deal.id === dealId ? { ...deal, stage_id: stageId } : deal))
    );

    try {
      const response = await fetch(`/api/deals/${dealId}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao mover deal.");
      }

      router.refresh();
    } catch (moveError) {
      setLocalDeals(previous);
      setError(moveError instanceof Error ? moveError.message : "Falha ao mover deal.");
    }
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        {grouped.map((stage) => (
          <section
            key={stage.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={async () => {
              if (!draggingDealId) return;
              await moveDeal(draggingDealId, stage.id);
              setDraggingDealId(null);
            }}
            className="vcd-card min-h-72 p-4"
          >
            <header className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-[0.08em] text-white">{stage.name}</h3>
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-xs text-amber-300">
                {stage.deals.length}
              </span>
            </header>

            <div className="space-y-2">
              {stage.deals.map((deal) => (
                <article
                  key={deal.id}
                  draggable
                  onDragStart={() => setDraggingDealId(deal.id)}
                  className="cursor-grab rounded-xl border border-white/10 bg-black/20 p-3 transition hover:border-amber-300/40 active:cursor-grabbing"
                >
                  <Link href={`/contact/${deal.contact_id}`} className="block text-sm font-semibold text-white">
                    {deal.contact_name}
                  </Link>
                  <p className="vcd-muted text-xs">{deal.phone}</p>
                </article>
              ))}

              {stage.deals.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/20 p-4 text-center text-xs text-white/55">
                  Solte um card aqui
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
