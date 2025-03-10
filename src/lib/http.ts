export async function HttpRequest<T>(
  url: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: HeadersInit;
  } = {},
): Promise<T> {
  try {
    const { method = "GET", body, headers } = options;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    if (method === "GET") {
      delete fetchOptions.body;
    }

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    throw error;
  }
}
