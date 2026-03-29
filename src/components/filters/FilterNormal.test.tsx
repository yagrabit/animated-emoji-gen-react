import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { FilterNormal } from "./FilterNormal";

describe("FilterNormal", () => {
  const defaultProps = {
    id: "test-svg",
    transforms: ["scale(0.5, 0.5)", "scale(0.3, 0.3)"],
    paths: ["M10 10 H 90 V 90 H 10 Z", "M20 20 L 80 80"],
    color: "#ff0000",
  };

  test("SVG要素がレンダリングされる", () => {
    const { container } = render(<FilterNormal {...defaultProps} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("id")).toBe("test-svg");
  });

  test("pathsの数だけpath要素が生成される", () => {
    const { container } = render(<FilterNormal {...defaultProps} />);
    const pathElements = container.querySelectorAll("path");
    expect(pathElements).toHaveLength(defaultProps.paths.length);
  });

  test("color propが正しくfillに反映される", () => {
    const { container } = render(<FilterNormal {...defaultProps} />);
    const pathElements = container.querySelectorAll("path");
    for (const path of pathElements) {
      expect(path.getAttribute("fill")).toBe("#ff0000");
      expect(path.getAttribute("stroke")).toBe("#ff0000");
    }
  });
});
