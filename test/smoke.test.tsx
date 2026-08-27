import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";

describe("test harness", () => {
  test("runs assertions", () => {
    expect(1).toBe(1);
  });

  test("renders into a DOM", () => {
    render(<div>harness ok</div>);
    expect(screen.getByText("harness ok")).toBeInTheDocument();
  });
});
