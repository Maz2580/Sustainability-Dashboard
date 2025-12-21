import { MainCategoryDisplay, ChartType, Metric, WidgetType, KpiGridWidgetConfig, ChartGridWidgetConfig, RichTextWidgetConfig, Widget, EmbeddedContentWidgetConfig } from './types';
import {
  EnergyIcon, WaterIcon, WasteIcon, EmissionsIcon, UpTrendIcon, DownTrendIcon,
  BookOpenIcon, UsersIcon, ShoppingCartIcon, BuildingOfficeIcon, AcademicCapIcon,
  PublicationIcon, FlaskIcon, PlaneIcon, CogIcon
} from './components/Icons';

const RECHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#A020F0', '#FF69B4'];

export const ADMIN_EMAIL = 'mazdak.gh1995@gmail.com';

const teachingAndResearchMetrics: Metric[] = [
  {
    id: 'tr-teaching-learning-research',
    name: 'Teaching, Learning and Research',
    description: 'ArcGIS Experience — interactive materials for teaching and learning.',
    icon: BookOpenIcon,
    accentColor: 'border-teal-500', bgColor: 'bg-teal-500', textColor: 'text-teal-700',
    data: {
      widgets: [
        {
          id: 'tr-tlr-embed',
          type: WidgetType.EMBEDDED_CONTENT,
          config: {
            title: 'Interactive Teaching & Learning Experience',
            url: 'https://experience.arcgis.com/experience/665ad956533c46be86b67d84a96d588b',
            height: '80vh'
          } as EmbeddedContentWidgetConfig,
        }
      ] as Widget[],
    }
  },
  {
    id: 'tr-courses',
    name: 'FEIT Sustainability-Related Courses',
    description: 'Number and percentage of FEIT courses addressing sustainability.',
    icon: BookOpenIcon,
    accentColor: 'border-blue-500', bgColor: 'bg-blue-500', textColor: 'text-blue-700',
    data: {
      widgets: [
        {
          id: 'tr-courses-kpis',
          type: WidgetType.KPI_GRID,
          config: {
            title: 'Key Course Metrics',
            kpis: [
              { id: 'total-courses', label: 'Total FEIT Courses', value: 150, unit: 'courses', icon: BookOpenIcon },
              { id: 'sust-courses-num', label: 'Sust. Courses (Number)', value: 60, unit: 'courses', icon: BookOpenIcon },
              { id: 'sust-courses-perc', label: 'Sust. Courses (Percentage)', value: '40', unit: '%', icon: UpTrendIcon },
            ],
          } as KpiGridWidgetConfig,
        },
        {
          id: 'tr-courses-charts',
          type: WidgetType.CHART_GRID,
          config: {
            title: 'Course Trends & Breakdowns',
            charts: [
              {
                id: 'courses-trend', title: 'Sustainability Course Integration Trend (%)', type: ChartType.LINE,
                dataKeys: { name: 'name', value: 'value' }, colors: [RECHART_COLORS[0]],
                data: [ { name: '2021', value: 25 }, { name: '2022', value: 30 }, { name: '2023', value: 35 }, { name: '2024', value: 40 } ],
              }
            ],
          } as ChartGridWidgetConfig,
        },
        {
          id: 'tr-courses-description',
          type: WidgetType.RICH_TEXT,
          config: {
            title: 'About Course Sustainability',
            content: '<p>This section tracks the integration of sustainability principles into the curriculum of the Faculty of Engineering and Information Technology (FEIT). It measures both the absolute number and the percentage of courses that incorporate sustainability-related learning objectives, content, or assessments. The goal is to ensure graduates are equipped with the knowledge and skills to address sustainability challenges in their professional careers.</p><ul><li>Monitors subjects based on handbook data.</li><li>Tracks progress towards "Sustainability is integrated into curriculum".</li></ul>',
          } as RichTextWidgetConfig,
        }
      ] as Widget[],
    }
  },
  {
    id: 'tr-research-groups',
    name: 'FEIT Sustainability Research Groups',
    description: 'Number of FEIT research groups exploring sustainability-related topics.',
    icon: UsersIcon,
    accentColor: 'border-purple-500', bgColor: 'bg-purple-500', textColor: 'text-purple-700',
    data: {
      widgets: [
        {
          id: 'tr-research-kpis',
          type: WidgetType.KPI_GRID,
          config: {
            title: 'Research Group Statistics',
            kpis: [
              { id: 'total-research-groups', label: 'Total Research Groups', value: 45, unit: 'groups', icon: UsersIcon },
              { id: 'sust-research-groups', label: 'Sust. Research Groups', value: 12, unit: 'groups', icon: UpTrendIcon },
            ],
          } as KpiGridWidgetConfig,
        },
        {
          id: 'tr-research-charts',
          type: WidgetType.CHART_GRID,
          config: {
            title: 'Visualizing Research Focus',
            charts: [
              {
                id: 'research-focus-pie', title: 'Research Groups by Focus', type: ChartType.PIE,
                dataKeys: { name: 'name', value: 'value' },
                data: [ { name: 'Sustainability Focused', value: 12, fill: RECHART_COLORS[1] }, { name: 'Other Focus', value: 33, fill: RECHART_COLORS[2] } ],
              }
            ],
          } as ChartGridWidgetConfig,
        }
      ] as Widget[],
    }
  },
  {
    id: 'tr-subjects-content',
    name: 'FEIT Subjects with Sustainability Content',
    description: 'Number of FEIT subjects with integrated sustainability-related content.',
    icon: AcademicCapIcon,
    accentColor: 'border-indigo-500', bgColor: 'bg-indigo-500', textColor: 'text-indigo-700',
    data: {
       widgets: [
        {
          id: 'tr-subjects-kpis',
          type: WidgetType.KPI_GRID,
          config: {
            title: 'Subject Content Overview',
            kpis: [
              { id: 'total-subjects', label: 'Total FEIT Subjects', value: 450, unit: 'subjects', icon: AcademicCapIcon },
              { id: 'sust-subjects', label: 'Subjects with Sust. Content', value: 180, unit: 'subjects', icon: UpTrendIcon },
            ],
          } as KpiGridWidgetConfig,
        },
        {
          id: 'tr-subjects-charts',
          type: WidgetType.CHART_GRID,
          config: {
            title: 'Departmental Breakdown',
            charts: [
               {
                id: 'subjects-by-dept', title: 'Subjects with Sust. Content by Department', type: ChartType.BAR,
                dataKeys: { name: 'name', value: 'value' }, colors: [RECHART_COLORS[3]],
                data: [ { name: 'Civil Eng.', value: 40 }, { name: 'Mech. Eng.', value: 35 }, { name: 'CSE', value: 50 }, { name: 'Elec. Eng.', value: 30 }, { name: 'Chem. Eng.', value: 25 } ],
              }
            ],
          } as ChartGridWidgetConfig,
        }
      ] as Widget[],
    }
  },
  {
    id: 'tr-phd-students',
    name: 'FEIT PhD Students (Sustainability Topics)',
    description: 'Number of FEIT PhD students working on sustainability-related topics.',
    icon: UsersIcon,
    accentColor: 'border-pink-500', bgColor: 'bg-pink-500', textColor: 'text-pink-700',
    data: {
      widgets: [
        {
          id: 'tr-phd-kpis',
          type: WidgetType.KPI_GRID,
          config: {
            title: 'PhD Student Engagement',
            kpis: [
              { id: 'total-phd', label: 'Total PhD Students', value: 250, unit: 'students', icon: UsersIcon },
              { id: 'sust-phd', label: 'PhD Students (Sust. Topics)', value: 45, unit: 'students', icon: UpTrendIcon },
            ],
          } as KpiGridWidgetConfig,
        },
        {
          id: 'tr-phd-charts',
          type: WidgetType.CHART_GRID,
          config: {
            title: 'PhD Trends',
            charts: [
              {
                id: 'phd-sust-trend', title: 'PhD Students on Sust. Topics Trend', type: ChartType.AREA,
                dataKeys: { name: 'name', value: 'value' }, colors: [RECHART_COLORS[4]],
                data: [ { name: '2021', value: 30 }, { name: '2022', value: 35 }, { name: '2023', value: 40 }, { name: '2024', value: 45 } ],
              }
            ],
          } as ChartGridWidgetConfig,
        }
      ] as Widget[],
    }
  },
  {
    id: 'tr-publications',
    name: 'Sustainability-Related Publications from FEIT',
    description: 'Number of sustainability-related peer-reviewed publications from FEIT.',
    icon: PublicationIcon,
    accentColor: 'border-red-500', bgColor: 'bg-red-500', textColor: 'text-red-700',
    data: {
      widgets: [
        {
          id: 'tr-pubs-kpis',
          type: WidgetType.KPI_GRID,
          config: {
            title: 'Publication Output',
            kpis: [
              { id: 'total-pubs', label: 'Total Publications (Annual)', value: 750, unit: 'papers', icon: PublicationIcon },
              { id: 'sust-pubs', label: 'Sust. Publications (Annual)', value: 120, unit: 'papers', icon: UpTrendIcon },
            ],
          } as KpiGridWidgetConfig,
        },
        {
          id: 'tr-pubs-charts',
          type: WidgetType.CHART_GRID,
          config: {
            title: 'Publication Themes',
            charts: [
              {
                id: 'pubs-by-theme', title: 'Sust. Publications by Theme', type: ChartType.PIE,
                dataKeys: { name: 'name', value: 'value' },
                data: [ { name: 'Renewable Energy', value: 40, fill: RECHART_COLORS[5] }, { name: 'Water Management', value: 25, fill: RECHART_COLORS[6] }, { name: 'Sustainable Materials', value: 30, fill: RECHART_COLORS[7] }, { name: 'Climate Policy', value: 25, fill: RECHART_COLORS[8] } ],
              }
            ],
          } as ChartGridWidgetConfig,
        }
      ] as Widget[],
    }
  },
];

