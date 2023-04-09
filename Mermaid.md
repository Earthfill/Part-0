sequenceDiagram
    participant user
    participant webpage
    participant server

    user->>webpage: Enters note text
    webpage-->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    server-->>webpage: Receives note data
    webpage-->>user: Shows success message
    user->>webpage: Clicks submit button
    webpage-->>webpage: Validates input