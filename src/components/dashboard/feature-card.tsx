import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

type FeatureCardProps = {
  Icon: LucideIcon;
  title: string;
  description: string;
  badgeText?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
};

export function FeatureCard({ Icon, title, description, badgeText, badgeVariant }: FeatureCardProps) {
  return (
    <Card className="group flex flex-col hover:border-primary transition-colors cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Icon className="h-6 w-6" />
          </div>
          {badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="mb-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <div className="p-6 pt-0">
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
      </div>
    </Card>
  );
}
