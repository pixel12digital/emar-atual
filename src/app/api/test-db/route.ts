import { NextResponse } from "next/server";
import postgres from "postgres";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        message: "DATABASE_URL não está configurada",
        success: false,
      },
      { status: 500 },
    );
  }

  let conn: null | postgres.Sql = null;

  try {
    // criar conexão
    conn = postgres(process.env.DATABASE_URL, {
      max: 1,
      ssl: { rejectUnauthorized: false },
    });

    // testar conexão básica
    const result = await conn`SELECT 1 as test`;

    // testar schema
    const schemaResult = await conn`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'emar_perfumaria'
    `;

    // testar tabelas
    const tableResult = await conn`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'emar_perfumaria'
      LIMIT 5
    `;

    return NextResponse.json({
      data: {
        connection: "✅ conectado",
        schema: schemaResult.length > 0 ? "✅ encontrado" : "⚠️ não encontrado",
        tables:
          tableResult.length > 0
            ? `✅ ${tableResult.length} tabelas`
            : "⚠️ nenhuma tabela",
        tablesList: tableResult.map((t: any) => t.table_name),
        testResult: result[0],
      },
      message: "conexão com banco de dados bem-sucedida",
      success: true,
    });
  } catch (error) {
    console.error("erro na conexão com banco:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "erro desconhecido",
        message: "falha na conexão com banco de dados",
        success: false,
      },
      { status: 500 },
    );
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}
