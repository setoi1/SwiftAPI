export type Header = {
    page: string;
    href: string;
    showWhenLoggedIn: boolean;
}

export type ApiCardData = {
    api_id: string,
    api_name: string,
    api_description: string,
    api_access_token: string,
    path: string,
    api_unique_id: string
}

export type User = {
    signedIn: boolean;
    setSignedIn?: any;
}