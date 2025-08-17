import axios from "axios";

const handleProviderError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error(error.response?.data);
    return error.response?.data;
  } else {
    console.error(error);
    return { status: 'error', message: 'Unknown error' };
  }
}

export default handleProviderError;