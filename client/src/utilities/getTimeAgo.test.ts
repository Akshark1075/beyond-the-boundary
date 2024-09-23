import getTimeAgo from "./getTimeAgo";

describe("getTimeAgo", () => {
  beforeEach(() => {
    // Mock the current date to ensure consistent test results
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T00:00:00Z")); // Mock current time
  });

  afterEach(() => {
    jest.useRealTimers(); // Restore real timers after each test
  });

  it('should return "just now" for a timestamp equal to the current time', () => {
    const timestamp = new Date("2024-01-01T00:00:00Z").getTime();
    expect(getTimeAgo(timestamp)).toBe("just now");
  });

  it("should return the correct value for seconds ago", () => {
    const timestamp = new Date("2023-12-31T23:59:50Z").getTime(); // 10 seconds ago
    expect(getTimeAgo(timestamp)).toBe("10 seconds ago");
  });

  it("should return the correct value for minutes ago", () => {
    const timestamp = new Date("2023-12-31T23:58:00Z").getTime(); // 2 minutes ago
    expect(getTimeAgo(timestamp)).toBe("2 minutes ago");
  });

  it("should return the correct value for hours ago", () => {
    const timestamp = new Date("2023-12-31T21:00:00Z").getTime(); // 3 hours ago
    expect(getTimeAgo(timestamp)).toBe("3 hours ago");
  });

  it("should return the correct value for days ago", () => {
    const timestamp = new Date("2023-12-30T00:00:00Z").getTime(); // 2 days ago
    expect(getTimeAgo(timestamp)).toBe("2 days ago");
  });

  it("should return the correct value for weeks ago", () => {
    const timestamp = new Date("2023-12-15T00:00:00Z").getTime(); // 2 weeks ago
    expect(getTimeAgo(timestamp)).toBe("2 weeks ago");
  });

  it("should return the correct value for months ago", () => {
    const timestamp = new Date("2023-11-01T00:00:00Z").getTime(); // 2 months ago
    expect(getTimeAgo(timestamp)).toBe("2 months ago");
  });

  it("should return the correct value for years ago", () => {
    const timestamp = new Date("2022-01-01T00:00:00Z").getTime(); // 2 years ago
    expect(getTimeAgo(timestamp)).toBe("2 years ago");
  });
});
