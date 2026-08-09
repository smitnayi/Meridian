export async function sendOtp(data){
    const response = await fetch("/api/auth/signup/send-otp", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if(!response.ok){
        throw new Error(result.message)
    }

    return result
}