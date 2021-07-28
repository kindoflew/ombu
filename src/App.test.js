import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./App";

const MOCK_JOKES = [
  { joke: "test joke 1", id: 1 },
  { joke: "test joke 2", id: 2 },
];

let count = 0;

beforeAll(() => jest.spyOn(window, "fetch"));
afterAll(() => jest.clearAllMocks());
beforeEach(async () => {
  localStorage.clear();
  window.fetch.mockResolvedValue({ json: () => MOCK_JOKES[count++] });
  await waitFor(() => render(<App />));
});
afterEach(() => (count = 0));

describe("App", () => {
  it("should fetch a joke on page load", async () => {
    expect(await screen.findByText("test joke 1")).toBeInTheDocument();
  });

  describe("When a user likes a joke", () => {
    beforeEach(async () => {
      const likeButton = screen.getByText("LIKE");
      await waitFor(() => fireEvent.click(likeButton));
    });

    it("should fetch a new joke after clicking like", async () => {
      expect(await screen.findByText("test joke 2")).toBeInTheDocument();
    });

    it("should be possible to remove a liked joke", async () => {
      const likeList = screen.getByTestId("like-list");
      expect(likeList.childNodes.length).toEqual(1);

      const removeButton = screen.getByText("REMOVE");
      await waitFor(() => fireEvent.click(removeButton));
      expect(likeList.childNodes.length).toEqual(0);
    });
  });

  it("should let a user dislike and undislike a joke", async () => {
    const dislikeButton = screen.getByText("DISLIKE");
    await waitFor(() => fireEvent.click(dislikeButton));

    const dislikeList = screen.getByTestId("dislike-list");
    expect(dislikeList.childNodes.length).toEqual(1);

    const removeButton = screen.getByText("REMOVE");
    await waitFor(() => fireEvent.click(removeButton));
    expect(dislikeList.childNodes.length).toEqual(0);
  });

  it("should let a user choose joke filters", async () => {
    const pun = screen.getByText('Pun');
    await waitFor(() => fireEvent.click(pun));
    expect(window.fetch).toHaveBeenNthCalledWith(2, "https://v2.jokeapi.dev/joke/Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
  });
});
