import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await readSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const dealId = Number(id);
    const body = await request.json();
    const stageId = Number(body.stageId);

    if (!dealId || !stageId) {
      return NextResponse.json({ error: "Invalid dealId or stageId." }, { status: 400 });
    }

    const stage = await query<{ id: number }>("SELECT id FROM pipeline_stages WHERE id = $1 LIMIT 1", [
      stageId,
    ]);

    if (!stage[0]) {
      return NextResponse.json({ error: "Stage not found." }, { status: 404 });
    }

    const updated = await query<{ id: number; stage_id: number }>(
      "UPDATE deals SET stage_id = $1 WHERE id = $2 RETURNING id, stage_id",
      [stageId, dealId]
    );

    if (!updated[0]) {
      return NextResponse.json({ error: "Deal not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, deal: updated[0] });
  } catch (error) {
    console.error("Move deal error:", error);
    return NextResponse.json({ error: "Failed to move deal." }, { status: 500 });
  }
}
