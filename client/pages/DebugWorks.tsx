import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";

export function DebugWorks() {
  const { works } = useFirebaseSync();
  const [localStorageWorks, setLocalStorageWorks] = useState<any[]>([]);

  useEffect(() => {
    // Check all localStorage keys for works
    const keys = [
      "works",
      "leirisonda_works",
      "pool_maintenances",
      "leirisonda_pool_maintenances",
    ];
    const allData: any = {};

    keys.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        allData[key] = data ? JSON.parse(data) : null;
      } catch (error) {
        allData[key] = `Error: ${error}`;
      }
    });

    setLocalStorageWorks(allData);
  }, []);

  const clearAllData = () => {
    const keys = [
      "works",
      "leirisonda_works",
      "pool_maintenances",
      "leirisonda_pool_maintenances",
      "users",
      "leirisonda_users",
    ];
    keys.forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>🔍 DEBUG - Estado das Obras</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={clearAllData}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          🗑️ LIMPAR TODOS OS DADOS
        </button>
        <Link
          to="/works"
          style={{
            backgroundColor: "#007784",
            color: "white",
            padding: "10px 20px",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          📋 Ver Lista de Obras
        </Link>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <div>
          <h2>🔄 Firebase Sync Hook</h2>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <p>
              <strong>Total de obras:</strong> {works.length}
            </p>
            {works.length > 0 ? (
              <div>
                <h3>Obras disponíveis:</h3>
                {works.map((work, index) => (
                  <div
                    key={work.id}
                    style={{
                      marginBottom: "10px",
                      padding: "10px",
                      backgroundColor: "white",
                      borderRadius: "3px",
                    }}
                  >
                    <strong>#{index + 1}</strong>
                    <br />
                    <strong>ID:</strong> {work.id}
                    <br />
                    <strong>Cliente:</strong> {work.clientName}
                    <br />
                    <strong>Status:</strong> {work.status}
                    <br />
                    <Link to={`/works/${work.id}`} style={{ color: "#007784" }}>
                      👁️ Abrir Obra
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#dc3545" }}>
                ❌ Nenhuma obra encontrada no hook!
              </p>
            )}
          </div>
        </div>

        <div>
          <h2>💾 LocalStorage</h2>
          {Object.entries(localStorageWorks).map(([key, data]) => (
            <div key={key} style={{ marginBottom: "15px" }}>
              <h3>{key}</h3>
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                }}
              >
                {data === null ? (
                  <span style={{ color: "#999" }}>null</span>
                ) : typeof data === "string" ? (
                  <span style={{ color: "#dc3545" }}>{data}</span>
                ) : Array.isArray(data) ? (
                  <span style={{ color: "#28a745" }}>
                    Array com {data.length} itens
                  </span>
                ) : (
                  <span style={{ color: "#007784" }}>Object</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
