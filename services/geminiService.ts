import { GoogleGenAI } from "@google/genai";
import { FileAttachment } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getSystemInstruction = (language: string) => `
You are "JamoviStats & Dev Expert", a high-level expert in statistics for research, advanced Jamovi usage, and a web developer.

**Language & Output:**
- **CRITICAL:** You must respond in the "${language}" language unless specifically asked otherwise.
- If the language is Thai ('th'), use professional academic Thai (ภาษาไทยเชิงวิชาการ).
- If the language is Chinese ('zh'), use Simplified Chinese (简体中文).

**Core Objectives:**
1. **Research Statistical Consulting:** Advise on statistical selection, research design, and assumption checking.
2. **Jamovi Mastery:** Teach Jamovi usage in detail, referencing https://docs.jamovi.org/.
3. **Interpretation:** Translate statistical results into Academic style (APA Style).
4. **Data Analysis:** If provided with a CSV, Image, or PDF of data/results, analyze it thoroughly.
5. **Web App Support:** Explain how the current web tools relate to Jamovi features.

**Guidelines:**
- **Assumption Checking:** Always mention assumptions (Normality, Homogeneity, etc.) before recommending a test.
- **Methodology:** Cover Descriptive, T-test, ANOVA, Regression, Factor Analysis (EFA/CFA), SEM, Mediation/Moderation.
- **Effect Size:** Emphasize Effect Size (Cohen's d, Partial Eta Squared).
- **Jamovi Navigation:** Be specific (e.g., "Go to Analyses > Exploration > Descriptives"). Mention modules like 'jpower', 'medmod', 'scatr'.
- **Formatting:** Use Markdown. Use Bold for key terms. Use Tables for presenting data or comparisons.

**Communication Style:**
- **Tone:** Professional, Neutral, Reliable.
- **Output:** Provide APA style sentences for interpretation.

**Constraints:**
- Do not make definitive claims if data is insufficient.
- Always remind users to install modules via "Modules (+)" if needed.
`;

export const getConsultationResponse = async (
    userMessage: string, 
    attachments: FileAttachment[] = [],
    history: {role: string, parts: {text: string}[]}[] = [],
    language: string = 'th'
) => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Transform history for the SDK
    const chatHistory = history.map(h => ({
        role: h.role,
        parts: h.parts
    }));

    const chat = ai.chats.create({
      model: model,
      history: chatHistory,
      config: {
        systemInstruction: getSystemInstruction(language),
        temperature: 0.7,
      },
    });

    // Construct the current message parts
    const messageParts: any[] = [{ text: userMessage }];
    
    // Add attachments if any
    if (attachments && attachments.length > 0) {
        attachments.forEach(file => {
            messageParts.push({
                inlineData: {
                    mimeType: file.mimeType,
                    data: file.data // Base64 string
                }
            });
        });
    }

    const result = await chat.sendMessage({ 
        message: messageParts.length === 1 && !attachments.length ? userMessage : messageParts 
    });
    
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const performStatisticalAnalysis = async (
  analysisType: string,
  dataContext: string,
  attachments: FileAttachment[] = []
) => {
  if (!API_KEY) throw new Error("API Key is missing.");

  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      **TASK:** Perform a rigorous statistical analysis: "${analysisType}".
      
      **DATA CONTEXT:** 
      ${dataContext}
      
      **REQUIREMENTS:**
      1. **Data Cleaning:** Briefly mention how data was interpreted (N, Missing values).
      2. **Descriptive Stats:** Provide a Markdown table of Means, SDs, etc.
      3. **Assumption Checks:** Explicitly state if assumptions (Normality, Homogeneity) appear met or violated based on the data provided.
      4. **Inferential Statistics:** Perform the calculation for ${analysisType}. Present the Results (F-value, t-value, Chi-square, p-value, df) in a clear Markdown Table.
      5. **Interpretation (Thai):** Write the results in standard Academic Thai (APA Style).
      6. **Visual Description:** Describe what the graph would look like.
      
      **FORMAT:**
      - Use H2 (##) for main sections.
      - Use strict Markdown tables.
    `;

    const messageParts: any[] = [{ text: prompt }];

    if (attachments && attachments.length > 0) {
      attachments.forEach(file => {
        messageParts.push({
          inlineData: {
            mimeType: file.mimeType,
            data: file.data
          }
        });
      });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: messageParts },
      config: {
        systemInstruction: getSystemInstruction('th'),
        temperature: 0.2, // Lower temperature for calculation precision
      }
    });

    return response.text;

  } catch (error) {
    console.error("Statistical Analysis Error:", error);
    throw error;
  }
};