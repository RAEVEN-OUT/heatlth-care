import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { medications } from '@/lib/data';
import { Bell } from 'lucide-react';

export function MedicationRemindersCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Medication Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <ul className="space-y-4">
            {medications.map((med) => (
              <li key={med.id} className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <med.Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{med.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {med.dosage} &middot; {med.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
