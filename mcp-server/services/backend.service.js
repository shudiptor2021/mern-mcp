export const disconnectGoogleCalendar = async (userId) => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/auth/google/calendar/disconnect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      }
    );

    const data = await response.json();

    console.log(
      "Backend Google disconnect response:",
      data
    );

    return data;

  } catch (error) {
    console.error(
      "Failed to disconnect Google Calendar:",
      error
    );

    throw error;
  }
};

