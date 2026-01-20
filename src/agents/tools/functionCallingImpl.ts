// Tool to validate if a company is in the food and beverage industry
export async function validateIndustry({
  company,
}: {
  company: string;
}): Promise<{ isFoodAndBeverage: boolean }> {
  console.log("Validating industry for company:", company);
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3002";
  const response = await fetch(
    `${serverUrl}/api/validate-industry?company=${encodeURIComponent(company)}`
  );
  if (!response.ok) {
    const data = await response.json();
    return data;
  }
  const data = await response.json();
  console.log("Industry validation response:", data);
  return data;
}

// Tool to build and save a report
export async function buildReport({
  companyName,
  userRole,
  researchObjective,
  idealOutput,
  apiValidated,
  transcript: _transcript, // ignore incoming transcript, use sessionStorage
}: {
  companyName: string;
  userRole: string;
  researchObjective: string;
  idealOutput: string;
  apiValidated: boolean;
  transcript?: Array<{ sender: string; message: string; timestamp?: string }>;
}): Promise<{ message: string }> {
  // Read transcript from session storage
  let transcript: Array<{ sender: string; message: string; timestamp?: string }> = [];
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("agent_transcript");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        transcript = Array.isArray(parsed)
          ? parsed.map((msg) => ({
              sender: msg.role || msg.sender,
              message: msg.content || msg.message,
              timestamp: msg.timestamp,
            }))
          : [];
      } catch {}
    }
  }
  console.log("Building report with data:", {
    companyName,
    userRole,
    researchObjective,
    idealOutput,
    apiValidated,
    transcript,
  });
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${serverUrl}/api/saveReport`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "complete",
      data: {
        companyName,
        userRole,
        researchObjective,
        idealOutput,
      },
      apiValidated,
      transcript,
    }),
  });
  if (!response.ok) {
    const data = await response.json();
    return data;
  }
  console.log("Report saved successfully");
  const data = await response.json();
  return data;
}
