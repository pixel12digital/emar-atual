#!/usr/bin/env node

import "dotenv/config";
import postgres from "postgres";

// cores para o terminal
const colors = {
  blue: "\x1b[34m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  reset: "\x1b[0m",
  yellow: "\x1b[33m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  console.error(`${colors.red}${colors.bold}❌ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}${colors.bold}ℹ️  ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}${colors.bold}✅ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}${colors.bold}⚠️  ${message}${colors.reset}`);
}

// verificar se a url do banco está definida
if (!process.env.DATABASE_URL) {
  logError("DATABASE_URL não está configurada");
  logInfo(
    "certifique-se de ter um arquivo .env com sua string de conexão do banco",
  );
  process.exit(1);
}

log("🔍 testando conexão com banco de dados...", "blue");
log(`📡 url: ${process.env.DATABASE_URL.substring(0, 30)}...`, "blue");

async function testConnection() {
  let conn = null;

  try {
    // criar conexão
    log("🔄 criando conexão...", "blue");
    conn = postgres(process.env.DATABASE_URL, {
      max: 1,
      ssl: { rejectUnauthorized: false },
    });

    // testar conexão básica
    log("🔄 testando conexão básica...", "blue");
    const result = await conn`SELECT 1 as test`;
    logSuccess(`conexão básica bem-sucedida: ${JSON.stringify(result[0])}`);

    // testar schema
    log("🔄 testando schema...", "blue");
    const schemaResult = await conn`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'emar_perfumaria'
    `;

    if (schemaResult.length > 0) {
      logSuccess("schema 'emar_perfumaria' encontrado");
    } else {
      logWarning("schema 'emar_perfumaria' não encontrado");
      logInfo("execute: npm run db:push");
    }

    // testar tabelas
    log("🔄 testando tabelas...", "blue");
    const tableResult = await conn`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'emar_perfumaria'
      ORDER BY table_name
    `;

    if (tableResult.length > 0) {
      logSuccess(`${tableResult.length} tabelas encontradas:`);
      tableResult.forEach((t) => {
        console.log(`   📋 ${t.table_name}`);
      });
    } else {
      logWarning("nenhuma tabela encontrada no schema 'emar_perfumaria'");
      logInfo("execute: npm run db:push");
    }

    log("🎉 teste concluído com sucesso!", "green");
  } catch (error) {
    logError("falha na conexão com o banco de dados:");
    console.error(error);

    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        logInfo("dica: verifique se o servidor do banco está rodando");
      } else if (error.message.includes("authentication")) {
        logInfo("dica: verifique suas credenciais do banco");
      } else if (error.message.includes("does not exist")) {
        logInfo("dica: verifique se o banco existe");
      } else if (error.message.includes("SSL")) {
        logInfo("dica: verifique sua configuração SSL");
      } else if (error.message.includes("ENOTFOUND")) {
        logInfo("dica: verifique sua conexão com internet e nome do host");
        logInfo("dica: verifique se a DATABASE_URL está correta");
      }
    }

    process.exit(1);
  } finally {
    if (conn) {
      await conn.end();
      log("🔌 conexão fechada", "blue");
    }
  }
}

// executar o teste
testConnection();
