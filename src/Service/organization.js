const API_URL = "/api/organizations";

export const createOrganization = async (data) => {
    const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return response.json();
};

export const verifyOrganizationCode = async (code) => {
    const response = await fetch(`${API_URL}/create/verify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            otp: code
        })
    });

    return response.json();
};

export const joinOrganization = async (organization_id) => {
    const response = await fetch(`${API_URL}/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            organization_id
        })
    });

    return response.json();
};

export const acceptJoinRequest = async (join_request) => {
    const response = await fetch(`${API_URL}/join/accept`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            join_request
        })
    });

    return response.json();
};


export const rejectJoinRequest = async (join_request) => {
    const response = await fetch(`${API_URL}/join/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            join_request
        })
    });

    return response.json();
};

export const getNotifications = async() =>{
    const response = await fetch("/api/notification",{
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    })

    return response.json()
}

export const getAllOrganization = async() =>{
    const response = await fetch(`${API_URL}`,{
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    })

    return response.json()
}

export const getPendingJoinRequests = async() => {
    const response = await fetch("/api/organizations", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    return response.json()
}


export const handleOrganizationUsers = async (organization_id) =>{
    const response = await fetch(`${API_URL}/member?organization_id=${organization_id}`,{
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    }) 
    
    return response.json()
}