import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import { Page } from "./Page";

afterEach(cleanup);

test("When the Page component is rendered, it should contain the correct title and content", () => {
  render(
    <Page title="Title test">
      <span>Test content</span>
    </Page>
  );
  const title = screen.queryByText("Title test");
  expect(title).not.toBeNull();
  const content = screen.queryByText("Test content");
  expect(content).not.toBeNull();
});
