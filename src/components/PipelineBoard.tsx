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
    <div className="space-y-3">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

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
            className="min-h-72 rounded-lg border border-slate-200 bg-white p-3"
          >
            <header className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">{stage.name}</h3>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                {stage.deals.length}
              </span>
            </header>

            <div className="space-y-2">
              {stage.deals.map((deal) => (
                <article
                  key={deal.id}
                  draggable
                  onDragStart={() => setDraggingDealId(deal.id)}
                  className="cursor-grab rounded-md border border-slate-200 bg-slate-50 p-3 active:cursor-grabbing"
                >
                  <Link href={`/contact/${deal.contact_id}`} className="block text-sm font-medium text-slate-900">
                    {deal.contact_name}
                  </Link>
                  <p className="text-xs text-slate-600">{deal.phone}</p>
                </article>
              ))}

              {stage.deals.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
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
