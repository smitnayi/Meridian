import {useAuth} from "@/context/AuthContext";


export function useCurrentUser() {
    const {user, loading, isAuthenticated} = useAuth();

    const firstName = user?.first_name || user?.firstName || (user?.name ? user.name.split(' ')[0] : '') || '';
    const lastName = user?.last_name || user?.lastName || (user?.name ? user.name.split(' ').slice(1).join(' ') : '') || '';
    const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : (user?.name || (user?.email ? user.email.split('@')[0] : 'User'));
    const initials = (firstName || lastName) 
        ? `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() 
        : (fullName?.[0] || user?.email?.[0] || 'U').toUpperCase();
    const email = user?.email || '';

    return {
        user,
        firstName,
        lastName,
        fullName,
        initials,
        email,
        loading,
        isAuthenticated
    };
}