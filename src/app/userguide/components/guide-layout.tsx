"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface GuideLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function GuideLayout({ title, description, children }: GuideLayoutProps) {
  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <div className="mb-6">
        <Link 
          href="/userguide" 
          className="flex items-center mb-4 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> חזרה למדריך
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      
      <Separator className="my-6" />
      
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
