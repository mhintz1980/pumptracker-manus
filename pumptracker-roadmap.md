# PumpTracker Roadmap


## High Priority ~ Make it Production~Ready


### Add Lovable Cloud (Backend)
- Replace mock data with real database
- Enable data persistence across sessions
- Set up user authentication (login~logout)
- Store pumps, POs, schedules, and customers


### Complete Drag~Drop Scheduling
- ✅ Drag handler now schedules unscheduled pumps directly into NOT STARTED with model-aware lead times
- ⬜ Implement drag~to~reschedule for already~scheduled jobs
- ✅ Visual feedback (highlighted drop cells, scheduling toasts)
- ⬜ Handle job rollover when spans exceed week boundaries


### Add CRUD Operations
- Create~edit~delete pumps from any view
- Manage purchase orders and line items
- Customer management system
- Stage~status updates with audit trail


---


## Medium Priority ~ Enhanced Functionality


### Conflict Detection & Validation
- Prevent double~booking resources
- ✅ Capacity warnings via per-stage WIP limit glow + inline count/limit display
- Promise date vs scheduled date alerts
- Color~code overdue or at~risk jobs


### Search & Advanced Filtering
- ✅ Global search across pumps, POs, customers
- Date range filters on scheduling page
- Multi~select filters (priorities, stages, colors)
- Save filter presets


### Reporting & Export
- Print~PDF weekly schedules
- Export pump lists to CSV~Excel
- Performance reports (on~time delivery %)
- Revenue forecasting based on schedule


---


## Lower Priority ~ Polish & Scale


### Real~time Collaboration
- Live updates when others make changes
- User presence indicators
- Change notifications~activity feed


### Mobile Optimization
- Responsive design improvements
- Touch~friendly drag~drop
- Simplified mobile views


### Additional Features
- File attachments (specs, drawings)
- Notes~comments on jobs
- Email notifications for milestones
- Integration with accounting~ERP
