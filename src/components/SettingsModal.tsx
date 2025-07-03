import React, { useState } from "react";
import { X, Bell, Trash2, Download, Upload } from "lucide-react";
import { useData } from "../contexts/DataContext";

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState(false);
  const { clearAllData } = useData();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "19867") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Palavra-passe incorreta");
    }
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "⚠️ Tem a certeza que quer eliminar todos os dados?\n\nEsta ação não pode ser desfeita.",
      )
    ) {
      clearAllData();
      alert("✅ Todos os dados foram eliminados com sucesso!");
      onClose();
    }
  };

  const handleExportData = () => {
    const works = localStorage.getItem("leirisonda_works") || "[]";
    const maintenances =
      localStorage.getItem("leirisonda_maintenances") || "[]";

    const data = {
      works: JSON.parse(works),
      maintenances: JSON.parse(maintenances),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leirisonda_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.works) {
          localStorage.setItem("leirisonda_works", JSON.stringify(data.works));
        }
        if (data.maintenances) {
          localStorage.setItem(
            "leirisonda_maintenances",
            JSON.stringify(data.maintenances),
          );
        }
        alert(
          "✅ Dados importados com sucesso! Recarregue a página para ver as alterações.",
        );
      } catch (err) {
        alert(
          "❌ Erro ao importar dados. Verifique se o ficheiro está correto.",
        );
      }
    };
    reader.readAsText(file);
  };

  const toggleNotifications = async () => {
    if (!notifications && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotifications(true);
        new Notification("Leirisonda", {
          body: "Notificações ativadas com sucesso!",
          icon: "/favicon.ico",
        });
      }
    } else {
      setNotifications(!notifications);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">⚙️ Configurações</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {!isAuthenticated ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="form-group">
                <label htmlFor="settings-password" className="form-label">
                  Palavra-passe de acesso
                </label>
                <input
                  id="settings-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Digite a palavra-passe"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full">
                Aceder
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-blue-600" />
                  <div>
                    <div className="font-medium">Notificações Push</div>
                    <div className="text-sm text-gray-500">
                      Receber alertas de obras e manutenções
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleNotifications}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Data Management */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Gestão de Dados</h3>

                <div className="flex gap-2">
                  <button
                    onClick={handleExportData}
                    className="btn btn-outline flex-1"
                  >
                    <Download size={16} />
                    Exportar
                  </button>

                  <label className="btn btn-outline flex-1 cursor-pointer">
                    <Upload size={16} />
                    Importar
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  onClick={handleClearData}
                  className="btn btn-danger w-full"
                >
                  <Trash2 size={16} />
                  Eliminar Todos os Dados
                </button>
              </div>

              {/* System Info */}
              <div className="text-xs text-gray-500 pt-4 border-t">
                <div>Versão: 2.0.0</div>
                <div>
                  Última atualização: {new Date().toLocaleDateString("pt-PT")}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
