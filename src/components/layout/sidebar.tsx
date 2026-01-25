'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '../logo';
import {
  LayoutDashboard,
  ScanLine,
  FileText,
  MessageSquare,
  ListPlus,
  LifeBuoy,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/hooks/use-locale';
import LanguageSwitcher from '../language-switcher';

export default function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLocale();

  const menuItems = [
    { href: '/', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    {
      href: '/x-ray-analysis',
      label: t('sidebar.xrayAnalysis'),
      icon: ScanLine,
    },
    {
      href: '/report-interpretation',
      label: t('sidebar.reportInterpretation'),
      icon: FileText,
    },
    {
      href: '/symptom-checker',
      label: t('sidebar.symptomChecker'),
      icon: ListPlus,
    },
    { href: '/chat', label: t('sidebar.medicalChat'), icon: MessageSquare },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-8" />
          <span className="text-lg font-semibold font-headline">MediaID</span>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {menuItems.map(item => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LanguageSwitcher />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={t('sidebar.help')}>
              <LifeBuoy />
              <span>{t('sidebar.help')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={t('sidebar.settings')}>
              <Settings />
              <span>{t('sidebar.settings')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
