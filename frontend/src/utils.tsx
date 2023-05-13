export const validateUser = async () => {
    return fetch("/api/session", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      credentials: "same-origin",
    })
      .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
      .then((obj) => {
        return obj.body.valid;
      });
}