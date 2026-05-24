"""
CarFlow Frontend Server - Servidor Python puro
Substitui o frontend React.
Serve uma página HTML estática de redirect para a aplicação Django em /api/.
"""
import os
from http.server import HTTPServer, BaseHTTPRequestHandler


HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', 3000))


REDIRECT_HTML = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="1.5;url=/api/">
    <title>CarFlow - Sistema de Gerenciamento Automotivo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #e2e8f0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container { text-align: center; max-width: 500px; }
        .logo {
            background: linear-gradient(135deg, #f97316, #ea580c);
            width: 80px;
            height: 80px;
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            margin-bottom: 24px;
        }
        h1 { font-size: 48px; color: #ffffff; margin-bottom: 12px; }
        .subtitle { color: #94a3b8; font-size: 18px; margin-bottom: 32px; }
        .loading-text { color: #cbd5e1; margin-bottom: 24px; }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(249, 115, 22, 0.3);
            border-top-color: #f97316;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 32px;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .btn {
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: #ffffff;
            border: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.3s;
        }
        .btn:hover { transform: translateY(-2px); }
        .badge {
            display: inline-block;
            margin-top: 32px;
            padding: 6px 14px;
            background: rgba(74, 144, 226, 0.2);
            border: 1px solid rgba(74, 144, 226, 0.5);
            border-radius: 20px;
            color: #93c5fd;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚗</div>
        <h1>CarFlow</h1>
        <p class="subtitle">Sistema de Gerenciamento Automotivo</p>
        <p class="loading-text">Redirecionando para a aplicação...</p>
        <div class="spinner"></div>
        <a href="/api/" class="btn">Acessar Agora →</a>
        <div class="badge">🐍 100% Python</div>
    </div>
</body>
</html>
"""


class CarFlowHandler(BaseHTTPRequestHandler):
    """Handler simples que sempre retorna a página de redirect"""

    def _send_headers(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.end_headers()

    def do_GET(self):
        self._send_headers()
        self.wfile.write(REDIRECT_HTML.encode('utf-8'))

    def do_HEAD(self):
        self._send_headers()

    def log_message(self, format, *args):
        """Log no formato simples"""
        print(f"[CarFlow Frontend] {self.address_string()} - {format % args}")


def main():
    server = HTTPServer((HOST, PORT), CarFlowHandler)
    print(f"🐍 CarFlow Frontend (Python) rodando em http://{HOST}:{PORT}")
    print("   Redireciona todas as requisições para /api/ (Django)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando servidor...")
        server.shutdown()


if __name__ == '__main__':
    main()
