import { Stethoscope } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';

export function DashboardHeader() {

  return (
    <div className="flex items-center gap-3">
        <div className="p-2 bg-sidebar-primary/10 text-sidebar-primary rounded-lg">
          <Stethoscope className="h-6 w-6" />
        </div>
        <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight hidden group-data-[state=expanded]:block">
          HealthSight AI
        </h1>
        <div className='flex-1 flex justify-end'>
          <SidebarTrigger className='hidden md:flex' />
        </div>
    </div>
  );
}
