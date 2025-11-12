import { render, screen } from "@testing-library/react";
import { Footer } from "../Footer";

describe("Footer", () => {
  it("renders copyright text with current year", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} MyApp. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("bg-gray-50", "border-t", "mt-auto");
  });
});

