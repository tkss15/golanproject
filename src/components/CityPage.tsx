"use client"
import { useState, useEffect } from "react"
import { updateSettlementStatistics } from "@/lib/actions/updateSettlementStatistics";
import EditableStatistics from "@/components/EditableStatistics";
import EditableTopicsCard from "@/components/EditableTopicsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "@radix-ui/react-icons"
import { type insertSettlementSchemaType, type insertStatisticsSchemaType } from "@/zod-schemas/city"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { format } from 'date-fns'
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  type ChartOptions,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

type ProjectWithSettlement = {
  projects: {
    id: number;
    project_name: string;
    description: string;
    start_date: Date;
  };
  project_settlements: {
    settlement_id: number;
    project_id: number;
  };
}

type Props  = {
  settlement: insertSettlementSchemaType,
  settlement_statistics: Array<insertStatisticsSchemaType>
  projects: ProjectWithSettlement[];
}

const parseTopics = (topics: string | string[] | null | undefined): string[] => {
  if (!topics) return [];
  if (Array.isArray(topics)) return topics;
  try {
    return JSON.parse(topics);
  } catch (e) {
    console.error('Error parsing topics:', e);
    return [];
  }
};

const parseProjects = (projects: string | string[] | null | undefined): string[] => {
  if (!projects) return [];
  if (Array.isArray(projects)) return projects;
  try {
    return JSON.parse(projects);
  } catch (e) {
    console.error('Error parsing projects:', e);
    return [];
  }
};

export default function StatisticsDashboard({ settlement, settlement_statistics, projects} : Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStats, setEditedStats] = useState({
    households: settlement_statistics[0].households,
    population: settlement_statistics[0].population,
    population_2030: settlement_statistics[0].population_2030,
    growth_rate: settlement_statistics[0].growth_rate,
  });
  const [editedTopics, setEditedTopics] = useState<string[]>(parseTopics(settlement_statistics[0].topics_of_interest));
  const [editedProjects, setEditedProjects] = useState<string[]>(parseProjects(settlement_statistics[0].nearby_projects));
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const [chosenProject, setChosenProject] = useState<any | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const updateDate = settlement_statistics[0].updatedAt !== undefined ? 
    new Date(settlement_statistics[0].updatedAt) : 
    new Date();

  const handleStatsChange = (newStats: typeof editedStats) => {
    if (isEditing) {
      setEditedStats(newStats);
    }
  };
  
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('he-IL');
  };
  
  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '₪0';
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
    }).format(amount);
  };

  const updatedAt = settlement_statistics[0]?.updatedAt ? 
    typeof settlement_statistics[0].updatedAt === 'string' ?
      new Date(settlement_statistics[0].updatedAt) :
      settlement_statistics[0].updatedAt :
    new Date();
  
  const groupProjectsByYear = (projects: any[]) => {
    const currentYear = new Date().getFullYear();
    const result: Record<string, any[]> = {
      '-1': [],
      '0': [],
      '1': [],
      '2': [],
      '3': []
    };
  
    projects.forEach(projectData => {
      const projectYear = new Date(projectData.projects.start_date).getFullYear();
      const yearDiff = projectYear - currentYear;
  
      if (yearDiff >= -1 && yearDiff <= 3) {
        result[yearDiff.toString()].push(projectData);
      }
    });
  
    return result;
  };
  
  const projectsByYear = groupProjectsByYear(projects);

  const handleProjectClick = (projectId: number) => {
    const project = projects.find(p => p.projects.id === projectId);
    setChosenProject(project);
  };

    const groupBudgetsByYear = (projects: any[]) => {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 5 }, (_, i) => (currentYear - 1 + i).toString());
      
      // Initialize yearly totals
      const yearlyTotals = projects.reduce((acc, projectData) => {
          const projectYear = new Date(projectData.projects.start_date).getFullYear().toString();
          if (!acc[projectYear]) {
              acc[projectYear] = 0;
          }
          acc[projectYear] += projectData.projects.budget || 0;
          return acc;
      }, {} as Record<string, number>);
  
      // Create chart data
      const budgetChartData = {
          labels: years,
          datasets: [{
              label: 'תקציב שנתי',
              data: years.map(year => yearlyTotals[year] || 0),
              backgroundColor: 'rgba(0, 50, 150, 0.7)',
          }]
      };
  
      return budgetChartData;
  };

  const budgetChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            type: 'linear',
            beginAtZero: true,
            position: "left",
            ticks: {
                callback: (value) => {
                    if (typeof value === "number") {
                        return `₪${value.toLocaleString()}`
                    }
                    return value
                },
            },
        },
        x: {
            type: 'category',
            ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45,
            },
        },
    },
    plugins: {
        legend: {
            position: "bottom",
            align: "start",
        },
        tooltip: {
            callbacks: {
                title: (context) => {
                    const value = context[0].raw
                    if (typeof value === "number") {
                        return `₪${value.toLocaleString()}`
                    }
                    return ""
                },
            },
        },
    },
}

