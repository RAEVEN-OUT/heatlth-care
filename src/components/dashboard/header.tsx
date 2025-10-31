import { Stethoscope } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function DashboardHeader() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <header className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <Stethoscope className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          HealthSight AI
        </h1>
      </div>
      <Avatar>
        {userAvatar && (
            <AvatarImage
                src={userAvatar.imageUrl}
                alt={userAvatar.description}
                data-ai-hint={userAvatar.imageHint}
            />
        )}
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </header>
  );
}
