import React, { createContext, useContext, useCallback } from 'react';
import { useLocation, useNavigate as useRouterNavigate } from 'react-router-dom';
import { ERP_NAVIGATION_ITEMS } from '../components/layout/Shell';

interface NavigationContextType {
  activeModuleId: string;
  activeSubItemId?: string;
  navigate: (moduleId: string, subItemId?: string) => void;
  activeModuleTitle: string;
  activeSubItemTitle?: string;
  tableReference?: string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const routerNavigate = useRouterNavigate();

  // Parse path: "/sales/sales-invoices" -> { moduleId: "sales", subItemId: "sales-invoices" }
  const path = location.pathname.replace(/^\//, '').trim();
  const [rawModule, rawSub] = path.split('/');

  // Alias /admin to /administration
  const normalizedModule = rawModule === 'admin' ? 'administration' : rawModule;
  const activeModuleId = normalizedModule || 'dashboard';
  const activeSubItemId = rawSub || undefined;

  // Programmatic navigation utilizing React Router
  const navigate = useCallback(
    (moduleId: string, subItemId?: string) => {
      const targetPath = subItemId ? `/${moduleId}/${subItemId}` : `/${moduleId}`;
      routerNavigate(targetPath);
    },
    [routerNavigate]
  );

  // Lookup current navigation descriptors
  const currentNav = ERP_NAVIGATION_ITEMS.find((item) => item.id === activeModuleId);
  const currentSubNav = currentNav?.children?.find((sub) => sub.id === activeSubItemId);

  return (
    <NavigationContext.Provider
      value={{
        activeModuleId,
        activeSubItemId,
        navigate,
        activeModuleTitle: currentNav?.label || 'Dashboard',
        activeSubItemTitle: currentSubNav?.label,
        tableReference: currentSubNav?.tableReference,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider wrapped in a Router');
  }
  return context;
}
