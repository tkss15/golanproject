export async function getToken() {
    try {
      const response = await fetch(`${process.env.KINDE_ISSUER_URL!}/oauth2/token`, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          audience: `${process.env.KINDE_ISSUER_URL!}/api`,
          grant_type: "client_credentials",
          client_id: `${process.env.KINDE_MACHINE_ID!}`,
          client_secret: `${process.env.KINDE_MACHINE_SECERT}`
        })
      });
  
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      return json;
    } catch (error) {
        if( error instanceof Error)
        {
            console.error(error.message);
        }
        return -1;
    }
  }
