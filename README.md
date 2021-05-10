*Dashboard Management portal*

- Users can 'tab' between dashboards without refreshing the page
- Disseminate key dashboards to users with a simple interface.
- Management of the menu is shown to Admins only.
- Metadata can be retrieved from System Activity and shown to a user if important.
- Owners can be assigned by Admins to be responsible for maintenance of dashboards.
- Users can report problems to owners.
- Users can comment on dashboards for other users to see.
- Users can use a preconfigured dashboard filter UI across all dashboards (global filters)

TODOs:
- ~Get more interesting Metadata~ Might revisit
- ~Clean up the show/hide panels~
- ~Create an embedded iframe to see the dashboards in the same view~
- Allow users to run sample queries that retrieve PNGs instead of just JSON
- ~Track comments alongside dashboards within Firebase~
- Set comments and metadata inside Looker's DB
- ~Order comments based on time insertion~
- Link the Report a Probem to some sort of ticketing system
- ~Conditionally hiding the management portal from non-Admins~
- Add global filters to a config panel
- ~Convert the result of sample query to a data table~
- Add a taskbar to give users option to see png or data table
- ~Ensure the example query run is a query object, not a text tile~
- Put some more config options in the top header, dark mode? Download?
- Give list of queries from dashboard for users to run? Preselected? 
- ~Make iframe opaque / subdued when the menu opens~
- ~Retrieve sample dashboards from current environment~
- Delete comments