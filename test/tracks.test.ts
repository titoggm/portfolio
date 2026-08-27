import { describe, expect, test } from "bun:test";
import { formatTime, TRACKS, youtubeId } from "@/lib/tracks";

describe("youtubeId", () => {
  test("pulls the id out of an embed URL", () => {
    expect(
      youtubeId("https://www.youtube.com/embed/PHEbmPRBuU8?si=Lf8eVViO19JAHkVP")
    ).toBe("PHEbmPRBuU8");
  });

  test("keeps ids that start with a dash intact", () => {
    expect(youtubeId("https://www.youtube.com/embed/-1PgQkGPQXE?si=x")).toBe(
      "-1PgQkGPQXE"
    );
  });

  test("throws on anything that is not an embed URL", () => {
    expect(() => youtubeId("https://youtu.be/PHEbmPRBuU8")).toThrow();
  });

  test("every track resolves to an id", () => {
    // The player is driven by ids, so a malformed entry would break playback.
    for (const track of TRACKS) {
      expect(youtubeId(track.src)).toHaveLength(11);
    }
  });
});

describe("formatTime", () => {
  test("formats under an hour as mm:ss", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(9)).toBe("00:09");
    expect(formatTime(198)).toBe("03:18");
  });

  test("formats an hour and over as h:mm:ss", () => {
    expect(formatTime(3600)).toBe("1:00:00");
    expect(formatTime(3725)).toBe("1:02:05");
  });

  test("falls back to zero rather than a placeholder", () => {
    // The readout is fixed-width from mount, so an unknown duration reads 00:00.
    expect(formatTime(null)).toBe("00:00");
    expect(formatTime(Number.NaN)).toBe("00:00");
    expect(formatTime(-1)).toBe("00:00");
  });
});
