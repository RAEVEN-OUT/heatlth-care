import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { patientProfile } from '@/lib/data';
import { User } from 'lucide-react';

export function PatientProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <p className="font-semibold text-lg">{patientProfile.name}</p>
        <div className="space-y-1 text-muted-foreground mt-2">
          <p><strong>Age:</strong> {patientProfile.age}</p>
          <p><strong>Blood Type:</strong> {patientProfile.bloodType}</p>
        </div>
      </CardContent>
    </Card>
  );
}
