"use client";

import { useState } from "react";

export default function TestDbPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/test-db");
      const data = (await response.json()) as any;

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || "erro desconhecido");
      }
    } catch {
      setError("erro ao conectar com a api");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        🔍 teste de conexão com banco de dados
      </h1>

      <div className="mb-6 rounded-lg bg-gray-100 p-6">
        <h2 className="mb-4 text-xl font-semibold">como usar</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• clique no botão abaixo para testar a conexão</li>
          <li>
            • o teste será executado no servidor (não na sua máquina local)
          </li>
          <li>• você pode acessar esta página de qualquer dispositivo</li>
          <li>• útil para testar conexões em produção ou servidores remotos</li>
        </ul>
      </div>

      <button
        className={`
          rounded-lg bg-blue-500 px-6 py-3 font-medium text-white
          transition-colors
          hover:bg-blue-600
          disabled:bg-gray-400
        `}
        disabled={loading}
        onClick={testConnection}
        type="button"
      >
        {loading ? "🔄 testando..." : "🚀 testar conexão"}
      </button>

      {error && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-100 p-4">
          <h3 className="mb-2 font-semibold text-red-800">❌ erro:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div
          className={`mt-6 rounded-lg border border-green-300 bg-green-100 p-4`}
        >
          <h3 className="mb-2 font-semibold text-green-800">✅ resultado:</h3>
          <div className="space-y-2 text-green-700">
            <p>
              <strong>status:</strong> {result.message}
            </p>
            <p>
              <strong>conexão:</strong> {result.data.connection}
            </p>
            <p>
              <strong>schema:</strong> {result.data.schema}
            </p>
            <p>
              <strong>tabelas:</strong> {result.data.tables}
            </p>
            {result.data.tablesList && result.data.tablesList.length > 0 && (
              <div>
                <strong>lista de tabelas:</strong>
                <ul className="mt-1 ml-4">
                  {result.data.tablesList.map(
                    (table: string, index: number) => (
                      <li key={index}>• {table}</li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold text-blue-800">
          💡 outras opções de teste:
        </h3>
        <div className="space-y-2 text-blue-700">
          <p>
            • <strong>api endpoint:</strong>{" "}
            <code className={`rounded bg-blue-100 px-2 py-1`}>
              GET /api/test-db
            </code>
          </p>
          <p>
            • <strong>curl:</strong>{" "}
            <code className={`rounded bg-blue-100 px-2 py-1`}>
              curl https://seu-dominio.com/api/test-db
            </code>
          </p>
          <p>
            • <strong>postman:</strong> faça uma requisição GET para o endpoint
          </p>
        </div>
      </div>
    </div>
  );
}
