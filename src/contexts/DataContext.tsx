import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Work, Maintenance } from "../types";

interface DataContextType {
  works: Work[];
  maintenances: Maintenance[];
  addWork: (work: Omit<Work, "id" | "createdAt" | "updatedAt">) => void;
  updateWork: (id: string, work: Partial<Work>) => void;
  deleteWork: (id: string) => void;
  addMaintenance: (maintenance: Omit<Maintenance, "id" | "createdAt">) => void;
  updateMaintenance: (id: string, maintenance: Partial<Maintenance>) => void;
  deleteMaintenance: (id: string) => void;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [works, setWorks] = useState<Work[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  useEffect(() => {
    const storedWorks = localStorage.getItem("leirisonda_works");
    const storedMaintenances = localStorage.getItem("leirisonda_maintenances");

    if (storedWorks) {
      setWorks(JSON.parse(storedWorks));
    }
    if (storedMaintenances) {
      setMaintenances(JSON.parse(storedMaintenances));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("leirisonda_works", JSON.stringify(works));
  }, [works]);

  useEffect(() => {
    localStorage.setItem(
      "leirisonda_maintenances",
      JSON.stringify(maintenances),
    );
  }, [maintenances]);

  const addWork = (workData: Omit<Work, "id" | "createdAt" | "updatedAt">) => {
    const newWork: Work = {
      ...workData,
      id: `work_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorks((prev) => [...prev, newWork]);
  };

  const updateWork = (id: string, workData: Partial<Work>) => {
    setWorks((prev) =>
      prev.map((work) =>
        work.id === id
          ? { ...work, ...workData, updatedAt: new Date().toISOString() }
          : work,
      ),
    );
  };

  const deleteWork = (id: string) => {
    setWorks((prev) => prev.filter((work) => work.id !== id));
    setMaintenances((prev) =>
      prev.filter((maintenance) => maintenance.workId !== id),
    );
  };

  const addMaintenance = (
    maintenanceData: Omit<Maintenance, "id" | "createdAt">,
  ) => {
    const newMaintenance: Maintenance = {
      ...maintenanceData,
      id: `maintenance_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMaintenances((prev) => [...prev, newMaintenance]);
  };

  const updateMaintenance = (
    id: string,
    maintenanceData: Partial<Maintenance>,
  ) => {
    setMaintenances((prev) =>
      prev.map((maintenance) =>
        maintenance.id === id
          ? { ...maintenance, ...maintenanceData }
          : maintenance,
      ),
    );
  };

  const deleteMaintenance = (id: string) => {
    setMaintenances((prev) =>
      prev.filter((maintenance) => maintenance.id !== id),
    );
  };

  const clearAllData = () => {
    setWorks([]);
    setMaintenances([]);
    localStorage.removeItem("leirisonda_works");
    localStorage.removeItem("leirisonda_maintenances");
  };

  return (
    <DataContext.Provider
      value={{
        works,
        maintenances,
        addWork,
        updateWork,
        deleteWork,
        addMaintenance,
        updateMaintenance,
        deleteMaintenance,
        clearAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
