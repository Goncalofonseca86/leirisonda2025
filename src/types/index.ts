export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  permissions: {
    canViewWorks: boolean;
    canCreateWorks: boolean;
    canEditWorks: boolean;
    canDeleteWorks: boolean;
    canViewMaintenance: boolean;
    canCreateMaintenance: boolean;
    canEditMaintenance: boolean;
    canDeleteMaintenance: boolean;
    canViewUsers: boolean;
    canCreateUsers: boolean;
    canEditUsers: boolean;
    canDeleteUsers: boolean;
    canViewReports: boolean;
    canExportData: boolean;
    canViewDashboard: boolean;
    canViewStats: boolean;
  };
}

export interface WaterDrillingDetails {
  profundidadeTotal?: number;
  nivelAgua?: number;
  profundidadeBomba?: number;
  caudal?: number;
  tipoColuna?: "PEAD" | "HIDROROSCADO";
  diametroColuna?: number;
  modeloBomba?: string;
  potenciaMotor?: number;
  voltagemBomba?: "230V" | "400V";
}

export interface Work {
  id: string;
  title: string;
  type: "piscina" | "manutencao" | "furo_agua";
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  address: string;
  description: string;
  status: "pendente" | "em_progresso" | "concluida";
  waterDrillingDetails?: WaterDrillingDetails;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Maintenance {
  id: string;
  workId: string;
  title: string;
  description: string;
  type: "preventiva" | "corretiva";
  status: "agendada" | "em_progresso" | "concluida";
  scheduledDate: string;
  completedDate?: string;
  createdAt: string;
  createdBy: string;
}
