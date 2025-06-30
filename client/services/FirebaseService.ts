import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Work, PoolMaintenance } from "@shared/types";

export class FirebaseService {
  private static instance: FirebaseService;
  private unsubscribes: (() => void)[] = [];
  private isFirebaseAvailable: boolean = false;

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  constructor() {
    // Check if Firebase is available
    try {
      this.isFirebaseAvailable =
        db !== null && db !== undefined && typeof db === "object";
      if (this.isFirebaseAvailable) {
        console.log("🔥 FirebaseService running with Firebase sync");
      } else {
        console.log("📱 FirebaseService running in local-only mode");
      }
    } catch (error) {
      console.log("📱 FirebaseService fallback to local-only mode:", error);
      this.isFirebaseAvailable = false;
    }
  }

  // Users Collection
  async getUsers(): Promise<User[]> {
    try {
      if (!this.isFirebaseAvailable) {
        return this.getLocalUsers();
      }

      const querySnapshot = await getDocs(collection(db, "users"));
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });
      return users;
    } catch (error) {
      console.error("Error getting users:", error);
      return this.getLocalUsers();
    }
  }

  private getLocalUsers(): User[] {
    try {
      const stored = localStorage.getItem("users");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  async createUser(userData: Omit<User, "id">): Promise<string> {
    try {
      if (!this.isFirebaseAvailable) {
        return this.createLocalUser(userData);
      }

      const docRef = await addDoc(collection(db, "users"), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating user:", error);
      return this.createLocalUser(userData);
    }
  }

  private createLocalUser(userData: Omit<User, "id">): string {
    try {
      const id = `user_${Date.now()}`;
      const user: User = {
        ...userData,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const users = this.getLocalUsers();
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
      return id;
    } catch (error) {
      console.error("Error creating local user:", error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<void> {
    try {
      if (!this.isFirebaseAvailable) {
        return this.updateLocalUser(id, userData);
      }

      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return this.updateLocalUser(id, userData);
    }
  }

  private updateLocalUser(id: string, userData: Partial<User>): void {
    try {
      const users = this.getLocalUsers();
      const index = users.findIndex((user) => user.id === id);
      if (index !== -1) {
        users[index] = {
          ...users[index],
          ...userData,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("users", JSON.stringify(users));
      }
    } catch (error) {
      console.error("Error updating local user:", error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      if (!this.isFirebaseAvailable) {
        return this.deleteLocalUser(id);
      }

      await deleteDoc(doc(db, "users", id));
    } catch (error) {
      console.error("Error deleting user:", error);
      return this.deleteLocalUser(id);
    }
  }

  private deleteLocalUser(id: string): void {
    try {
      const users = this.getLocalUsers();
      const filtered = users.filter((user) => user.id !== id);
      localStorage.setItem("users", JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting local user:", error);
      throw error;
    }
  }

  // Works Collection
  async getWorks(): Promise<Work[]> {
    try {
      if (!this.isFirebaseAvailable) {
        return this.getLocalWorks();
      }

      const querySnapshot = await getDocs(
        query(collection(db, "works"), orderBy("createdAt", "desc")),
      );
      const works: Work[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        works.push({
          id: doc.id,
          ...data,
          startDate:
            data.startDate?.toDate?.()?.toISOString() || data.startDate,
          endDate: data.endDate?.toDate?.()?.toISOString() || data.endDate,
          createdAt:
            data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt:
            data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        } as Work);
      });
      return works;
    } catch (error) {
      console.error("Error getting works:", error);
      return this.getLocalWorks();
    }
  }

  private getLocalWorks(): Work[] {
    try {
      const stored = localStorage.getItem("works");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  async createWork(workData: Omit<Work, "id">): Promise<string> {
    try {
      if (!this.isFirebaseAvailable) {
        return this.createLocalWork(workData);
      }

      const docRef = await addDoc(collection(db, "works"), {
        ...workData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating work:", error);
      return this.createLocalWork(workData);
    }
  }

  private createLocalWork(workData: Omit<Work, "id">): string {
    try {
      const id = `work_${Date.now()}`;
      const work: Work = {
        ...workData,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const works = this.getLocalWorks();
      works.push(work);
      localStorage.setItem("works", JSON.stringify(works));
      return id;
    } catch (error) {
      console.error("Error creating local work:", error);
      throw error;
    }
  }

  async updateWork(id: string, workData: Partial<Work>): Promise<void> {
    try {
      if (!this.isFirebaseAvailable) {
        return this.updateLocalWork(id, workData);
      }

      const workRef = doc(db, "works", id);
      await updateDoc(workRef, {
        ...workData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating work:", error);
      return this.updateLocalWork(id, workData);
    }
  }

  private updateLocalWork(id: string, workData: Partial<Work>): void {
    try {
      const works = this.getLocalWorks();
      const index = works.findIndex((work) => work.id === id);
      if (index !== -1) {
        works[index] = {
          ...works[index],
          ...workData,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("works", JSON.stringify(works));
      }
    } catch (error) {
      console.error("Error updating local work:", error);
      throw error;
    }
  }

  async deleteWork(id: string): Promise<void> {
    try {
      if (!this.isFirebaseAvailable) {
        return this.deleteLocalWork(id);
      }

      await deleteDoc(doc(db, "works", id));
    } catch (error) {
      console.error("Error deleting work:", error);
      return this.deleteLocalWork(id);
    }
  }

  private deleteLocalWork(id: string): void {
    try {
      const works = this.getLocalWorks();
      const filtered = works.filter((work) => work.id !== id);
      localStorage.setItem("works", JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting local work:", error);
      throw error;
    }
  }

  // Pool Maintenances Collection with Enhanced Triple Backup System
  async getPoolMaintenances(): Promise<PoolMaintenance[]> {
    try {
      if (!this.isFirebaseAvailable) {
        return this.getLocalPoolMaintenances();
      }

      const querySnapshot = await getDocs(
        query(
          collection(db, "pool_maintenances"),
          orderBy("createdAt", "desc"),
        ),
      );
      const maintenances: PoolMaintenance[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        maintenances.push({
          id: doc.id,
          ...data,
          startDate:
            data.startDate?.toDate?.()?.toISOString() || data.startDate,
          endDate: data.endDate?.toDate?.()?.toISOString() || data.endDate,
          createdAt:
            data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt:
            data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
          interventions: data.interventions || [],
        } as PoolMaintenance);
      });

      // Store locally as backup
      this.storeLocalPoolMaintenances(maintenances);
      return maintenances;
    } catch (error) {
      console.error("Error getting pool maintenances:", error);
      return this.getLocalPoolMaintenances();
    }
  }

  private getLocalPoolMaintenances(): PoolMaintenance[] {
    try {
      // Try primary storage first
      let stored = localStorage.getItem("pool_maintenances");
      if (stored) {
        return JSON.parse(stored);
      }

      // Try backup storage
      stored = localStorage.getItem("pool_maintenances_backup");
      if (stored) {
        console.log("📦 Loading from backup storage");
        const backup = JSON.parse(stored);
        // Restore to primary
        localStorage.setItem("pool_maintenances", JSON.stringify(backup));
        return backup;
      }

      return [];
    } catch (error) {
      console.error("Error getting local pool maintenances:", error);
      return [];
    }
  }

  private storeLocalPoolMaintenances(maintenances: PoolMaintenance[]): void {
    try {
      const data = JSON.stringify(maintenances);

      // Triple backup system
      localStorage.setItem("pool_maintenances", data);
      localStorage.setItem("pool_maintenances_backup", data);
      localStorage.setItem(`pool_maintenances_${Date.now()}`, data);

      console.log("✅ Triple backup completed for pool maintenances");
    } catch (error) {
      console.error("Error storing local pool maintenances:", error);
    }
  }

  async createPoolMaintenance(
    maintenanceData: Omit<PoolMaintenance, "id">,
  ): Promise<string> {
    try {
      if (!this.isFirebaseAvailable) {
        return this.createLocalPoolMaintenance(maintenanceData);
      }

      const docRef = await addDoc(collection(db, "pool_maintenances"), {
        ...maintenanceData,
        interventions: maintenanceData.interventions || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Also store locally as backup
      this.createLocalPoolMaintenance(maintenanceData, docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating pool maintenance:", error);
      return this.createLocalPoolMaintenance(maintenanceData);
    }
  }

  private createLocalPoolMaintenance(
    maintenanceData: Omit<PoolMaintenance, "id">,
    id?: string,
  ): string {
    try {
      const maintenanceId =
        id || `maint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const maintenance: PoolMaintenance = {
        ...maintenanceData,
        id: maintenanceId,
        interventions: maintenanceData.interventions || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const maintenances = this.getLocalPoolMaintenances();
      maintenances.push(maintenance);
      this.storeLocalPoolMaintenances(maintenances);

      console.log("✅ Local pool maintenance created:", maintenanceId);
      return maintenanceId;
    } catch (error) {
      console.error("Error creating local pool maintenance:", error);
      throw error;
    }
  }

  // Enhanced updateLocalMaintenance with detailed logging and verification
  async updateLocalMaintenance(maintenance: PoolMaintenance): Promise<boolean> {
    try {
      console.log("🔄 Starting updateLocalMaintenance for:", maintenance.id);
      console.log(
        "📊 Intervention count:",
        maintenance.interventions?.length || 0,
      );

      const maintenances = this.getLocalPoolMaintenances();
      const index = maintenances.findIndex((m) => m.id === maintenance.id);

      if (index === -1) {
        console.error("❌ Maintenance not found:", maintenance.id);
        return false;
      }

      // Update with enhanced data
      const updatedMaintenance = {
        ...maintenance,
        updatedAt: new Date().toISOString(),
        interventions: maintenance.interventions || [],
      };

      maintenances[index] = updatedMaintenance;

      // Triple backup write system
      const data = JSON.stringify(maintenances);

      try {
        localStorage.setItem("pool_maintenances", data);
        console.log("✅ Primary storage updated");
      } catch (e) {
        console.error("❌ Primary storage failed:", e);
        return false;
      }

      try {
        localStorage.setItem("pool_maintenances_backup", data);
        console.log("✅ Backup storage updated");
      } catch (e) {
        console.warn("⚠️ Backup storage failed:", e);
      }

      try {
        localStorage.setItem(`pool_maintenances_${Date.now()}`, data);
        console.log("✅ Timestamped backup created");
      } catch (e) {
        console.warn("⚠️ Timestamped backup failed:", e);
      }

      // Individual maintenance backup
      try {
        localStorage.setItem(
          `maintenance_${maintenance.id}`,
          JSON.stringify(updatedMaintenance),
        );
        console.log("✅ Individual maintenance backup created");
      } catch (e) {
        console.warn("⚠️ Individual backup failed:", e);
      }

      // Verify the save
      const verification = localStorage.getItem("pool_maintenances");
      if (verification) {
        const parsed = JSON.parse(verification);
        const verified = parsed.find((m: any) => m.id === maintenance.id);
        if (
          verified &&
          verified.interventions?.length === maintenance.interventions?.length
        ) {
          console.log("✅ Save verification successful");
          return true;
        } else {
          console.error("❌ Save verification failed");
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error("❌ Error in updateLocalMaintenance:", error);
      return false;
    }
  }

  // Enhanced updateMaintenance with Firebase and local sync
  async updateMaintenance(maintenance: PoolMaintenance): Promise<boolean> {
    try {
      console.log("🔄 Starting updateMaintenance for:", maintenance.id);

      let firebaseSuccess = false;

      // Try Firebase first if available
      if (this.isFirebaseAvailable) {
        try {
          const maintenanceRef = doc(db, "pool_maintenances", maintenance.id);
          await updateDoc(maintenanceRef, {
            ...maintenance,
            updatedAt: serverTimestamp(),
          });
          console.log("✅ Firebase update successful");
          firebaseSuccess = true;
        } catch (error) {
          console.error("❌ Firebase update failed:", error);
        }
      }

      // Always update locally (as backup or primary)
      const localSuccess = await this.updateLocalMaintenance(maintenance);

      if (localSuccess) {
        console.log("✅ updateMaintenance completed successfully");
        return true;
      } else {
        console.error("❌ updateMaintenance failed");
        return false;
      }
    } catch (error) {
      console.error("❌ Error in updateMaintenance:", error);
      return false;
    }
  }

  async deletePoolMaintenance(id: string): Promise<void> {
    try {
      if (!this.isFirebaseAvailable) {
        return this.deleteLocalPoolMaintenance(id);
      }

      await deleteDoc(doc(db, "pool_maintenances", id));

      // Also delete locally
      this.deleteLocalPoolMaintenance(id);
    } catch (error) {
      console.error("Error deleting pool maintenance:", error);
      return this.deleteLocalPoolMaintenance(id);
    }
  }

  private deleteLocalPoolMaintenance(id: string): void {
    try {
      const maintenances = this.getLocalPoolMaintenances();
      const filtered = maintenances.filter(
        (maintenance) => maintenance.id !== id,
      );
      this.storeLocalPoolMaintenances(filtered);

      // Also remove individual backup
      localStorage.removeItem(`maintenance_${id}`);

      console.log("✅ Local pool maintenance deleted:", id);
    } catch (error) {
      console.error("Error deleting local pool maintenance:", error);
      throw error;
    }
  }

  // Real-time listeners
  subscribeToPoolMaintenances(
    callback: (maintenances: PoolMaintenance[]) => void,
  ): () => void {
    if (!this.isFirebaseAvailable) {
      // For local-only mode, call callback immediately with local data
      setTimeout(() => {
        callback(this.getLocalPoolMaintenances());
      }, 0);

      // Return a no-op unsubscribe function
      return () => {};
    }

    try {
      const q = query(
        collection(db, "pool_maintenances"),
        orderBy("createdAt", "desc"),
      );
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const maintenances: PoolMaintenance[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            maintenances.push({
              id: doc.id,
              ...data,
              startDate:
                data.startDate?.toDate?.()?.toISOString() || data.startDate,
              endDate: data.endDate?.toDate?.()?.toISOString() || data.endDate,
              createdAt:
                data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
              updatedAt:
                data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
              interventions: data.interventions || [],
            } as PoolMaintenance);
          });

          // Store locally as backup
          this.storeLocalPoolMaintenances(maintenances);
          callback(maintenances);
        },
        (error) => {
          console.error("Error in pool maintenances subscription:", error);
          // Fallback to local data
          callback(this.getLocalPoolMaintenances());
        },
      );

      this.unsubscribes.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up pool maintenances subscription:", error);
      // Fallback to local data
      setTimeout(() => {
        callback(this.getLocalPoolMaintenances());
      }, 0);
      return () => {};
    }
  }

  subscribeToWorks(callback: (works: Work[]) => void): () => void {
    if (!this.isFirebaseAvailable) {
      // For local-only mode, call callback immediately with local data
      setTimeout(() => {
        callback(this.getLocalWorks());
      }, 0);

      // Return a no-op unsubscribe function
      return () => {};
    }

    try {
      const q = query(collection(db, "works"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const works: Work[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            works.push({
              id: doc.id,
              ...data,
              startDate:
                data.startDate?.toDate?.()?.toISOString() || data.startDate,
              endDate: data.endDate?.toDate?.()?.toISOString() || data.endDate,
              createdAt:
                data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
              updatedAt:
                data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
            } as Work);
          });
          callback(works);
        },
        (error) => {
          console.error("Error in works subscription:", error);
          // Fallback to local data
          callback(this.getLocalWorks());
        },
      );

      this.unsubscribes.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up works subscription:", error);
      // Fallback to local data
      setTimeout(() => {
        callback(this.getLocalWorks());
      }, 0);
      return () => {};
    }
  }

  // Cleanup
  cleanup(): void {
    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
    this.unsubscribes = [];
  }

  // Utility methods for data recovery
  async recoverFromBackup(): Promise<boolean> {
    try {
      // Try to recover from timestamped backups
      const keys = Object.keys(localStorage).filter(
        (key) =>
          key.startsWith("pool_maintenances_") &&
          key !== "pool_maintenances_backup",
      );

      if (keys.length > 0) {
        // Get the most recent backup
        const sortedKeys = keys.sort((a, b) => {
          const timestampA = parseInt(a.split("_").pop() || "0");
          const timestampB = parseInt(b.split("_").pop() || "0");
          return timestampB - timestampA;
        });

        const latestBackup = localStorage.getItem(sortedKeys[0]);
        if (latestBackup) {
          localStorage.setItem("pool_maintenances", latestBackup);
          console.log("✅ Data recovered from backup:", sortedKeys[0]);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("❌ Error recovering from backup:", error);
      return false;
    }
  }

  // Get backup status for debugging
  getBackupStatus(): {
    primary: boolean;
    backup: boolean;
    timestamped: number;
  } {
    const primary = !!localStorage.getItem("pool_maintenances");
    const backup = !!localStorage.getItem("pool_maintenances_backup");
    const timestamped = Object.keys(localStorage).filter(
      (key) =>
        key.startsWith("pool_maintenances_") &&
        key !== "pool_maintenances_backup",
    ).length;

    return { primary, backup, timestamped };
  }
}

export const firebaseService = FirebaseService.getInstance();
