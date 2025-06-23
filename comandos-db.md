# 🖥️ comandos para testar conexão com banco de dados

## comandos disponíveis

### 1. 🎯 teste básico (recomendado)

```bash
npm run db:test
```

- script em javascript puro
- cores no terminal
- mensagens em português
- teste completo de conexão

### 2. ⚡ teste simples

```bash
npm run db:test-simple
```

- teste rápido de conexão
- menos detalhes
- ideal para verificação rápida

### 3. 🔍 teste completo

```bash
npm run db:test-full
```

- teste mais detalhado
- inclui drizzle-kit
- mais informações de debug

### 4. 🌐 teste via api

```bash
# com curl
curl http://localhost:3000/api/test-db

# ou acesse no navegador
http://localhost:3000/test-db
```

### 5. 🖥️ teste via página web

abra no navegador: `http://localhost:3000/test-db`

## exemplos de uso

### teste básico

```bash
npm run db:test
```

**saída esperada:**

```
🔍 testando conexão com banco de dados...
📡 url: postgresql://postgres:XxHoUuJl...
🔄 criando conexão...
🔄 testando conexão básica...
✅ conexão básica bem-sucedida: {"test":1}
🔄 testando schema...
✅ schema 'emar_perfumaria' encontrado
🔄 testando tabelas...
✅ 5 tabelas encontradas:
   📋 account
   📋 session
   📋 user
   📋 verification
🎉 teste concluído com sucesso!
🔌 conexão fechada
```

### teste via curl

```bash
curl http://localhost:3000/api/test-db | jq
```

**saída esperada:**

```json
{
  "success": true,
  "message": "conexão com banco de dados bem-sucedida",
  "data": {
    "connection": "✅ conectado",
    "schema": "✅ encontrado",
    "tables": "✅ 5 tabelas",
    "tablesList": ["account", "session", "user", "verification"]
  }
}
```

## quando usar cada comando

| comando | quando usar |
|---------|-------------|
| `npm run db:test` | teste geral, desenvolvimento |
| `npm run db:test-simple` | verificação rápida |
| `npm run db:test-full` | debugging detalhado |
| `curl /api/test-db` | teste remoto, scripts |
| página web | interface visual, compartilhamento |

## troubleshooting

### erro: "ENOTFOUND"

```bash
# limpar cache dns
ipconfig /flushdns

# verificar internet
ping google.com
```

### erro: "authentication failed"

```bash
# verificar .env
cat .env | grep DATABASE_URL
```

### erro: "ECONNREFUSED"

```bash
# verificar se o servidor está rodando
npm run dev
```

## dicas

- **desenvolvimento:** use `npm run db:test`
- **produção:** use a api endpoint
- **debugging:** use `npm run db:test-full`
- **compartilhamento:** use a página web
- **scripts:** use curl ou a api

## próximos passos

1. **teste agora:** `npm run db:test`
2. **configure:** verifique seu arquivo `.env`
3. **deploy:** teste em produção
4. **monitore:** configure alertas
