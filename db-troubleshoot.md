# 🔧 guia de solução de problemas de conexão com banco de dados

## problema atual

com base nos resultados dos testes, você está enfrentando um **erro de resolução dns**:

```
Error: getaddrinfo ENOTFOUND db.isnujgyqtyondxdrawsc.supabase.co
```

## possíveis soluções

### 1. verificar conexão com internet

- certifique-se de ter uma conexão estável com a internet
- tente acessar outros sites para confirmar conectividade

### 2. verificar url do banco de dados

- verifique seu arquivo `.env` para a `DATABASE_URL` correta
- a url deve ser parecida com: `postgresql://usuario:senha@host:porta/banco`
- verifique se o nome do host está correto

### 3. verificar status do supabase

- se estiver usando supabase, verifique a página de status: <https://status.supabase.com>
- certifique-se de que seu projeto está ativo e não pausado

### 4. problemas de dns

- tente usar um servidor dns diferente (8.8.8.8 ou 1.1.1.1)
- limpe o cache dns:

  ```bash
  # windows
  ipconfig /flushdns
  
  # mac/linux
  sudo dscacheutil -flushcache
  ```

### 5. problemas de firewall/rede

- verifique se seu firewall está bloqueando a conexão
- tente conectar de uma rede diferente
- se estiver em rede corporativa, entre em contato com o suporte de ti

### 6. credenciais do banco de dados

- verifique usuário e senha na string de conexão
- verifique se o usuário do banco tem as permissões adequadas

## passos de teste

1. **executar teste básico:**

   ```bash
   npx tsx test-db-connection.ts
   ```

2. **executar teste completo:**

   ```bash
   npx tsx test-db-comprehensive.ts
   ```

3. **testar drizzle-kit:**

   ```bash
   npm run db:push
   ```

4. **verificar variáveis de ambiente:**

   ```bash
   npm run tests
   ```

5. **limpar cache dns (windows):**

   ```bash
   ipconfig /flushdns
   ```

## mensagens de erro comuns e soluções

| erro | solução |
|------|---------|
| `ENOTFOUND` | verificar conexão com internet e nome do host |
| `ECONNREFUSED` | servidor do banco está fora do ar ou porta bloqueada |
| `authentication failed` | verificar usuário/senha |
| `database does not exist` | criar banco ou verificar nome |
| `SSL error` | verificar configuração ssl |

## obtendo ajuda

se o problema persistir:

1. verifique o painel do supabase para o status do seu projeto
2. verifique sua string de conexão nas configurações do supabase
3. tente criar uma nova string de conexão do banco
4. entre em contato com o suporte do supabase se necessário
