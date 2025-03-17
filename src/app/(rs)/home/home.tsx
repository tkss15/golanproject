"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, Line, Doughnut } from "react-chartjs-2"
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
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

interface HomeComponentProps {
  firstName: string
  activeProjects: {
    data: Array<any>,
    accessibleCount: number,
    totalCount: number
  }
  completedProjects: {
    data: Array<any>,
    accessibleCount: number,
    totalCount: number
  }
  plannedProjects: {
    data: Array<any>,
    accessibleCount: number,
    totalCount: number
  }
  delayedProjects: {
    data: Array<any>,
    accessibleCount: number,
    totalCount: number
  }
  currentMonthProjects: number
  monthData: { month: string; total_count: number; user_count: number }[]
  last12Months: string[]
  villageBudgetData: any
  departmentData: any
  fundingSourcesData: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      tension: number
      fill: boolean
    }[]
  }
  upcomingProjects: {
    id: number;
    project_name: string | null;
    description: string | null;
    end_date: any;
    budget: any;
    status: string;
    priority: string;
    start_date: any;
    department_name: string;
    owner_first_name: string;
    owner_last_name: string;
    contact_email: string;
    contact_phone: string;
    created_at: any;
    updated_at: any;
  }[];
  newestProjects: {
    id: number;
    project_name: string | null;
    description: string | null;
    end_date: any;
    budget: any;
    status: string;
    priority: string;
    start_date: any;
    department_name: string;
    owner_first_name: string;
    owner_last_name: string;
    contact_email: string;
    contact_phone: string;
    created_at: any;
    updated_at: any;
  }[]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 6,
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom" as const,
      align: "start" as const,
      labels: {
        boxWidth: 10,
        font: {
          size: 14
        }
      }
    },
  },
}

const budgetChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      position: "left",
      ticks: {
        callback: (value) => {
          if (typeof value === "number") {
            return `₪${value.toLocaleString()}`
          }
          return value
        },
        font: {
          size: 12
        }
      },
    },
    x: {
      ticks: {
        autoSkip: true,
        maxRotation: 45,
        minRotation: 45,
        font: {
          size: 12
        }
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
      align: "start",
      labels: {
        boxWidth: 10,
        font: {
          size: 14
        }
      }
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

export default function Home({
  firstName,
  activeProjects,
  completedProjects,
  plannedProjects,
  delayedProjects,
  currentMonthProjects,
  monthData,
  last12Months,
  upcomingProjects,
  newestProjects,
  villageBudgetData,
  departmentData,
  fundingSourcesData,
}: HomeComponentProps) {
  const [openDialogId, setOpenDialogId] = useState<number | null>(null)
  const selectedProject = upcomingProjects.find(p => p.id === openDialogId)
  const [chosenProject, setChosenProject] = useState<any>(null)

  // נתונים להתפלגות סטטוס פרויקטים
  const statusData = {
    labels: ["בביצוע", "הושלם", "מעוכב", "בתכנון"],
    datasets: [
      {
        data: [activeProjects.totalCount, completedProjects.totalCount, delayedProjects.totalCount, plannedProjects.totalCount],
        backgroundColor: ["rgb(0, 182, 182)", "rgb(0, 51, 89)", "rgb(255, 99, 132)", "rgb(255, 205, 86)"],
      },
    ],
  }

  // Define a mock dataset for projects by status (in a real app, this would come from props)
  // Adding a hasAccess property to simulate permission checks
  const mockProjectsByStatus = {
    "בביצוע": [
      ...activeProjects.data.sort((a,b) => {
        if(a.hasAccess && !b.hasAccess)
          return -1;
        else if(!a.hasAccess && b.hasAccess)
          return 1;
        return 0;
      })
      // ...upcomingProjects.slice(0, 3).map(p => ({ ...p, status: "בביצוע", hasAccess: true })),
      // { id: 101, project_name: "פרויקט מוגבל 1", department_name: "מחלקת הנדסה", start_date: new Date(), end_date: new Date(2025, 5, 30), budget: 450000, description: "תיאור פרויקט מוגבל", status: "בביצוע", hasAccess: false },
      // { id: 102, project_name: "פרויקט מוגבל 2", department_name: "מחלקת שירותים", start_date: new Date(), end_date: new Date(2025, 8, 15), budget: 280000, description: "תיאור פרויקט מוגבל נוסף", status: "בביצוע", hasAccess: false }
    ],
    "הושלם": [
      ...completedProjects.data.sort((a,b) => {
        if(a.hasAccess && !b.hasAccess)
          return -1;
        else if(!a.hasAccess && b.hasAccess)
          return 1;
        return 0;
      })
    ],
    "מעוכב": [
      ...delayedProjects.data.sort((a,b) => {
        if(a.hasAccess && !b.hasAccess)
          return -1;
        else if(!a.hasAccess && b.hasAccess)
          return 1;
        return 0;
      })    ],
    "בתכנון": [
      ...plannedProjects.data.sort((a,b) => {
        if(a.hasAccess && !b.hasAccess)
          return -1;
        else if(!a.hasAccess && b.hasAccess)
          return 1;
        return 0;
      })
     ]
  };

  // State for status filter modal
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const monthlyData = {
    labels: last12Months,
    datasets: [
      {
        label: "הפרויקטים שלי",
        data: monthData.map((d) => d.user_count),
        backgroundColor: "rgb(0, 182, 182)",
        barPercentage: 0.5,
      },
      {
        label: "מספר פרויקטים בחודש זה",
        data: monthData.map((d) => d.total_count),
        backgroundColor: "rgb(0, 51, 89)",
        barPercentage: 0.5,
      },
    ],
  }

  // Get the current month's data (last item in the array)
  const currentMonthUserProjects = monthData[monthData.length - 1]?.user_count || 0

  const formatDate = (dateString: Date | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString("he", { month: "short" })
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  const handleProjectClick = (projectId: number) => {
    const project = newestProjects.find(p => p.id === projectId)
    setChosenProject(project)
    setOpenDialogId(projectId)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(amount)
  }

  return (
    <div className="p-4 md:p-8" dir="rtl">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-blue-800">שלום {firstName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <Card data-tg-order='2'  data-tg-tour='מציג את הכמות הכללית של פרוייקטים במערכת בלחיצה על תווית ניתן לשנות את הגרף'>
          <CardHeader className="p-4" >
            <CardTitle className="text-lg md:text-xl text-blue-800">מספר פרויקטים</CardTitle>
            <div className="text-xs md:text-sm text-gray-600">כמות פרויקטים חודשית</div>
            <div className="text-xs md:text-sm">
              הפרויקטים החודשיים שלי: {currentMonthUserProjects} / מספר פרויקטים חודשי(נוכחי): {currentMonthProjects}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 md:h-64 lg:h-72">
              <Bar data={monthlyData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-lg md:text-xl text-blue-800">מקורות מימון מובילים</CardTitle>
            <div className="text-xs md:text-sm text-gray-600">מקורות המימון המובילים בפרויקטים פעילים / בתכנון</div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 md:h-64 lg:h-72">
              <Bar
                data={{
                  labels: fundingSourcesData.labels,
                  datasets: [
                    {
                      label: 'תקציב',
                      data: fundingSourcesData.datasets[0].data,
                      backgroundColor: [
                        'rgba(0, 182, 182, 0.7)',
                        'rgba(0, 51, 89, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                      ],
                      borderColor: [
                        'rgb(0, 182, 182)',
                        'rgb(0, 51, 89)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(75, 192, 192)',
                        'rgb(255, 159, 64)',
                      ],
                      borderWidth: 1,
                      maxBarThickness: 50
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => {
                          if (typeof value === "number") {
                            // Abbreviate large numbers
                            if (value >= 1000000) {
                              return `₪${(value / 1000000).toFixed(1)}M`;
                            } else if (value >= 1000) {
                              return `₪${(value / 1000).toFixed(0)}K`;
                            }
                            return `₪${value.toLocaleString()}`;
                          }
                          return value;
                        },
                        font: {
                          size: 12
                        }
                      },
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          const value = tooltipItem.parsed.y;
                          return `תקציב: ₪${value.toLocaleString()}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card data-tg-order='3' data-tg-tour='מציג שכלול של כלל הפרוייקטים הרלוונטים למשתמש המחובר. בלחיצה על אחד מן הסטטוסים תוצג רשימה של פרוייקטים רלוונטים'>
          <CardHeader className="p-4">
            <CardTitle className="text-lg md:text-xl text-blue-800">סטטוס פרויקטים</CardTitle>
            <div className="text-xs md:text-sm text-gray-600">התפלגות לפי סטטוס</div>
          </CardHeader>
          <CardContent className="p-4 flex justify-center">
            <div className="w-full md:w-[280px] lg:w-[350px] h-64 md:h-64 lg:h-72">
              <Doughnut
                data={statusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        boxWidth: 10,
                        font: {
                          size: 14
                        },
                        padding: 30,
                        usePointStyle: true,
                        pointStyle: 'circle'
                      },
                      title: {
                        padding: {
                          right: 20
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        title: (context) => context[0].label,
                        label: (context) => {
                          return `מספר פרויקטים: ${context.raw}`;
                        },
                        footer: () => 'לחץ כדי לראות פרויקטים'
                      }
                    }
                  },
                  layout: {
                    padding: {
                      right: 30
                    }
                  },
                  // Add onClick handler
                  onClick: (event, elements) => {
                    if (elements && elements.length > 0) {
                      const index = elements[0].index;
                      const statusLabel = statusData.labels[index] as string;
                      setSelectedStatus(statusLabel);
                      setStatusDialogOpen(true);
                    }
                  },
                  // Make cursor show as pointer when hovering over chart
                  onHover: (event, elements) => {
                    if (event && event.native) {
                      const canvas = event.native.target as HTMLCanvasElement;
                      canvas.style.cursor = elements && elements.length > 0 ? 'pointer' : 'default';
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Status Filter Dialog */}
        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogContent className="w-full max-w-[95vw] md:max-w-[800px] rtl p-4" dir="rtl">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-xl md:text-3xl font-bold text-blue-800 text-right flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{
                    backgroundColor: selectedStatus === 'בביצוע' ? 'rgb(0, 182, 182)' :
                                   selectedStatus === 'הושלם' ? 'rgb(0, 51, 89)' :
                                   selectedStatus === 'מעוכב' ? 'rgb(255, 99, 132)' :
                                   selectedStatus === 'בתכנון' ? 'rgb(255, 205, 86)' : '#ccc'
                  }}
                />
                פרויקטים בסטטוס: {selectedStatus}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
              {selectedStatus && mockProjectsByStatus[selectedStatus] && mockProjectsByStatus[selectedStatus].length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {mockProjectsByStatus[selectedStatus].map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-blue-800">{project.project_name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge 
                            style={{
                              backgroundColor: selectedStatus === 'בביצוע' ? 'rgb(0, 182, 182)' :
                                             selectedStatus === 'הושלם' ? 'rgb(0, 51, 89)' :
                                             selectedStatus === 'מעוכב' ? 'rgb(255, 99, 132)' :
                                             selectedStatus === 'בתכנון' ? 'rgb(255, 205, 86)' : '#ccc'
                            }}
                          >
                            {selectedStatus}
                          </Badge>
                          {!project.hasAccess && (
                            <Badge variant="outline" className="border-orange-500 text-orange-500">
                              גישה מוגבלת
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <span className="font-semibold">תאריך התחלה: </span>
                          <span>{formatDate(project.start_date)}</span>
                        </div>
                        <div>
                          <span className="font-semibold">תאריך סיום: </span>
                          <span>{formatDate(project.end_date)}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <span className="font-semibold">מחלקה: </span>
                          <span>{project.department_name}</span>
                        </div>
                        <div>
                          <span className="font-semibold">תקציב: </span>
                          <span>{formatCurrency(project.budget)}</span>
                        </div>
                      </div>
                      
                      {project.description && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        {project.hasAccess ? (
                          <Button 
                            size="sm"
                            onClick={() => window.location.href = `/projects/${project.id}`}
                          >
                            עבור לפרויקט
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            variant="outline"
                            disabled
                            className="text-gray-500 cursor-not-allowed"
                          >
                            אין גישה לפרויקט
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">לא נמצאו פרויקטים בסטטוס זה</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-lg md:text-xl text-blue-800">מחלקות מובילות</CardTitle>
            <div className="text-xs md:text-sm text-gray-600">מחלקות מובילות לפי מספר פרויקטים</div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 md:h-64 lg:h-72">
              <Bar
                data={{
                  labels: departmentData.labels,
                  datasets: [
                    {
                      label: 'פרויקטים פעילים',
                      data: departmentData.datasets[0].data.map((value, index) => value * 0.6), // Simulating active projects
                      backgroundColor: 'rgba(0, 182, 182, 0.7)',
                      borderColor: 'rgb(0, 182, 182)',
                      borderWidth: 1,
                      barPercentage: 0.8,
                      categoryPercentage: 0.5
                    },
                    {
                      label: 'פרויקטים מתוכננים',
                      data: departmentData.datasets[0].data.map((value, index) => value * 0.3), // Simulating planned projects
                      backgroundColor: 'rgba(0, 51, 89, 0.7)',
                      borderColor: 'rgb(0, 51, 89)',
                      borderWidth: 1,
                      barPercentage: 0.8,
                      categoryPercentage: 0.5
                    },
                    {
                      label: 'פרויקטים הושלמו',
                      data: departmentData.datasets[0].data.map((value, index) => value * 0.1), // Simulating completed projects
                      backgroundColor: 'rgba(54, 162, 235, 0.7)',
                      borderColor: 'rgb(54, 162, 235)',
                      borderWidth: 1,
                      barPercentage: 0.8,
                      categoryPercentage: 0.5
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      stacked: true,
                      ticks: {
                        stepSize: 1,
                        precision: 0,
                        font: {
                          size: 12
                        }
                      },
                    },
                    x: {
                      stacked: true,
                      ticks: {
                        font: {
                          size: 12
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: {
                        boxWidth: 10,
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${Math.round(context.parsed.y)} פרויקטים`,
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 mb-4 md:mb-6">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-lg md:text-xl text-blue-800">חלוקת תקציב בין ישובים</CardTitle>
            <div className="text-xs md:text-sm text-gray-600">תקציב פרויקטים ישובי כולל</div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 md:h-80">
              <Bar data={villageBudgetData} options={budgetChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6" data-tg-order='4' data-tg-tour="פרויקטים קרובים ומעקב - לחץ על שם הפרויקט לפרטים נוספים ולמעבר לדף הפרויקט"> 
        {/* רשימת הפרויקטים הקרובים לסיום */}
        <Card className="mb-4 md:mb-0">
          <CardHeader className="p-4">
            <CardTitle className="text-xl md:text-2xl text-blue-800">פרויקטים קרובים לסיום</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {upcomingProjects.map((project) => (
                <div key={project.id} className="flex justify-between items-center border-b pb-2">
                  <Dialog
                    open={openDialogId === project.id}
                    onOpenChange={(open) => setOpenDialogId(open ? project.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        className="text-blue-800 p-0 h-auto font-normal text-sm md:text-lg text-right"
                        onClick={() => handleProjectClick(project.id)}
                      >
                        {project.project_name}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-[95vw] md:max-w-[600px] rtl p-4" dir="rtl">
                      <DialogHeader className="border-b pb-4">
                        <DialogTitle className="text-xl md:text-3xl font-bold text-blue-800 text-right">
                          {selectedProject?.project_name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">תיאור</h3>
                            <p className="text-gray-900 text-sm md:text-base">{selectedProject?.description}</p>
                          </div>
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">מחלקה</h3>
                            <p className="text-gray-900 text-sm md:text-base">{selectedProject?.department_name}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">תקציב</h3>
                            <p className="text-gray-900 text-sm md:text-base">{formatCurrency(selectedProject?.budget)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">בעלים</h3>
                            <p className="text-gray-900 text-sm md:text-base">{`${selectedProject?.owner_first_name} ${selectedProject?.owner_last_name}`}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">תאריך התחלה</h3>
                            <p className="text-gray-900 text-sm md:text-base">{formatDate(selectedProject?.start_date)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">תאריך סיום</h3>
                            <p className="text-gray-900 text-sm md:text-base">{formatDate(selectedProject?.end_date)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">אימייל ליצירת קשר</h3>
                            <p className="text-gray-900 text-sm md:text-base break-words">{selectedProject?.contact_email}</p>
                          </div>
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">טלפון ליצירת קשר</h3>
                            <p className="text-gray-900 text-sm md:text-base">{selectedProject?.contact_phone}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">נוצר בתאריך</h3>
                            <p className="text-gray-900 text-sm md:text-base">{formatDate(selectedProject?.created_at)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">עודכן לאחרונה</h3>
                            <p className="text-gray-900 text-sm md:text-base">{formatDate(selectedProject?.updated_at)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">סטטוס</h3>
                            <p className="text-gray-900 text-sm md:text-base">{selectedProject?.status}</p>
                          </div>
                          <div className="p-3 md:p-4 rounded-lg flex justify-center items-center">
                            <Button
                              variant="default"
                              className="text-sm md:text-base w-full"
                              onClick={() => window.location.href = `/projects/${selectedProject?.id}`}
                            >
                              עבור לעמוד הפרויקט
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <span className="text-gray-600 text-xs md:text-sm">{formatDate(project.end_date)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* רשימת הפרויקטים החדשים האחרונים */}
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-xl md:text-2xl text-blue-800">פרויקטים חדשים אחרונים</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {newestProjects.map((project, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <Dialog
                    open={openDialogId === project.id}
                    onOpenChange={(open) => setOpenDialogId(open ? project.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        className="text-blue-800 p-0 h-auto font-normal text-sm md:text-lg text-right"
                        onClick={() => handleProjectClick(project.id)}
                      >
                        {project.project_name}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-[95vw] md:max-w-[600px] rtl p-4" dir="rtl">
                      <DialogHeader className="border-b pb-4">
                        <DialogTitle className="text-xl md:text-3xl font-bold text-blue-800 text-right">
                          {chosenProject?.project_name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">תיאור</h3>
                            <p className="text-gray-900 text-sm md:text-base">{chosenProject?.description}</p>
                          </div>
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">מחלקה</h3>
                            <p className="text-gray-900 text-sm md:text-base">{chosenProject?.department_name}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">תקציב</h3>
                            <p className="text-gray-900 text-sm md:text-base">{formatCurrency(chosenProject?.budget)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">בעלים</h3>
                            <p className="text-gray-900 text-sm md:text-base">{`${chosenProject?.owner_first_name} ${chosenProject?.owner_last_name}`}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">תאריך התחלה</h3>
                            <p className="text-gray-900 text-sm md:text-base">{formatDate(chosenProject?.start_date)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">תאריך סיום</h3>
                            <p className="text-gray-900 text-sm md:text-base">{formatDate(chosenProject?.end_date)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">אימייל ליצירת קשר</h3>
                            <p className="text-gray-900 text-sm md:text-base break-words">{chosenProject?.contact_email}</p>
                          </div>
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">טלפון ליצירת קשר</h3>
                            <p className="text-gray-900 text-sm md:text-base">{chosenProject?.contact_phone}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">נוצר בתאריך</h3>
                            <p className="text-gray-900 text-sm md:text-base">{formatDate(chosenProject?.created_at)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">עודכן לאחרונה</h3>
                            <p className="text-gray-900 text-sm md:text-base">{formatDate(chosenProject?.updated_at)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">סטטוס</h3>
                            <p className="text-gray-900 text-sm md:text-base">{chosenProject?.status}</p>
                          </div>
                          <div className="p-3 md:p-4 rounded-lg flex justify-center items-center">
                            <Button
                              variant="default"
                              className="text-sm md:text-base w-full"
                              onClick={() => window.location.href = `/projects/${chosenProject?.id}`}
                            >
                              עבור לעמוד הפרויקט
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <span className="text-gray-600 text-xs md:text-sm">{formatDate(project.created_at)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}