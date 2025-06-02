
import MenuManagementDisplay from '@/components/features/employee/menu-management-display';
import { menuData } from '@/data/menu-data'; // For initial display

export default function EmployeeDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline text-primary mb-6">Menu Management</h1>
      <p className="text-muted-foreground mb-6">
        Welcome to the Antarctic Command Center. Here you can manage the restaurant's menu offerings.
        Note: For this demo, menu changes are not persisted.
      </p>
      <MenuManagementDisplay initialMenuData={menuData} />
    </div>
  );
}
