'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { PatientProfile } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';

export function PatientProfileCard() {
  const db = useFirestore();
  const { data: patientProfile, loading } = useDoc<PatientProfile>(
    doc(db, 'patientProfiles/jane-doe'),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Patient Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {loading ? (
          <>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <div className="space-y-2 text-muted-foreground mt-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </>
        ) : (
          <>
            <p className="font-semibold text-lg">{patientProfile?.name}</p>
            <div className="space-y-1 text-muted-foreground mt-2">
              <p>
                <strong>Age:</strong> {patientProfile?.age}
              </p>
              <p>
                <strong>Blood Type:</strong> {patientProfile?.bloodType}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
