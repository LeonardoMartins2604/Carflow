import { useEffect } from "react";
import { Car } from "lucide-react";

function App() {
  useEffect(() => {
    // Redireciona para a aplicação Django
    const timer = setTimeout(() => {
      window.location.href = "/api/";
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClickNow = () => {
    window.location.href = "/api/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        color: "#e2e8f0",
        padding: "20px",
      }}
      data-testid="redirect-page"
    >
      <div style={{ textAlign: "center", maxWidth: "500px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            width: "80px",
            height: "80px",
            borderRadius: "16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <Car size={48} color="white" />
        </div>
        <h1 style={{ fontSize: "48px", color: "white", marginBottom: "12px" }}>
          CarFlow
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "18px", marginBottom: "32px" }}>
          Sistema de Gerenciamento Automotivo
        </p>
        <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
          Redirecionando para a aplicação Django...
        </p>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid rgba(249, 115, 22, 0.3)",
            borderTopColor: "#f97316",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 32px",
          }}
        />
        <button
          onClick={handleClickNow}
          style={{
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "white",
            border: "none",
            padding: "14px 32px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          data-testid="enter-app-button"
        >
          Acessar Agora →
        </button>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default App;
