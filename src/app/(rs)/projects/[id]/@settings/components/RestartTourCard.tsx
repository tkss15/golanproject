'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Play } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export function RestartTourCard() {
  const toast = useToast();

  const handleRestartTour = () => {
    // Reset tour guide state and start tour
    
    // Show success toast
    toast.success('סיור הדרכה', 'הסיור יופעל בטעינה הבאה של הדף');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <MapPin className="ml-2 h-4 w-4 text-primary" />
          סיור הדרכה
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>צפו בסיור הדרכה מחדש כדי להכיר את הממשק ואת האפשרויות השונות.</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          className="w-full flex items-center justify-center" 
          onClick={handleRestartTour}
        >
          <Play className="h-4 w-4 ml-2" />
          הפעל סיור הדרכה
        </Button>
      </CardFooter>
    </Card>
  );
}