import React from "react";

export function DebugSimple() {
  return (
    <div
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "50px",
        fontSize: "30px",
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <h1>TESTE SIMPLES - SE VÊS ISTO, O REACT FUNCIONA!</h1>
      <p>Página de debug básica</p>
      <p>
        Gonçalo, se consegues ver este texto vermelho, o React está a funcionar.
      </p>
      <button
        onClick={() => alert("JavaScript funciona!")}
        style={{
          backgroundColor: "white",
          color: "red",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        Testar JavaScript
      </button>
    </div>
  );
}
