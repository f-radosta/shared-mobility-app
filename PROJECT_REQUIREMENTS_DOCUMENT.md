Shared Mobility Web Application (MVP) — Technical Overview & Implementation Guide
This document outlines the implementation plan for a modern shared mobility web application (similar to Uber), developed as a Minimum Viable Product (MVP). The application is intended for end users only (drivers and passengers). There is no administrative interface. The MVP must be built using Next.js (App Router), React, Tailwind CSS, and SQLite. It must adhere to a component-based architecture, follow MVC principles, and implement RESTful APIs through Next.js API routes. The application must implement client-side input validation and ensure proper authorization and authentication mechanisms for all user actions involving personal or shared content.

The app is structured around two distinct types of user content: vehicles and rides. Each user must be able to perform full CRUD (Create, Read, Update, Delete) operations on their own data. This means, for example, a driver can create, edit, view, and delete vehicle records they own, while a passenger can manage their ride bookings. Content ownership must be enforced—users should never be allowed to manage content they do not own. Additionally, it must be possible to delete, edit, or view multiple items in bulk, and at least one of the content types must include an image file. In this case, the “vehicle” content type must support image uploads (e.g., a photo of the vehicle).

The application must support pagination, search, and filtering of user content. Each content item should be individually viewable, but users must also be able to browse through larger lists of content in paginated form. Filtering (e.g., by ride status or vehicle type) and keyword-based searching should be implemented. A dashboard interface must be present, showing aggregated statistics such as the total number of rides, recently added vehicles, or popular destinations.

The application must include a GUI interface that reacts conditionally to user state and role. For example, if a user is logged in, the navigation bar should change to include a dashboard link and access to profile or content management screens. Conversely, if the user is not logged in, only the login and registration options should be shown. Similarly, content on the dashboard should adapt based on whether the user is a passenger or a driver.

To support client-side persistence, the app must use the browser's localStorage API. This is required for simple user preferences such as favorite rides, recently viewed vehicles, or cached filters. This data should be scoped per user session where applicable.

An important requirement is to enable indirect user interaction between passengers and drivers. This interaction does not need to be synchronous or include messaging, but it must allow for connection points. A passenger must be able to request a ride based on a vehicle listing. The driver must be able to accept or reject this ride. This establishes a link between two user-created data objects (the ride and the vehicle), representing the shared-use concept.

The app must follow modern development standards and employ component-based design using React. All client-facing views must be implemented as composable, reusable components styled using Tailwind CSS. Application logic must be separated according to the MVC (Model–View–Controller) pattern. Data persistence will be handled by SQLite. All communication between the frontend and the backend must occur via Next.js API routes, implementing a RESTful design. API endpoints must never interact directly with the database from the client. The controller logic in API routes must handle request validation, database operations, and return sanitized data to the frontend.

For authentication, the application will use NextAuth.js or a custom session-based solution. Upon login, user sessions should persist across page refreshes. Role-based access (passenger or driver) must be enforced in both the frontend (conditional rendering) and backend (API route protection). Middleware should be used to secure API endpoints based on user authentication and ownership of data.

For database access and data modeling, Prisma is recommended to interface with SQLite. Prisma allows schema definition, migrations, and query building in a type-safe, modern fashion. The Prisma client will be used only within the API routes (the controller layer).

Form handling and client-side validation should be implemented using React Hook Form, ensuring all user input is validated before submission. Validation must cover required fields, file formats for uploads, minimum and maximum text lengths, and general input sanitization.

To streamline UI development, Tailwind CSS must be used for styling, and pre-built UI primitives from shadcn/ui should be utilized for elements such as buttons, cards, dropdowns, and tabs. For icons, the application should use Lucide or Heroicons, ensuring consistency and modern appearance.

Overall, the system must be secure on a fundamental level. All user input must be validated on the client side before sending to the server, and further validated and sanitized on the backend. User sessions and API requests must be protected from unauthorized access.

In summary, this MVP must provide:

Full CRUD functionality for two distinct content types (vehicles and rides), with image support.

Authenticated, role-based access to user-owned content only.

Paginated, searchable, and filterable lists of user content.

A conditionally rendered interface that adapts based on user login state and role.

A dashboard with aggregated data views.

Asynchronous interaction between users through linked content (e.g., ride requests).

Persistent client-side storage using localStorage.

Component-based React frontend styled with Tailwind and shadcn/ui.

MVC architecture, REST API via Next.js, and SQLite database accessed with Prisma.

Basic but complete application security, including input validation and route protection.

This textual guide should serve as a development blueprint, suitable for feeding into large language models or project planning tools. Let me know if you'd like the app file structure, database schema, or component map next.