const operationsMetrics: Metric[] = [
  {
    id: 'op-labs',
    name: 'MyGreenLabs Certified Labs',
    description: 'Number of FEIT labs that are MyGreenLabs certified.',
    icon: FlaskIcon,
    accentColor: 'border-green-500', bgColor: 'bg-green-500', textColor: 'text-green-700',
    data: {
      widgets: [
        {
          id: 'op-labs-kpis',
          type: WidgetType.KPI_GRID,
          config: {
            title: 'Lab Certification Status',
            kpis: [
              { id: 'total-labs', label: 'Total FEIT Labs', value: 80, unit: 'labs', icon: FlaskIcon },
              { id: 'certified-labs', label: 'Certified Labs', value: 15, unit: 'labs', icon: UpTrendIcon },
              { id: 'certification-target', label: 'Certification Target', value: '30', unit: '%', icon: DownTrendIcon },
            ],
          } as KpiGridWidgetConfig,
        },
        {
          id: 'op-labs-charts',
          type: WidgetType.CHART_GRID,
          config: {
            title: 'Certification Levels',
            charts: [
               {
                id: 'lab-certification-progress', title: 'Lab Certification Progress (Number)', type: ChartType.BAR,
                dataKeys: { name: 'name', value: 'value' }, colors: [RECHART_COLORS[0]],
                data: [ { name: 'Bronze', value: 8 }, { name: 'Silver', value: 5 }, { name: 'Gold', value: 2 } ],
              }
            ],
          } as ChartGridWidgetConfig,
        }
      ] as Widget[],
    }
  },
  {
    id: 'op-water',
    name: 'Water Consumption',
    description: 'Total faculty water usage and conservation efforts.',
    icon: WaterIcon,
    accentColor: 'border-cyan-500', bgColor: 'bg-cyan-500', textColor: 'text-cyan-700',
    data: {
      widgets: [
        {
          id: 'op-water-kpis',
          type: WidgetType.KPI_GRID,
          config: {
            title: 'Key Water Metrics',
            kpis: [
              { id: 'total-water-usage', label: 'Total Water Usage', value: '7,500', unit: 'm³/yr', icon: WaterIcon },
              { id: 'water-reduction-yoy', label: 'Reduction (YoY)', value: '5', unit: '%', icon: DownTrendIcon },
              { id: 'recycled-water-use', label: 'Recycled Water Used', value: '1,200', unit: 'm³', icon: UpTrendIcon },
            ],
          } as KpiGridWidgetConfig,
        },
        {
          id: 'op-water-charts',
          type: WidgetType.CHART_GRID,
          config: {
            title: 'Consumption Trends',
            charts: [
              {
                id: 'monthly-water', title: 'Monthly Water Consumption (m³)', type: ChartType.LINE,
                dataKeys: { name: 'name', value: 'value' }, colors: [RECHART_COLORS[1]],
                data: [ { name: 'Jan', value: 650 }, { name: 'Feb', value: 600 }, { name: 'Mar', value: 620 }, { name: 'Apr', value: 580 }, { name: 'May', value: 550 }, { name: 'Jun', value: 530 } ],
              }
            ],
          } as ChartGridWidgetConfig,
        },
        {
            id: 'op-water-info',
            type: WidgetType.RICH_TEXT,
            config: {
                title: "Understanding Water Metrics",
                content: "<p>Water conservation is a key priority. This dashboard tracks:</p><ul><li><strong>Total Water Usage:</strong> Overall consumption by the faculty.</li><li><strong>Year-over-Year Reduction:</strong> Progress in reducing consumption.</li><li><strong>Recycled Water Used:</strong> Efforts to utilize alternative water sources.</li></ul><p>The monthly consumption chart helps identify trends and peak usage periods, informing targeted conservation strategies.</p>"
            } as RichTextWidgetConfig
        }
      ] as Widget[],
    }
  },
  {
    id: 'op-energy',
    name: 'Energy Consumption',
    description: 'Total faculty energy usage, renewable sources, and efficiency.',
    icon: EnergyIcon,
    accentColor: 'border-yellow-500', bgColor: 'bg-yellow-500', textColor: 'text-yellow-700',
    data: {
      widgets: [
        {
          id: 'op-energy-kpis',
          type: WidgetType.KPI_GRID,
          config: {
            title: 'Energy Performance Indicators',
            kpis: [
              { id: 'total-energy-kwh', label: 'Total Energy Usage', value: '1.2M', unit: 'kWh/yr', icon: EnergyIcon },
              { id: 'renewable-energy-perc', label: 'Renewable Energy %', value: '35', unit: '%', icon: UpTrendIcon },
              { id: 'energy-intensity', label: 'Energy Intensity', value: '150', unit: 'kWh/m²', icon: DownTrendIcon },
            ],
          } as KpiGridWidgetConfig,
        },
        {
          id: 'op-energy-charts',
          type: WidgetType.CHART_GRID,
          config: {
            title: 'Energy Source Distribution',
            charts: [
              {
                id: 'energy-source-pie', title: 'Energy Sources', type: ChartType.PIE,
                dataKeys: { name: 'name', value: 'value' },
                data: [ { name: 'Grid (Non-Renewable)', value: 65, fill: RECHART_COLORS[2] }, { name: 'Solar PV', value: 25, fill: RECHART_COLORS[3] }, { name: 'Other Renewable', value: 10, fill: RECHART_COLORS[4] } ],
              }
            ],
          } as ChartGridWidgetConfig,
        }
      ] as Widget[],
    }
  },
  {
    id: 'op-waste',
    name: 'Waste from FEIT',
    description: 'Waste generated and diversion rates (recycling, composting).',
    icon: WasteIcon,
    accentColor: 'border-orange-500', bgColor: 'bg-orange-500', textColor: 'text-orange-700',
    data: {
      widgets: [
        {
          id: 'op-waste-kpis',
          type: WidgetType.KPI_GRID,
          config: {
            title: 'Waste Management KPIs',
            kpis: [
              { id: 'total-waste', label: 'Total Waste Generated', value: '250', unit: 'tons/yr', icon: WasteIcon },
              { id: 'diversion-rate', label: 'Waste Diversion Rate', value: '65', unit: '%', icon: UpTrendIcon },
              { id: 'landfill-waste', label: 'Landfill Waste', value: '87.5', unit: 'tons/yr', icon: DownTrendIcon },
            ],
          } as KpiGridWidgetConfig,
        },
        {
          id: 'op-waste-charts',
          type: WidgetType.CHART_GRID,
          config: {
            title: 'Waste Stream Analysis',
            charts: [
              {
                id: 'waste-streams', title: 'Waste Streams (tons/yr)', type: ChartType.BAR,
                dataKeys: { name: 'name', value: 'value' }, colors: [RECHART_COLORS[5]],
                data: [ { name: 'Recycling', value: 130 }, { name: 'Compost', value: 32.5 }, { name: 'Landfill', value: 87.5 } ],
              }
            ],
          } as ChartGridWidgetConfig,
        }
      ] as Widget[],
    }
  },
  {
    id: 'op-air-travel',
    name: 'Air Travel Emissions',
    description: 'GHG emissions from staff and student air travel.',
    icon: PlaneIcon,
    accentColor: 'border-sky-500', bgColor: 'bg-sky-500', textColor: 'text-sky-700',
    data: {
      widgets: [
        {
          id: 'op-air-kpis',
          type: WidgetType.KPI_GRID,
          config: {
            title: 'Air Travel Impact',
            kpis: [
              { id: 'total-air-emissions', label: 'Air Travel Emissions', value: '650', unit: 'tCO2e/yr', icon: EmissionsIcon },
              { id: 'flights-count', label: 'Number of Flights', value: '800', unit: 'flights/yr', icon: PlaneIcon },
              { id: 'offset-percentage', label: 'Carbon Offset %', value: '20', unit: '%', icon: UpTrendIcon },
            ],
          } as KpiGridWidgetConfig,
        },
        {
          id: 'op-air-charts',
          type: WidgetType.CHART_GRID,
          config: {
            title: 'Emissions Trend',
            charts: [
              {
                id: 'air-travel-trend', title: 'Air Travel Emissions Trend (tCO2e)', type: ChartType.AREA,
                dataKeys: { name: 'name', value: 'value' }, colors: [RECHART_COLORS[6]],
                data: [ { name: '2021', value: 750 }, { name: '2022', value: 700 }, { name: '2023', value: 680 }, { name: '2024', value: 650 } ],
              }
            ],
          } as ChartGridWidgetConfig,
        }
      ] as Widget[],
    }
  },
];


export const INITIAL_MAIN_CATEGORIES_DATA: MainCategoryDisplay[] = [
  {
    id: 'teaching-research',
    title: 'Teaching and Research Metrics',
    description: 'Exploring FEIT\'s commitment to embedding sustainability in its core academic and research activities.',
    icon: BookOpenIcon,
    metrics: teachingAndResearchMetrics,
  },
  {
    id: 'operations',
    title: 'Operations Metrics',
    description: 'Assessing the environmental footprint and efficiency of FEIT\'s operational activities.',
    icon: CogIcon,
    metrics: operationsMetrics,
  }
];