export interface StudentProfile {
    id: number;
    user: number;
    full_name: string;
    email: string;
    institution: string;
    career: string;
    study_level: string;
    area_interest: string;
    bio: string;
    connection_status?: 'pending' | 'accepted' | 'rejected' | null;
}

export interface Comment {
    id: number;
    author_name: string;
    content: string;
    created_at: string;
}

export interface Post {
    id: number;
    author_name: string;
    author_institution: string;
    content: string;
    created_at: string;
    comments: Comment[];
    comments_count: number;
}

export interface ConnectionRequest {
    id: number;
    from_user: number;
    from_email: string;
    from_institution: string;
    status: 'pending' | 'accepted' | 'rejected';
}

export interface Message {
    id: number;
    sender: number;
    sender_email: string;
    receiver: number;
    content: string;
    is_read: boolean;
    timestamp: string;
}