import { validateIndustry, buildReport } from "./functionCallingImpl";

export const tools = [
  {
    type: "function",
    function: {
      name: "validateIndustry",
      description:
        "Validate if a company is in the food and beverage industry using the validation API.",
      parameters: {
        type: "object",
        properties: {
          company: {
            type: "string",
            description: "The name of the company to validate",
          },
        },
        required: ["company"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "buildReport",
      description:
        "Save a completed onboarding report to the server. Use this when all required information is collected and validated.",
      parameters: {
        type: "object",
        properties: {
          companyName: { type: "string", description: "The company name" },
          userRole: { type: "string", description: "The user's role or position" },
          researchObjective: { type: "string", description: "The user's research objective" },
          idealOutput: { type: "string", description: "The ideal output format (e.g., PowerPoint)" },
          apiValidated: { type: "boolean", description: "Indicates if the company was confirmed as a food and beverage industry match by the API. This value comes from validateIndustry API industryMatch: true" }        },
        required: ["companyName", "userRole", "researchObjective", "idealOutput", "apiValidated"],
      },
    },
  },
];

export const TOOL_MAPPING = {
  validateIndustry,
  buildReport,
};
