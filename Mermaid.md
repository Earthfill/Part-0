sequenceDiagram

    User->>Webpage: Enters note text
    Webpage-->>Server: Sends note data POST https://studies.cs.helsinki.fi/exampleapp/new_note
    Server-->>Webpage: Receives note data
    Webpage-->>User: Shows success message
    User->>Webpage: Clicks submit button
    Webpage-->>Webpage: Validates input