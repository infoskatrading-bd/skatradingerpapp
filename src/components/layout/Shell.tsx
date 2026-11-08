import { MainLayout } from './MainLayout';

/**
 * Shell layout re-exports the foundational MainLayout component.
 * Ensures seamless compatibility across all router and view modules.
 */
export { MainLayout as Shell, MainLayout, ERP_NAVIGATION_ITEMS } from './MainLayout';
export type { MainLayoutProps as ShellProps, MainLayoutProps } from './MainLayout';
export default MainLayout;
