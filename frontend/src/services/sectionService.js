import api from './api';

export const sectionService = {
  /**
   * Fetch all active sections with their live enrolled student count
   */
  async getSections() {
    const response = await api.get('/sections');
    return response.data;
  },

  /**
   * Fetch students belonging to a section by Section ID with search & pagination
   */
  async getSectionStudents(sectionId, { search = '', page = 1, limit = 10 } = {}) {
    const response = await api.get(`/sections/${sectionId}/students`, {
      params: { search, page, limit }
    });
    return response.data;
  },

  /**
   * Fetch students belonging to a section by Section Name (e.g. "Section A")
   */
  async getSectionStudentsByName(sectionName, { search = '', page = 1, limit = 10 } = {}) {
    const response = await api.get(`/sections/by-name/${encodeURIComponent(sectionName)}/students`, {
      params: { search, page, limit }
    });
    return response.data;
  }
};
