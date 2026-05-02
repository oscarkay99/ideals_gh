import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { PageTitleProvider, usePageTitle } from '@/context/PageTitleContext';
import { useState } from 'react';

function ShellInner() {
  const { pageTitle } = usePageTitle();
  const [sidebarWidth, setSidebarWidth] = useState(260);

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--shell-bg)' }}>
      <Sidebar onWidthChange={setSidebarWidth} />
      <div
        className="flex-1 flex flex-col min-h-screen"
        style={{ marginLeft: sidebarWidth, transition: 'margin-left 300ms ease' }}
      >
        <TopBar
          title={pageTitle.title}
          subtitle={pageTitle.subtitle}
        />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AppShell() {
  return (
    <PageTitleProvider>
      <ShellInner />
    </PageTitleProvider>
  );
}
