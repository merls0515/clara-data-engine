# Clara Answers Automation Pipeline

## System Overview
The Clara Answers Automation Pipeline is a precision data extraction and reconciliation engine designed to streamline the onboarding process for service trade businesses. By leveraging advanced LLM-based parsing, the system transforms raw sales and demo transcripts into production-ready structured data and AI voice agent configurations.

## Architecture
The pipeline follows a robust **V1 -> V2 reconciliation logic**:
1.  **V1 Extraction**: Initial demo transcripts are parsed to extract core business data. Any missing or ambiguous fields are automatically flagged as "unknowns" for targeted follow-up.
2.  **V2 Reconciliation**: Onboarding transcripts are merged with the V1 data. The engine persists existing data, overrides contradictions with newer information, and resolves previously identified unknowns.
3.  **Agent Engineering**: The finalized account memo is used to generate a production-ready Retell AI agent specification, including custom system prompts, dynamic variables, and automated transfer protocols.

## Setup
To run the automation scripts locally:
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Configure Environment**:
    Create a `.env` file and add your `GEMINI_API_KEY`.
3.  **Run Pipeline**:
    ```bash
    npx tsx scripts/account_pipeline.ts
    ```

## LLM Usage
I utilized the **Gemini 1.5 Flash** model via API for the extraction and reconciliation logic. This choice was driven by its high context window, which is essential for processing long transcripts, and its exceptional reasoning capabilities for structured data extraction.

## Project Structure
- `/accounts/`: Final structured data for all processed businesses.
- `/data/transcripts/`: Raw source transcripts (Demo & Onboarding).
- `/scripts/`: Core automation logic for extraction, reconciliation, and versioning.
- `/src/`: React-based dashboard for interactive processing and visualization.
