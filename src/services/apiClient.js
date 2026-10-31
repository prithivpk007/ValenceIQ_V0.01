// API Client helper - returns promises, structured to swap with Axios in Phase 2
export const mockDelay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const createApiResponse = (data, message = "Success") => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString(),
});

export const createApiError = (message = "An error occurred", status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
