# AI Voice Chat Challenge - Starter Template

Run 
```
npm run dev
```

Test 
```
npm run test
```

## Asumptions:
- Users will access the onboarding flow via a modern web browser that supports the Web Speech API.
- Voice input is only available in supported browsers; otherwise, users can use text input.
- The OpenAI API key is available and valid for LLM interactions.
- The mocked industry validation API always returns a positive match for demonstration purposes.
- User identity is not explicitly captured.
- File system persistence is only used for local development/testing.
- No real company data or external APIs are called; all enrichment is mocked or described.

## Architectural Decisions:
- Frontend: Built with React and TypeScript for modularity and type safety.
- Voice Input: Utilizes react-speech-recognition (Web Speech API) for real-time voice transcription.
- Conversational Flow: Managed by a prompt-driven agent loop, with fallback to text input.
- Backend: Node.js/Express server handles mocked API endpoints and file persistence.
- LLM Integration: Uses OpenAI API for conversational intelligence and streaming responses.
- Testing: Includes unit and integration tests using Vitest.
- Persistence: Stores transcripts and reports in a local JSON file for simplicity.
- Extensibility: Code is structured to allow easy addition of advanced agentic features (e.g., company research, industry analysis).
- Security: Prompt injection protection and advanced validation are noted as future improvements.

## Development Tools:
  - **Cursor**: Used for code navigation and refactoring.
  - **Claude**: Assisted in brainstorming and refining.
  - **GitHub Copilot**: Provides code suggestions and boilerplate.

# Points of improvement for next iteration
- Upgrade react-speech-recognition to use polyfill to be available in more browsers (Not implemented because it requires a AzureSpeechRecognition KEY)
- Node.js  voice input API fallback for environments where the browser API is unsupported.
- Move LLM call's to backend to provide rate limits, and control usage.
- Add fallback LLM query (Different model)
- Add RAG implementation to retrieve company information
- Implement business intelligence modules.
- Add automated tests for agentic flows like prompt injection, and agent manipulation.
- Add prompt shilding for user queries and LLM generated content. (To avoid prompt injection).
- Monitor and log API usage for analytics and debugging.

# Advanced Agentic Capabilities - Implementation Strategy
This outlines the implementation strategy for an intelligent research agent that automatically gathers business intelligence when customers mention their company during chatbot conversations.
When a customer says something like "I work at X" or "our company Blue Bottle Coffee ..." the LLM will automatically trigger the api/validate-industry API. The system then launches several concurrent async or concurrent calls to gather information about that company while the conversation continues naturally. Depending on the desired usage of this data, this information can be added as context to the LLM once it's completed or can be saved in the final report.
## Data Source Strategy
We can rely on 3 primary services that provide the data.
**NewsAPI** serves as our industry intelligence search with filtering capabilities for food and beverage industry content. This allows us to identify current market trends, regulatory changes, consumer behavior shifts, and emerging technologies affecting the F&B sector. The API returns structured JSON data with publication dates, source credibility, and content categorization, making it ideal for automated analysis.
**Clearbit's Enrichment API** This service takes a company name or domain and returns comprehensive business profiles including employee count, industry classification, funding history, technology stack, and social media presence. Clearbit aggregates data from multiple sources.
**Playwright** This browser automation framework that can navigate websites. This allows us to extract information directly from company websites, including mission statements, product catalogs, press releases, and executive team information. Playwright simulates real user behavior, which helps us respect website terms of service while gathering publicly available information.

## Technical Considerations
### Data Synthesis Pipeline
Since we are collecting structured JSON from NewsAPI, company profiles from Clearbit, and unstructured content from Playwright web scraping, we'll add a layer to merge these different data formats into coherent insights using an LLM to process the raw collected data, feed it the company profile, recent news mentions, and scraped website content, then prompt it to generate analysis about the company's F&B industry position, potential challenges, and relevant opportunities.

### Error Handling & Resilience
We'll implement timeout configurations for each service and continue processing with whatever data is available. If Clearbit fails but NewsAPI and web scraping succeed, we can still provide valuable industry context even without the detailed company profile.
### Rate Limiting & API Management
We can implement a request queue system that spaces out API calls appropriately and tracks usage to prevent unexpected costs or service blocks. Besides that we can add a cache layer with a retention period of 30 days for data from Clearbit since it's unlikely to change often, and we can implement a retention of 1 day or a couple of hours for our NewsAPI call.

### Processing Timeline
The async research needs to complete before report generation, so we need to add a coordination logic. We can set a reasonable timeout for the entire research pipeline, then proceed with report generation using whatever data was successfully gathered within that window.