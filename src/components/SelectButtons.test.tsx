import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectButtons } from "./SelectButtons";

const options = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
];

describe("SelectButtons", () => {
  it("optionsの数だけボタンがレンダリングされる", () => {
    render(<SelectButtons value="a" onChange={() => {}} options={options} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect(buttons[0].textContent).toBe("Option A");
    expect(buttons[1].textContent).toBe("Option B");
    expect(buttons[2].textContent).toBe("Option C");
  });

  it("ボタンクリックでonChangeが呼ばれる", async () => {
    const handleChange = vi.fn();
    render(
      <SelectButtons value="a" onChange={handleChange} options={options} />,
    );
    await userEvent.click(screen.getByText("Option B"));
    expect(handleChange).toHaveBeenCalledWith("b");
  });

  it("選択中のボタンにactiveクラスが付く", () => {
    render(<SelectButtons value="b" onChange={() => {}} options={options} />);
    const activeButton = screen.getByText("Option B");
    expect(activeButton.className).toContain("active");
    const inactiveButton = screen.getByText("Option A");
    expect(inactiveButton.className).not.toContain("active");
  });
});
