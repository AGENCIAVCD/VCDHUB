import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await request.json();
    return NextResponse.json(
      {
        error:
          "Cadastro desativado. Use o usuário Bruno Ravaglia com a senha vcd123.",
      },
      { status: 403 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Failed to register." }, { status: 500 });
  }
}
