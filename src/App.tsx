import React, { useState, useEffect } from "react";
import {
  Building2,
  Menu,
  X,
  Home,
  Plus,
  Wrench,
  Waves,
  BarChart3,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Save,
  UserPlus,
  Shield,
  Check,
  AlertCircle,
  Download,
  ArrowLeft,
  Bell,
} from "lucide-react";
import jsPDF from "jspdf";
import { FirebaseConfig } from "./components/FirebaseConfig";
import { AdvancedSettings } from "./components/AdvancedSettings";
import { SyncStatusDisplay } from "./components/SyncStatusDisplay";
import { InstallPrompt } from "./components/InstallPrompt";
import { UserPermissionsManager } from "./components/UserPermissionsManager";
import { RegisterForm } from "./components/RegisterForm";

import { SyncStatusIcon } from "./components/SyncStatusIndicator";
import { FirebaseQuotaWarning } from "./components/FirebaseQuotaWarning";

// SECURITY: RegisterForm removed - only super admin can create users
import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { useDataSync } from "./hooks/useDataSync_simple";
import { authService, UserProfile } from "./services/authService";

// Mock users database
const initialUsers = [
  {
    id: 1,
    name: "Gonçalo Fonseca",
    email: "gongonsilva@gmail.com",
    password: "19867gsf",
    role: "super_admin",
    permissions: {
      obras: { view: true, create: true, edit: true, delete: true },
      manutencoes: { view: true, create: true, edit: true, delete: true },
      piscinas: { view: true, create: true, edit: true, delete: true },
      utilizadores: { view: true, create: true, edit: true, delete: true },
      relatorios: { view: true, create: true, edit: true, delete: true },
      clientes: { view: true, create: true, edit: true, delete: true },
    },
    active: true,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Maria Silva",
    email: "maria.silva@leirisonda.pt",
    password: "123456",
    role: "manager",
    permissions: {
      obras: { view: true, create: true, edit: true, delete: false },
      manutencoes: { view: true, create: true, edit: true, delete: false },
      piscinas: { view: true, create: true, edit: true, delete: false },
      utilizadores: { view: true, create: false, edit: false, delete: false },
      relatorios: { view: true, create: true, edit: false, delete: false },
      clientes: { view: true, create: true, edit: true, delete: false },
    },
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    name: "João Santos",
    email: "joao.santos@leirisonda.pt",
    password: "123456",
    role: "technician",
    permissions: {
      obras: { view: true, create: false, edit: true, delete: false },
      manutencoes: { view: true, create: true, edit: true, delete: false },
      piscinas: { view: true, create: false, edit: true, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: true, create: false, edit: false, delete: false },
      clientes: { view: true, create: false, edit: false, delete: false },
    },
    active: true,
    createdAt: "2024-02-01",
      status: "pending",
      description: "Descrição de teste",
      budget: 1000,
      assignedTo: currentUser?.name || "",
      assignedUsers: currentUser
        ? [{ id: currentUser.id.toString(), name: currentUser.name }]
        : [],
      assignedUserIds: currentUser ? [currentUser.id.toString()] : [],
      vehicles: [],
      technicians: [],
      photos: [],
      photoCount: 0,
      observations: "",
      workPerformed: "",
      workSheetCompleted: false,
    };
    addWork(testWork);
  };

  if (!currentUser) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <AutoSyncProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold mb-8">
            Leirisonda - Sistema de Gestão
          </h1>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Bem-vindo, {currentUser.name}
            </h2>
            <p className="text-gray-600 mb-4">
              Sistema funcionando correctamente!
            </p>

            <button
              onClick={createTestWork}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Criar Obra de Teste
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Obras no Sistema ({works.length})
            </h3>

            {works.length === 0 ? (
              <p className="text-gray-500">
                Nenhuma obra encontrada. Clique no botão acima para criar uma.
              </p>
            ) : (
              <div className="space-y-3">
                {works.map((work) => (
                  <div key={work.id} className="border rounded p-4">
                    <h4 className="font-medium">{work.title}</h4>
                    <p className="text-sm text-gray-600">
                      Cliente: {work.client}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {work.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AutoSyncProvider>
  );
}

export default App;