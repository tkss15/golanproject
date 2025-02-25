"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "@radix-ui/react-icons";

interface Statistics {
  households: number;
  population: number;
  population_2030: number;
  growth_rate: number;
  updatedAt: Date;
  topics_of_interest: string[];
  nearby_projects: string[];
}

interface EditableStatisticsProps {
  statistics: Statistics;
  isEditing: boolean;
  onSave: (data: {
    households: number;
    population: number;
    population_2030: number;
    growth_rate: number;
  }) => void;
}

export default function EditableStatistics({ statistics, isEditing, onSave }: EditableStatisticsProps) {
  const [localStats, setLocalStats] = useState({
    households: statistics.households,
    population: statistics.population,
    population_2030: statistics.population_2030,
    growth_rate: statistics.growth_rate,
  });

  // Only update local state when statistics prop changes
  useEffect(() => {
    if (!isEditing) {
      setLocalStats({
        households: statistics.households,
        population: statistics.population,
        population_2030: statistics.population_2030,
        growth_rate: statistics.growth_rate,
      });
    }
  }, [statistics, isEditing]);

  const handleChange = (field: keyof typeof localStats, value: string) => {
    const newStats = {
      ...localStats,
      [field]: Number(value)
    };
    setLocalStats(newStats);
    onSave(newStats);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">בתי אב</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Input
              type="number"
              value={localStats.households}
              onChange={(e) => handleChange('households', e.target.value)}
              className="text-2xl font-bold"
            />
          ) : (
            <div className="text-2xl font-bold">{localStats.households}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">מספר תושבים</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Input
              type="number"
              value={localStats.population}
              onChange={(e) => handleChange('population', e.target.value)}
              className="text-2xl font-bold"
            />
          ) : (
            <div className="text-2xl font-bold">{localStats.population}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">צפי מוערך לשנת 2030</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Input
              type="number"
              value={localStats.population_2030}
              onChange={(e) => handleChange('population_2030', e.target.value)}
              className="text-2xl font-bold"
            />
          ) : (
            <div className="text-2xl font-bold">{localStats.population_2030}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">אחוז צמיחה צפוי</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Input
              type="number"
              value={localStats.growth_rate}
              onChange={(e) => handleChange('growth_rate', e.target.value)}
              className="text-2xl font-bold"
            />
          ) : (
            <div className="text-2xl font-bold">{`${localStats.growth_rate}%`}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}