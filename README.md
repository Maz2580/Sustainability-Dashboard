# Sustainability-Dashboard

# V3 Sustainability Dashboard

An interactive dashboard showcasing the University of Melbourne's sustainability performance across academic, operational, and community areas, tracking progress towards Sustainability Plan 2030 targets.

## Key Features

*   **Interactive Dashboards:** View detailed metrics for various sustainability categories.
*   **Categorized Metrics:** Data organized into main categories like "Teaching and Research" and "Operations."
*   **Rich Data Visualization:** Utilizes a variety of widgets:
    *   **KPI Grids:** Display key performance indicators.
    *   **Chart Grids:** Show data through Bar, Line, Pie, and Area charts.
    *   **Rich Text Blocks:** Provide contextual information and descriptions.
    *   **Indicators:** Highlight single important values with optional trend indicators.
    *   **Embedded Content:** Integrate external content via iframes.
    *   **Tables:** Display structured data, with an option to populate from CSV.
    *   **Lists:** Present ordered or unordered lists of items.
    *   **Gauges:** Visualize progress towards a target.
    *   **Details Blocks:** Show key-value pair information.
*   **User Authentication:**
    *   **Admin Role:** Full control, can manage users and edit all dashboards.
    *   **Editor Role:** Can edit dashboards.
    *   **Viewer Role:** Can view dashboards.
*   **Admin Panel:** Admins can approve/deny editor access requests and revoke existing editor access.
*   **Dashboard Editor:** A visual interface for Admins and Editors to:
    *   Add new widgets to a dashboard.
    *   Remove existing widgets.
    *   Reorder widgets.
    *   Configure the content and appearance of each widget.
*   **Responsive Design:** Adapts to various screen sizes for accessibility on different devices.
*   **Local Persistence:** User sessions, access requests, editor lists, and dashboard configurations are saved in `localStorage`.

## Tech Stack

*   **React:** For building the user interface.
*   **TypeScript:** For static typing and improved code quality.
*   **Tailwind CSS:** A utility-first CSS framework for styling.
*   **Recharts:** A composable charting library.
*   **Papaparse:** For parsing CSV files in the Table widget editor.
*   **(Potential/Planned): Google Gemini API** for AI-driven insights and content generation (Note: API key management via `process.env.API_KEY` would be required for such features).

## Getting Started

1.  **Prerequisites:** A modern web browser.
2.  **Running the Application:**
    *   Clone or download the project files.
    *   Open the `index.html` file directly in your web browser.
    *   No build step is required for the current setup as it uses ES modules and CDNs.
3.  **(For Future Gemini API Integration):** If features using the Google Gemini API are implemented, you would need to ensure an API key is available as an environment variable `process.env.API_KEY`. The application is designed to pick this up automatically. **Do not embed API keys directly in the code.**

## Project Structure

*   `index.html`: The main HTML entry point for the application.
*   `index.tsx`: The main React/TypeScript entry point, renders the `App` component.
*   `App.tsx`: The root React component, manages global state, routing (modals), and layout.
*   `components/`: Contains all reusable React components:
    *   `MetricCard.tsx`: Card displaying a summary of a metric.
    *   `DashboardModal.tsx`: Modal to display detailed metric dashboards with various widgets.
    *   `DashboardEditorModal.tsx`: Modal for editing the structure and content of dashboards.
    *   `AuthModal.tsx`: Modal for user login and access requests.
    *   `AdminPanelModal.tsx`: Modal for admin to manage user access.
    *   `UserMenu.tsx`: Dropdown menu for logged-in users.
    *   `GenericChart.tsx`: Component for rendering different types of charts.
    *   `KpiCard.tsx`: Component for displaying individual KPIs.
    *   `Icons.tsx`: Collection of SVG icons used throughout the application.
    *   Widget-specific editor forms and renderers are co-located or referenced within `DashboardModal.tsx` and `DashboardEditorModal.tsx`.
*   `types.ts`: Defines all TypeScript interfaces and enums used in the application.
*   `constants.ts`: Contains initial dashboard data structures, metric definitions, color schemes, and the default admin email.
*   `metadata.json`: Contains application metadata like name and description.
*   `README.md`: This file.

## Authentication & Authorization

*   **Roles:**
    *   **Admin:** The user with the email specified as `ADMIN_EMAIL` in `constants.ts` (default: `mazdak.gh1995@gmail.com`). Has full access, including user management and editing all dashboards.
    *   **Editor:** Users approved by an Admin. Can edit dashboards.
    *   **Viewer:** Any user not logged in or without special roles. Can only view dashboards.
*   **Login/Access Request:**
    *   Users can log in with their email.
    *   If an email matches the `ADMIN_EMAIL`, the user gets Admin privileges.
    *   If an email is in the `approvedEditors` list (managed by Admins), the user gets Editor privileges.
    *   Otherwise, entering an email submits an access request to the Admins.
*   **Admin Panel:** Accessible to Admins to:
    *   View pending access requests.
    *   Approve or deny requests.
    *   View and revoke access for currently approved editors.

## Dashboard Editing

Admins and Editors can customize dashboards:

1.  **Open a Dashboard:** Click on a metric card from the main page.
2.  **Enter Edit Mode:** In the dashboard modal, click the "Edit" button (visible to authorized users).
3.  **Dashboard Editor:**
    *   **Add Widgets:** Click "Add Widget" and select from available types (KPI Grid, Chart Grid, Rich Text, etc.).
    *   **Reorder Widgets:** Use the up/down arrows next to each widget in the list.
    *   **Configure Widgets:** Click the pencil icon next to a widget to open its specific configuration form (e.g., edit title, content, data source for tables, items for lists).
    *   **Remove Widgets:** Click the trash icon next to a widget.
    *   **Save Changes:** Click "Save Dashboard" to persist the new layout and content to `localStorage`.

## Available Widgets

The dashboard supports the following widget types for displaying data:

*   **KPI Grid:** A section to display multiple `KpiCard` components.
*   **Chart Grid:** A section to display multiple `GenericChart` components (Bar, Line, Pie, Area).
*   **Rich Text:** A block for formatted text content using HTML.
*   **Indicator:** Displays a single, prominent value, optionally with a unit, description, and trend.
*   **Embedded Content:** Allows embedding external web pages or applications via an iframe.
*   **Table:** Displays tabular data. Can be configured manually or by uploading a CSV file.
*   **List:** Displays an ordered (numbered) or unordered (bulleted) list of items.
*   **Gauge:** A radial gauge to visualize a value against a minimum and maximum, with configurable color segments.
*   **Details:** A block to display key-value pairs of information.

## Customization

*   **Initial Data:** The primary way to customize the content and structure of the dashboards initially is by modifying the `INITIAL_MAIN_CATEGORIES_DATA` object in `constants.ts`. This file defines the main categories, metrics, and their default widget configurations.
*   **Styling:** Tailwind CSS classes are used throughout. Theme colors and accents for metrics are defined in `constants.ts`.
*   **Icons:** SVG icons are managed in `components/Icons.tsx`.

## Potential Future Enhancements

*   **Direct Database Integration:** Connect to a backend database for dynamic data fetching instead of relying solely on `constants.ts` and `localStorage`.
*   **Advanced Chart Configuration:** More detailed options for charts within the editor.
*   **User Profile Management:** Allow users to change their details.
*   **AI-Powered Insights (Gemini API):**
    *   Generate summaries for dashboard sections.
    *   Provide data interpretation or suggestions.
    *   Enable natural language querying of data.
*   **Export/Import Dashboards:** Allow users to save and share dashboard configurations.
*   **Version History for Dashboards:** Revert to previous dashboard states.
