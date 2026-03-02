import { AppShell } from "@/components/AppShell";
import { PipelineBoard } from "@/components/PipelineBoard";
import { requireAuth } from "@/lib/auth";
import { getPipelineData } from "@/lib/crm";

export default async function PipelinePage() {
  await requireAuth();
  const { stages, deals } = await getPipelineData();

  return (
    <AppShell title="Funil" subtitle="Arraste e solte cards entre as etapas">
      {stages.length === 0 ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Nenhuma etapa cadastrada. Rode o SQL de setup para inserir `pipeline_stages`.
        </div>
      ) : (
        <PipelineBoard stages={stages} deals={deals} />
      )}
    </AppShell>
  );
}
