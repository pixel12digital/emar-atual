import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// verificar se a url do banco está definida
if (!process.env.DATABASE_URL) {
  console.error("❌ variável de ambiente DATABASE_URL não está definida");
  console.log(
    "💡 certifique-se de ter um arquivo .env com sua string de conexão do banco",
  );
  process.exit(1);
}

console.log("🔍 teste completo de conexão com banco de dados...");
console.log(`📡 url do banco: ${process.env.DATABASE_URL.substring(0, 30)}...`);

async function testComprehensiveConnection() {
  let conn: null | postgres.Sql = null;

  try {
    // teste 1: conexão básica postgres
    console.log("\n🔄 teste 1: conexão básica postgres...");
    conn = postgres(process.env.DATABASE_URL!, {
      max: 1,
      ssl: { rejectUnauthorized: false },
    });

    const result = await conn`SELECT 1 as test`;
    console.log("✅ conexão básica bem-sucedida:", result[0]);

    // teste 2: conexão drizzle
    console.log("\n🔄 teste 2: conexão drizzle...");
    drizzle(conn, {
      logger: false, // desabilitar logging para teste
    });
    console.log("✅ instância drizzle criada com sucesso");

    // teste 3: acesso ao schema
    console.log("\n🔄 teste 3: acesso ao schema...");
    const schemaResult = await conn`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'emar_perfumaria'
    `;

    if (schemaResult.length > 0) {
      console.log("✅ schema 'emar_perfumaria' encontrado");
    } else {
      console.log("⚠️ schema 'emar_perfumaria' não encontrado");
      console.log("💡 você pode precisar executar: npm run db:push");
    }

    // teste 4: acesso às tabelas
    console.log("\n🔄 teste 4: acesso às tabelas...");
    const tableResult = await conn`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'emar_perfumaria'
      ORDER BY table_name
    `;

    if (tableResult.length > 0) {
      console.log("✅ tabelas encontradas no schema:");
      for (const t of tableResult) {
        console.log(`   - ${t.table_name}`);
      }
    } else {
      console.log("⚠️ nenhuma tabela encontrada no schema 'emar_perfumaria'");
      console.log("💡 você pode precisar executar: npm run db:push");
    }

    // teste 5: configuração drizzle-kit
    console.log("\n🔄 teste 5: configuração drizzle-kit...");
    try {
      await import("drizzle-kit");
      console.log("✅ drizzle-kit está configurado corretamente");
    } catch (error) {
      console.log("⚠️ problema na configuração do drizzle-kit:", error);
    }

    console.log("\n🎉 teste completo do banco de dados concluído com sucesso!");
  } catch (error) {
    console.error("\n❌ falha na conexão com o banco de dados:");
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
      console.log("\n🔌 conexão fechada");
    }
  }
}

// executar o teste
testComprehensiveConnection();
