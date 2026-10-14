import { Project, Enquiry, AdminStats, ApiResponse } from '../types';

const API_BASE = '/api';

export const api = {
  // Projects
  async getProjects(params?: { category?: string; search?: string; featured?: boolean }, token?: string): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.featured) query.append('featured', 'true');

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/projects?${query.toString()}`, { headers });
    const json: ApiResponse<Project[]> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to fetch projects');
    }
    return json.data || [];
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${slug}`);
    const json: ApiResponse<Project> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to load project details');
    }
    return json.data!;
  },

  async createProject(project: Partial<Project>, token: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(project)
    });
    const json: ApiResponse<Project> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to create project');
    }
    return json.data!;
  },

  async updateProject(id: string, project: Partial<Project>, token: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(project)
    });
    const json: ApiResponse<Project> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to update project');
    }
    return json.data!;
  },

  async deleteProject(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const json: ApiResponse = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to delete project');
    }
  },

  async seedProjects(token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/seed`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const json: ApiResponse = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to restore default projects');
    }
  },

  // Enquiries
  async submitEnquiry(data: {
    fullName: string;
    email: string;
    phone?: string;
    projectType: string;
    message: string;
  }): Promise<{ success: boolean; message: string; telegramDelivered?: boolean; telegramNotice?: string }> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to submit enquiry');
    }
    return json;
  },

  async getEnquiries(token: string): Promise<Enquiry[]> {
    const res = await fetch(`${API_BASE}/admin/enquiries`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const json: ApiResponse<Enquiry[]> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to load enquiries');
    }
    return json.data || [];
  },

  async updateEnquiryStatus(id: string, status: string, token: string): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const json: ApiResponse<Enquiry> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to update enquiry status');
    }
    return json.data!;
  },

  async deleteEnquiry(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const json: ApiResponse = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to delete enquiry');
    }
  },

  // Telegram Test
  async testTelegram(token: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/admin/telegram-test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Telegram test message delivery failed');
    }
    return json;
  },

  // Stats
  async getAdminStats(token: string): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const json: ApiResponse<AdminStats> = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to load system stats');
    }
    return json.data!;
  },

  // Auth
  async adminLogin(email: string, password: string): Promise<{ token: string; admin: { authenticated: boolean; name: string } }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Authentication failed');
    }
    return { token: json.token, admin: json.admin };
  },

  async checkAdminSession(token: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/admin/check-session`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async adminLogout(token: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch {
      // ignore
    }
  }
};