type SettlementStatistic = {
  settlement_id: number;
  households: number;
  population: number;
  population_2030: number;
  growth_rate: number;
  id?: number;
  updatedAt?: Date;
  topics_of_interest: string | string[] | null;
  nearby_projects: string | string[] | null;
};

const handlePrintPDF = () => {
  window.print();
};

const handleSaveStatistics = async (data: any) => {
  if (!settlement?.settlement_id) {
    console.error('No settlement ID found');
    return;
  }

  try {
    const result = await updateSettlementStatistics(settlement.settlement_id, {
      households: Number(data.households),
      population: Number(data.population),
      population_2030: Number(data.population_2030),
      growth_rate: Number(data.growth_rate),
      topics_of_interest: data.topics_of_interest,
      nearby_projects: data.nearby_projects
    });

    if (result.success) {
      setIsEditing(false);
      // Force a refresh of the page to get new data
      window.location.reload();
    } else {
      console.error('Failed to save statistics:', result.error);
    }
  } catch (error) {
    console.error('Error saving statistics:', error);
  }
};

const handleSaveAll = async () => {
  if (!settlement?.settlement_id) {
    console.error('No settlement ID found');
    return;
  }

  try {
    const result = await updateSettlementStatistics(settlement.settlement_id, {
      ...editedStats,
      topics_of_interest: editedTopics,
      nearby_projects: editedProjects
    });

    if (result.success) {
      setIsEditing(false);
      window.location.reload();
    } else {
      console.error('Failed to save statistics:', result.error);
    }
  } catch (error) {
    console.error('Error saving all changes:', error);
  }
};

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Hero Section */}
      <div className={`relative ${isMobile ? 'h-[200px]' : 'h-[300px]'} w-full`}>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/${settlement.name}/photo_1.jpg?height=300&width=1200')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full flex items-end p-6">
            <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-white`}>{settlement.name}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className={`${isMobile ? 'flex flex-col gap-3' : 'flex justify-between items-center'} mb-6`}>
          <h2 className="text-2xl font-semibold">מצב דמוגרפי:</h2>
          <div className={`${isMobile ? 'flex flex-wrap gap-2' : 'flex gap-4'}`}>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "destructive" : "default"}
              className={isMobile ? "flex-grow text-sm" : ""}
            >
              {isEditing ? 'ביטול עריכה' : 'מצב עריכה'}
            </Button>
            {isEditing && (
              <Button 
                onClick={handleSaveAll}
                className={isMobile ? "flex-grow text-sm" : ""}
              >
                שמור שינויים
              </Button>
            )}
            <Button 
              onClick={handlePrintPDF}
              className={isMobile ? "flex-grow text-sm" : ""}
            >
              שמור כ-PDF
            </Button>
            <Button 
              className={isMobile ? "flex-grow text-sm" : ""}
            >
              ייצא מידע ל-Excel
            </Button>
          </div>
        </div>
        
        {/* Statistics Grid */}
        <EditableStatistics 
          statistics={{
            ...editedStats,
            updatedAt: updateDate,
            topics_of_interest: editedTopics,
            nearby_projects: editedProjects
          }}
          isEditing={isEditing}
          onSave={handleStatsChange}
        />
        <h2 className="text-2xl font-semibold mb-6">תכנית ראשונית – עיקרי החומש הישובי</h2>
        
        {/* Mobile tabs */}
        {isMobile ? (
          <Tabs defaultValue={new Date().getFullYear().toString()} className="mb-8">
            <TabsList className="grid w-full grid-cols-5 gap-1">
              {Array.from({ length: 5 }, (_, index) => {
                const year = (new Date().getFullYear() - 1) + index;
                return (
                  <TabsTrigger key={year} value={year.toString()} className="text-xs">
                    {year}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {Array.from({ length: 5 }, (_, index) => {
              const year = (new Date().getFullYear() - 1) + index;
              return (
                <TabsContent key={year} value={year.toString()}>
                  <Card>
                    <CardContent className="space-y-2 pt-4 text-right px-3">
                      {projectsByYear[(index - 1).toString()]?.length > 0 ? (
                        <div className="space-y-2">
                          {projectsByYear[(index - 1).toString()].map((project, idx) => (
                            <div key={idx} className="flex justify-end items-center border-b pb-2">
                              <Dialog
                                open={openDialogId === project.projects.id}
                                onOpenChange={(open) => setOpenDialogId(open ? project.projects.id : null)}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="link"
                                    className="p-0 h-auto font-normal text-base text-right"
                                    onClick={() => handleProjectClick(project.projects.id)}
                                  >
                                    {`${project.projects.project_name} - ${project.projects.description}`}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[95vw] rtl" dir="rtl">
                                  <DialogHeader className="border-b pb-4">
                                    <DialogTitle className="text-xl font-bold text-blue-800 text-right">
                                      {chosenProject?.projects.project_name}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4 space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                      {/* Mobile dialog content - stacked layout */}
                                      <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">תיאור</h3>
                                        <p className="text-gray-900">{chosenProject?.projects.description}</p>
                                      </div>
                                      <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">מחלקה</h3>
                                        <p className="text-gray-900">{chosenProject?.department_name}</p>
                                      </div>
                                      <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">תקציב</h3>
                                        <p className="text-gray-900">{formatCurrency(chosenProject?.projects.budget)}</p>
                                      </div>
                                      <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">בעלים</h3>
                                        <p className="text-gray-900">
                                          {`${chosenProject?.owner_first_name} ${chosenProject?.owner_last_name}`}
                                        </p>
                                      </div>
                                      <Button
                                        variant="default"
                                        className="w-full mt-2"
                                        onClick={() => window.location.href = `/projects/${chosenProject?.projects.id}`}
                                      >
                                        עבור לעמוד הפרויקט
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>אין תוכן זמין לשנה זו</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        ) : (
          /* Original desktop tabs */
          <Tabs defaultValue={new Date().getFullYear().toString()} className="mb-8">
            <TabsList className="grid w-full grid-cols-5">
              {Array.from({ length: 5 }, (_, index) => {
                const year = (new Date().getFullYear() - 1) + index;
                return (
                  <TabsTrigger key={year} value={year.toString()}>
                    {year}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {Array.from({ length: 5 }, (_, index) => {
              const year = (new Date().getFullYear() - 1) + index;
              return (
                <TabsContent key={year} value={year.toString()}>
                  <Card>
                  <CardContent className="space-y-2 pt-6 text-right">
                    {projectsByYear[(index - 1).toString()]?.length > 0 ? (
                      <div className="space-y-2">
                        {projectsByYear[(index - 1).toString()].map((project, idx) => (
                          <div key={idx} className="flex justify-end items-center border-b pb-2">
                            <Dialog
                              open={openDialogId === project.projects.id}
                              onOpenChange={(open) => setOpenDialogId(open ? project.projects.id : null)}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="link"
                                  className="p-0 h-auto font-normal text-lg text-right"
                                  onClick={() => handleProjectClick(project.projects.id)}
                                >
                                  {`${project.projects.project_name} - ${project.projects.description}`}
                                </Button>
                              </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] rtl" dir="rtl">
                                  <DialogHeader className="border-b pb-4">
                                    <DialogTitle className="text-3xl font-bold text-blue-800 text-right">
                                      {chosenProject?.projects.project_name}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">תיאור</h3>
                                        <p className="text-gray-900">{chosenProject?.projects.description}</p>
                                      </div>
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">מחלקה</h3>
                                        <p className="text-gray-900">{chosenProject?.department_name}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">תקציב</h3>
                                        <p className="text-gray-900">{formatCurrency(chosenProject?.projects.budget)}</p>
                                      </div>
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">בעלים</h3>
                                        <p className="text-gray-900">
                                          {`${chosenProject?.owner_first_name} ${chosenProject?.owner_last_name}`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">תאריך התחלה</h3>
                                        <p className="text-gray-900">{formatDate(chosenProject?.projects.start_date)}</p>
                                      </div>
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">תאריך סיום</h3>
                                        <p className="text-gray-900">{formatDate(chosenProject?.projects.end_date)}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">אימייל ליצירת קשר</h3>
                                        <p className="text-gray-900">{chosenProject?.projects.contact_email}</p>
                                      </div>
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">טלפון ליצירת קשר</h3>
                                        <p className="text-gray-900">{chosenProject?.projects.contact_phone}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">נוצר בתאריך</h3>
                                        <p className="text-gray-900">{formatDate(chosenProject?.projects.created_at)}</p>
                                      </div>
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">עודכן לאחרונה</h3>
                                        <p className="text-gray-900">{formatDate(chosenProject?.projects.updated_at)}</p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-700 mb-2">סטטוס</h3>
                                        <p className="text-gray-900">{chosenProject?.projects.status}</p>
                                      </div>
                                      <div className="p-4 rounded-lg flex justify-center items-center">
                                        <Button
                                          variant="default"
                                          className=""
                                          onClick={() => window.location.href = `/projects/${chosenProject?.projects.id}`}
                                        >
                                          עבור לעמוד הפרויקט
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>אין תוכן זמין לשנה זו</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        )}

        {/* Bottom Section */}
        {isMobile ? (
          <div className="grid grid-cols-1 gap-4">
            <EditableTopicsCard
              topics={editedTopics}              
              projects={editedProjects}
              isEditing={isEditing}
              onChange={(newTopics, newProjects) => {
                setEditedTopics(newTopics);
                setEditedProjects(newProjects);
              }}
            />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">תקציב פרויקטים לפי שנים</CardTitle>
                <div className="text-xs">תקציב שנתי כולל</div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <Bar data={groupBudgetsByYear(projects)} options={budgetChartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EditableTopicsCard
              topics={editedTopics}              
              projects={editedProjects}
              isEditing={isEditing}
              onChange={(newTopics, newProjects) => {
                setEditedTopics(newTopics);
                setEditedProjects(newProjects);
              }}
            />
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">תקציב פרויקטים לפי שנים</CardTitle>
                <div className="text-sm">תקציב שנתי כולל</div>
              </CardHeader>
              <CardContent>
                <Bar data={groupBudgetsByYear(projects)} options={budgetChartOptions} height={300} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}