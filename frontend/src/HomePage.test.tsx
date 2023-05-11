import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import { HomePage } from "./HomePage";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup);

jest.mock("./QuestionsData", () => ({
  getUnansweredQuestions: jest.fn(() => {
    return Promise.resolve([
      {
        questionId: 1,
        title: "Title1 test",
        content: "Content2 test",
        userName: "User1",
        created: new Date(2019, 1, 1),
        answers: [],
      },
      {
        questionId: 2,
        title: "Title2 test",
        content: "Content2 test",
        userName: "User2",
        created: new Date(2019, 1, 1),
        answers: [],
      },
    ]);
  }),
}));

test("When HomePage first rendered, loading indicator should show", async () => {
  render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
  const loading = await screen.findByText("Loading...");
  expect(loading).not.toBeNull();
});

test("When HomePage data returned, it should render questions", async () => {
  render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
  expect(await screen.findByText("Title1 test")).toBeInTheDocument();
  expect(await screen.findByText("Title2 test")).toBeInTheDocument();
});
