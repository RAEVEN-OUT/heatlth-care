'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Pill } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Medication } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';

const iconMap = {
  pill: Pill,
};

export function MedicationRemindersCard() {
  const db = useFirestore();
  const { data: medications, loading } = useCollection<Medication>(
    collection(db, 'medications'),
  );

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
           {loading && (
            <ul className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <ul className="space-y-4">
            {medications?.map((med) => {
              const Icon = med.icon ? iconMap[med.icon as keyof typeof iconMap] || Pill : Pill;
              return (
                <li key={med.id} className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{med.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {med.dosage} &middot; {med.time}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
