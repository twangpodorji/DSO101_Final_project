// import React from "react";
// import { render, screen, waitFor } from "@testing-library/react";
// import App from "./App"; // Make sure this points correctly to your component
// import fetchMock from "jest-fetch-mock";

// beforeEach(() => {
//   fetchMock.resetMocks();
// });

// describe("App Component - Backend Connection", () => {
//   it("displays backend response after fetch", async () => {
//     // Mock the backend response
//     fetchMock.mockResponseOnce(
//       JSON.stringify({ message: "Backend is running!" })
//     );

//     render(<App />);

//     // Check initial loading state
//     expect(
//       screen.getByText("Trying to reach backend...")
//     ).toBeInTheDocument();

//     // Wait for backend response to be rendered
//     await waitFor(() =>
//       expect(
//         screen.getByText("Backend responded with following message:")
//       ).toBeInTheDocument()
//     );

//     expect(screen.getByText(/Backend is running!/)).toBeInTheDocument();
//   });
// });
