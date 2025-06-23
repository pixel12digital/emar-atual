import "dotenv/config";
import postgres from "postgres";

// verificar se a url do banco está definida
if (!process.env.DATABASE_URL) {
  console.error("❌ variável de ambiente DATABASE_URL não está definida");
  console.log(
    "💡 certifique-se de ter um arquivo .env com sua string de conexão do banco",
  );
  process.exit(1);
}

console.log("🔍 testando conexão com banco de dados...");
console.log(`📡 url do banco: ${process.env.DATABASE_URL.substring(0, 20)}...`);

async function testConnection() {
  let conn: null | postgres.Sql = null;

  try {
    // criar conexão
    conn = postgres(process.env.DATABASE_URL!, {
      max: 1, // usar apenas uma conexão para teste
      ssl: { rejectUnauthorized: false },
    });

    // testar conexão básica
    console.log("🔄 testando conexão básica...");
    const result = await conn`SELECT 1 as test`;
    console.log("✅ conexão básica bem-sucedida:", result[0]);

    // testar acesso ao schema
    console.log("🔄 testando acesso ao schema...");
    const schemaResult = await conn`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'emar_perfumaria'
    `;

    if (schemaResult.length > 0) {
      console.log("✅ schema 'emar_perfumaria' encontrado");
    } else {
      console.log("⚠️ schema 'emar_perfumaria' não encontrado");
    }

    // testar acesso às tabelas
    console.log("🔄 testando acesso às tabelas...");
    const tableResult = await conn`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'emar_perfumaria'
      LIMIT 5
    `;

    if (tableResult.length > 0) {
      console.log(
        "✅ tabelas encontradas no schema:",
        tableResult.map((t) => t.table_name),
      );
    } else {
      console.log("⚠️ nenhuma tabela encontrada no schema 'emar_perfumaria'");
    }

    console.log(
      "🎉 teste de conexão com banco de dados concluído com sucesso!",
    );
  } catch (error) {
    console.error("❌ falha na conexão com o banco de dados:");
    console.error(error);

    if (error instanceof Error) {
      // fornecer mensagens de erro úteis
      if (error.message.includes("ECONNREFUSED")) {
        console.log("💡 dica: verifique se o servidor do banco está rodando");
      } else if (error.message.includes("authentication")) {
        console.log("💡 dica: verifique suas credenciais do banco");
      } else if (error.message.includes("does not exist")) {
        console.log("💡 dica: verifique se o banco existe");
      } else if (error.message.includes("SSL")) {
        console.log("💡 dica: verifique sua configuração SSL");
      } else if (error.message.includes("ENOTFOUND")) {
        console.log(
          "💡 dica: verifique sua conexão com internet e nome do host",
        );
        console.log("💡 dica: verifique se a DATABASE_URL está correta");
      }
    }

    process.exit(1);
  } finally {
    // fechar conexão
    if (conn) {
      await conn.end();
      console.log("🔌 conexão fechada");
    }
  }
}

// executar o teste
testConnection();
