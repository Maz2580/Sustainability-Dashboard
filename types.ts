import React from 'react';

export enum ChartType {
  BAR = 'bar',
  LINE = 'line',
  PIE = 'pie',
  AREA = 'area',
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
  fill?: string; // For pie chart custom slice colors
}

export interface Kpi {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  icon?: (props: { className?: string }) => React.ReactNode;
  bgColor?: string; // Tailwind background color class
  textColor?: string; // Tailwind text color class
}

export interface DashboardChart {
  id:string;
  title: string;
  type: ChartType;
  data: ChartDataPoint[];
  dataKeys: { value: string, name: string, value2?: string }; // e.g. { value: 'value', name: 'name', value2: 'value2' }
  colors?: string[]; // For chart series, e.g. ['#8884d8', '#82ca9d']
}

// New Widget System
export enum WidgetType {
  KPI_GRID = 'kpi_grid',
  CHART_GRID = 'chart_grid',
  RICH_TEXT = 'rich_text',
  INDICATOR = 'indicator',
  EMBEDDED_CONTENT = 'embedded_content',
  TABLE = 'table',
  LIST = 'list',
  GAUGE = 'gauge',
  DETAILS = 'details', // New Widget Type
}

export interface KpiGridWidgetConfig {
  title?: string; // Optional title for the KPI grid section
  kpis: Kpi[];
}

export interface ChartGridWidgetConfig {
  title?: string; // Optional title for the Chart grid section
  charts: DashboardChart[];
}

export interface RichTextWidgetConfig {
  title?: string; // Optional title for the rich text block
  content: string; // HTML content
}

export interface IndicatorWidgetConfig {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  valueColor?: string; // e.g., 'text-green-500', 'text-red-500'
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

export interface EmbeddedContentWidgetConfig {
  title?: string;
  url: string;
  height?: string; // e.g., "400px", "50vh", "100%"
}

export interface TableWidgetConfig {
  title?: string;
  headers: string[];
  rows: (string | number)[][];
  isCsvSource?: boolean; // Flag to indicate if data came from a CSV
}

export interface ListWidgetItem {
  id: string;
  primaryText: string;
  secondaryText?: string;
  // For simplicity, we might initially skip item-specific icons or use a predefined set by name.
  // iconName?: string; 
}

export interface ListWidgetConfig {
  title?: string;
  items: ListWidgetItem[];
  ordered?: boolean;
}

export interface GaugeWidgetConfig {
  title: string;
  value: number;
  minValue?: number; // Defaults to 0
  maxValue: number;  // Defaults to 100
  unit?: string;
  valueColor?: string; // Tailwind class for the value text, e.g., 'text-sky-300'
  // Defines colored segments of the gauge arc.
  // 'stop' is a percentage of (value - minValue) / (maxValue - minValue)
  // Example: [{ stop: 0.5, color: '#ff0000' }, { stop: 1, color: '#00ff00' }]
  // If not provided, a single color can be used for the value arc.
  arcColors?: { stop: number; color: string }[]; 
  baseArcColor?: string; // Color for the unfilled part of the arc, e.g., '#374151' (slate-700)
  valueText?: string; // Optional text to display instead of the numeric value (e.g., "High", "Low")
}

export interface DetailsWidgetItem {
  id: string;
  key: string;
  value: string | number;
  // iconName?: string; // Optional: for an icon next to the key
}

export interface DetailsWidgetConfig {
  title?: string;
  items: DetailsWidgetItem[];
}


export type WidgetConfig = 
  | KpiGridWidgetConfig 
  | ChartGridWidgetConfig 
  | RichTextWidgetConfig
  | IndicatorWidgetConfig
  | EmbeddedContentWidgetConfig
  | TableWidgetConfig
  | ListWidgetConfig
  | GaugeWidgetConfig
  | DetailsWidgetConfig; // Added DetailsWidgetConfig

export interface Widget<TConfig extends WidgetConfig = WidgetConfig> {
  id: string;
  type: WidgetType;
  config: TConfig;
}
// End New Widget System

export interface MetricData {
  widgets: Widget[]; 
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  icon: (props: { className?: string }) => React.ReactNode;
  accentColor: string; // Tailwind color class for borders/accents e.g., 'border-blue-500'
  bgColor: string; // Tailwind color class for background e.g., 'bg-blue-500'
  textColor: string; // Tailwind text color for card title e.g., 'text-blue-700'
  data: MetricData;
}

// Auth types remain the same
export enum UserRole {
  VIEWER = 'Viewer',
  EDITOR = 'Editor',
  ADMIN = 'Admin',
}

export interface User {
  email: string;
  role: UserRole;
}

export interface AccessRequest {
  id: string;
  email: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface MainCategoryDisplay {
  id: string;
  title: string;
  description?: string;
  icon?: (props: { className?: string }) => React.ReactNode;
  metrics: Metric[];
}