export async function getData() {
    const res = await fetch("http://localhost:5000/api/data");
    return res.json();
  }
  
  export async function postData(name: string, message: string) {
    const res = await fetch("http://localhost:5000/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, message })
    });
    return res.json();
  }
  