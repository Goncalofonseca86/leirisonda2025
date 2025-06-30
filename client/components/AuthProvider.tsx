import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User, AuthContextType, UserPermissions } from "@shared/types";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultAdminPermissions: UserPermissions = {
  canViewWorks: true,
  canCreateWorks: true,
  canEditWorks: true,
  canDeleteWorks: true,
  canViewMaintenance: true,
  canCreateMaintenance: true,
  canEditMaintenance: true,
  canDeleteMaintenance: true,
  canViewUsers: true,
  canCreateUsers: true,
  canEditUsers: true,
  canDeleteUsers: true,
  canViewReports: true,
  canExportData: true,
  canViewDashboard: true,
  canViewStats: true,
};

const defaultUserPermissions: UserPermissions = {
  canViewWorks: true,
  canCreateWorks: false,
  canEditWorks: false,
  canDeleteWorks: false,
  canViewMaintenance: true,
  canCreateMaintenance: false,
  canEditMaintenance: false,
  canDeleteMaintenance: false,
  canViewUsers: false,
  canCreateUsers: false,
  canEditUsers: false,
  canDeleteUsers: false,
  canViewReports: false,
  canExportData: false,
  canViewDashboard: true,
  canViewStats: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false

  const loadStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("leirisonda_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        // Add default permissions if missing
        if (!parsedUser.permissions) {
          parsedUser.permissions =
            parsedUser.role === "admin"
              ? defaultAdminPermissions
              : defaultUserPermissions;
        }

        console.log("Stored user loaded:", parsedUser.email);
        setUser(parsedUser);
      } else {
        console.log("No stored user found");
      }
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("leirisonda_user");
    }
  };

  useEffect(() => {
    // Clear any corrupted auth data that might cause 400 errors
    try {
      // Check for corrupted localStorage data
      const storedUser = localStorage.getItem("leirisonda_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        // If stored user looks invalid, clear it
        if (!parsed.email || !parsed.id) {
          console.warn("🔄 Clearing corrupted user data");
          localStorage.removeItem("leirisonda_user");
        }
      }
    } catch (error) {
      console.warn("🔄 Clearing corrupted localStorage");
      localStorage.removeItem("leirisonda_user");
    }

    // Load stored user on mount
    loadStoredUser();
  }, []);

  const createGlobalUsersInFirebase = async () => {
    // Only try to create users if Firestore is available
    if (!db) {
      console.log("📱 Firestore not available - skipping global user creation");
      return;
    }

    const globalUsers = [
      {
        email: "gongonsilva@gmail.com",
        userData: {
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Silva",
          role: "admin" as const,
          permissions: defaultAdminPermissions,
          createdAt: new Date().toISOString(),
        },
      },

      {
        email: "tecnico@leirisonda.pt",
        userData: {
          email: "tecnico@leirisonda.pt",
          name: "Técnico Leirisonda",
          role: "user" as const,
          permissions: defaultUserPermissions,
          createdAt: new Date().toISOString(),
        },
      },
      {
        email: "supervisor@leirisonda.pt",
        userData: {
          email: "supervisor@leirisonda.pt",
          name: "Supervisor",
          role: "admin" as const,
          permissions: {
            ...defaultAdminPermissions,
            canDeleteUsers: false,
            canDeleteWorks: false,
          },
          createdAt: new Date().toISOString(),
        },
      },
    ];

    for (const globalUser of globalUsers) {
      try {
        const userRef = doc(db, "users", globalUser.email);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            id: globalUser.email,
            ...globalUser.userData,
          });
          console.log(`✅ Created global user: ${globalUser.userData.name}`);
        }
      } catch (error) {
        console.error(
          `❌ Error creating global user ${globalUser.email}:`,
          error,
        );
      }
    }
  };

  const getUserFromFirestore = async (
    firebaseUser: FirebaseUser,
  ): Promise<User | null> => {
    try {
      // Check if Firestore is available
      if (!db) {
        console.log("📱 Firestore not available - creating local user");
        // Create a local user
        const defaultUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "Utilizador",
          role: "user",
          permissions: defaultUserPermissions,
          createdAt: new Date().toISOString(),
        };
        return defaultUser;
      }

      const userRef = doc(db, "users", firebaseUser.email || firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        return {
          ...userData,
          id: userSnap.id,
        };
      }

      // If user doesn't exist in Firestore, create default user
      const defaultUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "Utilizador",
        role: "user",
        permissions: defaultUserPermissions,
        createdAt: new Date().toISOString(),
      };

      await setDoc(userRef, defaultUser);
      return defaultUser;
    } catch (error) {
      console.error("Error getting user from Firestore:", error);
      return null;
    }
  };

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        setIsLoading(true);

        // Check if Firebase is available
        if (auth && auth !== null) {
          console.log("🔐 Attempting Firebase login for:", email);

          try {
            // Try Firebase Auth login
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password,
            );
            const firebaseUser = userCredential.user;

            console.log("✅ Firebase Auth successful");

            // Get user data from Firestore
            const userData = await getUserFromFirestore(firebaseUser);

            if (userData) {
              setUser(userData);
              localStorage.setItem("leirisonda_user", JSON.stringify(userData));

              // Start real-time data sync
              console.log("🔄 Starting Firebase real-time sync...");
              await firebaseService.syncLocalDataToFirebase();

              return true;
            }

            return false;
          } catch (firebaseError: any) {
            console.log("⚠️ Firebase Auth failed, trying legacy login...");
          }
        } else {
          console.log("📱 Firebase not available, using local authentication");
        }

        // Fallback to legacy local login
        const globalUsers = [
          {
            email: "gongonsilva@gmail.com",
            password: "19867gsf",
            user: {
              id: "admin",
              email: "gongonsilva@gmail.com",
              name: "Gonçalo Silva",
              role: "admin" as const,
              permissions: defaultAdminPermissions,
              createdAt: new Date().toISOString(),
            },
          },

          {
            email: "tecnico@leirisonda.pt",
            password: "tecnico123",
            user: {
              id: "tecnico1",
              email: "tecnico@leirisonda.pt",
              name: "Técnico Leirisonda",
              role: "user" as const,
              permissions: defaultUserPermissions,
              createdAt: new Date().toISOString(),
            },
          },
          {
            email: "supervisor@leirisonda.pt",
            password: "supervisor123",
            user: {
              id: "supervisor1",
              email: "supervisor@leirisonda.pt",
              name: "Supervisor",
              role: "admin" as const,
              permissions: {
                ...defaultAdminPermissions,
                canDeleteUsers: false,
                canDeleteWorks: false,
              },
              createdAt: new Date().toISOString(),
            },
          },
        ];

        const globalUser = globalUsers.find(
          (u) => u.email === email && u.password === password,
        );

        if (globalUser) {
          console.log("✅ Legacy user found:", globalUser.user.name);
          setUser(globalUser.user);
          localStorage.setItem(
            "leirisonda_user",
            JSON.stringify(globalUser.user),
          );

          // Try to create user in Firebase for next time
          try {
            await createUserWithEmailAndPassword(auth, email, password);
            await createGlobalUsersInFirebase();
          } catch (createError) {
            console.log("ℹ️ User might already exist in Firebase");
          }

          return true;
        }

        console.error("❌ Login failed:", firebaseError.message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      // Only try Firebase signOut if auth is available
      if (auth) {
        await signOut(auth);
      }
      setUser(null);
      localStorage.removeItem("leirisonda_user");
      firebaseService.cleanup();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    // Only setup auth listener if Firebase auth is available
    if (!auth) {
      console.log(
        "📱 Firebase Auth not available - skipping auth state listener",
      );
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !user) {
        // User is signed in with Firebase
        const userData = await getUserFromFirestore(firebaseUser);
        if (userData) {
          setUser(userData);
          localStorage.setItem("leirisonda_user", JSON.stringify(userData));

          // Initialize Firebase sync
          await firebaseService.syncLocalDataToFirebase();
        }
      } else if (!firebaseUser && user) {
        // User is signed out
        setUser(null);
        localStorage.removeItem("leirisonda_user");
        firebaseService.cleanup();
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Initialize global users in Firebase on first load
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        await createGlobalUsersInFirebase();
      } catch (error) {
        console.error("Error initializing Firebase:", error);
      }
    };

    initializeFirebase();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("useAuth called outside of AuthProvider context");
    // Return a default context instead of throwing during development
    return {
      user: null,
      login: async () => false,
      logout: () => {},
      isLoading: false,
    };
  }
  return context;
}
